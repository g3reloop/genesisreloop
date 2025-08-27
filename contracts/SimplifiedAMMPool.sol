// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title SimplifiedAMMPool
 * @notice Community liquidity pool with no yield farming or flash loans
 * @dev Pure constant product AMM for SRL token swaps only
 */
contract SimplifiedAMMPool is ERC20, ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    address public immutable tokenA;
    address public immutable tokenB;
    
    uint112 private reserveA;
    uint112 private reserveB;
    uint32  private blockTimestampLast;
    
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    
    uint16 public feeBps = 30; // 0.3% fee for community treasury
    address public communityTreasury;
    
    uint256 private constant MINIMUM_LIQUIDITY = 10**3;
    
    // Events
    event LiquidityAdded(
        address indexed provider, 
        uint256 amountA, 
        uint256 amountB, 
        uint256 lpMinted
    );
    event LiquidityRemoved(
        address indexed provider, 
        uint256 lpBurned, 
        uint256 outA, 
        uint256 outB
    );
    event SwapExecuted(
        address indexed trader, 
        address tokenIn, 
        uint256 amountIn, 
        uint256 amountOut, 
        uint256 fee
    );
    event Sync(uint112 reserveA, uint112 reserveB);
    event TreasuryUpdated(address treasury);
    event FeeUpdated(uint16 newFeeBps);
    
    constructor(
        address _tokenA,
        address _tokenB,
        address _treasury,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid tokens");
        require(_tokenA != _tokenB, "Identical tokens");
        require(_treasury != address(0), "Invalid treasury");
        
        tokenA = _tokenA;
        tokenB = _tokenB;
        communityTreasury = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOVERNANCE_ROLE, msg.sender);
    }
    
    /**
     * @notice Get current reserves and timestamp
     */
    function getReserves() public view returns (uint112, uint112, uint32) {
        return (reserveA, reserveB, blockTimestampLast);
    }
    
    /**
     * @notice Update reserves and TWAP
     */
    function _update(
        uint256 balanceA, 
        uint256 balanceB, 
        uint112 _reserveA, 
        uint112 _reserveB
    ) private {
        require(balanceA <= type(uint112).max && balanceB <= type(uint112).max, "Overflow");
        
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        
        if (timeElapsed > 0 && _reserveA != 0 && _reserveB != 0) {
            // Update TWAP oracle data
            price0CumulativeLast += uint256(_reserveB) * timeElapsed / _reserveA;
            price1CumulativeLast += uint256(_reserveA) * timeElapsed / _reserveB;
        }
        
        reserveA = uint112(balanceA);
        reserveB = uint112(balanceB);
        blockTimestampLast = blockTimestamp;
        
        emit Sync(reserveA, reserveB);
    }
    
    /**
     * @notice Add liquidity to pool (no yield farming rewards)
     */
    function addLiquidity(
        uint256 amountA,
        uint256 amountB,
        uint256 minLpOut,
        address to
    ) external nonReentrant returns (uint256 lpMinted) {
        require(amountA > 0 && amountB > 0, "Invalid amounts");
        require(to != address(0), "Invalid recipient");
        
        // Transfer tokens
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);
        
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        uint256 _totalSupply = totalSupply();
        
        if (_totalSupply == 0) {
            // First liquidity provider
            lpMinted = Math.sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(1), MINIMUM_LIQUIDITY); // Permanently lock
        } else {
            // Proportional LP tokens
            lpMinted = Math.min(
                (amountA * _totalSupply) / reserveA,
                (amountB * _totalSupply) / reserveB
            );
        }
        
        require(lpMinted >= minLpOut, "Insufficient output");
        require(lpMinted > 0, "Zero liquidity");
        
        _mint(to, lpMinted);
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit LiquidityAdded(msg.sender, amountA, amountB, lpMinted);
    }
    
    /**
     * @notice Remove liquidity from pool
     */
    function removeLiquidity(
        uint256 lpAmount,
        uint256 minA,
        uint256 minB,
        address to
    ) external nonReentrant returns (uint256 outA, uint256 outB) {
        require(lpAmount > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        uint256 _totalSupply = totalSupply();
        
        // Calculate proportional share
        outA = (lpAmount * reserveA) / _totalSupply;
        outB = (lpAmount * reserveB) / _totalSupply;
        
        require(outA >= minA && outB >= minB, "Insufficient output");
        require(outA > 0 && outB > 0, "Zero output");
        
        // Burn LP tokens
        _burn(msg.sender, lpAmount);
        
        // Transfer tokens
        IERC20(tokenA).safeTransfer(to, outA);
        IERC20(tokenB).safeTransfer(to, outB);
        
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit LiquidityRemoved(msg.sender, lpAmount, outA, outB);
    }
    
    /**
     * @notice Swap tokens (no flash loans supported)
     */
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minOut,
        address to
    ) external nonReentrant returns (uint256 amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");
        require(amountIn > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        bool isTokenA = tokenIn == tokenA;
        
        // Transfer input tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Calculate fee
        uint256 fee = (amountIn * feeBps) / 10000;
        uint256 amountInAfterFee = amountIn - fee;
        
        // Calculate output using constant product formula
        uint256 reserveIn = isTokenA ? reserveA : reserveB;
        uint256 reserveOut = isTokenA ? reserveB : reserveA;
        
        amountOut = (amountInAfterFee * reserveOut) / (reserveIn + amountInAfterFee);
        
        require(amountOut >= minOut, "Insufficient output");
        require(amountOut > 0, "Zero output");
        
        // Transfer output tokens
        address tokenOut = isTokenA ? tokenB : tokenA;
        IERC20(tokenOut).safeTransfer(to, amountOut);
        
        // Transfer fee to treasury
        if (fee > 0) {
            IERC20(tokenIn).safeTransfer(communityTreasury, fee);
        }
        
        // Update reserves
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit SwapExecuted(msg.sender, tokenIn, amountIn, amountOut, fee);
    }
    
    /**
     * @notice Update community treasury address
     */
    function setTreasury(address _treasury) external onlyRole(GOVERNANCE_ROLE) {
        require(_treasury != address(0), "Invalid treasury");
        communityTreasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }
    
    /**
     * @notice Update swap fee (max 1%)
     */
    function setFee(uint16 _feeBps) external onlyRole(GOVERNANCE_ROLE) {
        require(_feeBps <= 100, "Fee too high"); // Max 1%
        feeBps = _feeBps;
        emit FeeUpdated(_feeBps);
    }
    
    /**
     * @notice Get quote for swap
     */
    function getAmountOut(
        uint256 amountIn,
        address tokenIn
    ) external view returns (uint256 amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");
        require(amountIn > 0, "Invalid amount");
        
        bool isTokenA = tokenIn == tokenA;
        uint256 reserveIn = isTokenA ? reserveA : reserveB;
        uint256 reserveOut = isTokenA ? reserveB : reserveA;
        
        uint256 fee = (amountIn * feeBps) / 10000;
        uint256 amountInAfterFee = amountIn - fee;
        
        amountOut = (amountInAfterFee * reserveOut) / (reserveIn + amountInAfterFee);
    }
}
