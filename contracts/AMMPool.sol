// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AMMPool
 * @notice Constant product AMM with governance-controlled fees and oracle support
 * @dev Implements x*y=k formula with time-weighted average price (TWAP)
 */
contract AMMPool is ERC20, ReentrancyGuard, AccessControl {
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    address public immutable tokenA;
    address public immutable tokenB;
    
    uint112 private reserveA;
    uint112 private reserveB;
    uint32  private blockTimestampLast;
    
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    
    uint16 public feeBps = 30; // 0.3% default
    address public oracle;
    
    uint256 private constant MINIMUM_LIQUIDITY = 10**3;
    
    // Events
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpMinted);
    event LiquidityRemoved(address indexed provider, uint256 lpBurned, uint256 outA, uint256 outB);
    event SwapExecuted(address indexed trader, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 feeBps);
    event FeeUpdated(uint16 feeBps);
    event OracleUpdated(address oracle);
    event Sync(uint112 reserveA, uint112 reserveB);
    
    constructor(
        address _tokenA,
        address _tokenB,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid tokens");
        require(_tokenA != _tokenB, "Identical tokens");
        
        tokenA = _tokenA;
        tokenB = _tokenB;
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GOVERNANCE_ROLE, msg.sender);
    }
    
    /**
     * @notice Get current reserves and last update timestamp
     * @return reserveA Reserve of token A
     * @return reserveB Reserve of token B
     * @return blockTimestampLast Last update timestamp
     */
    function getReserves() public view returns (uint112, uint112, uint32) {
        return (reserveA, reserveB, blockTimestampLast);
    }
    
    /**
     * @notice Update reserves and price accumulators
     */
    function _update(uint256 balanceA, uint256 balanceB, uint112 _reserveA, uint112 _reserveB) private {
        require(balanceA <= type(uint112).max && balanceB <= type(uint112).max, "Overflow");
        
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        
        if (timeElapsed > 0 && _reserveA != 0 && _reserveB != 0) {
            // Update price cumulative for TWAP oracle
            price0CumulativeLast += uint256(_reserveB) * timeElapsed / _reserveA;
            price1CumulativeLast += uint256(_reserveA) * timeElapsed / _reserveB;
        }
        
        reserveA = uint112(balanceA);
        reserveB = uint112(balanceB);
        blockTimestampLast = blockTimestamp;
        
        emit Sync(reserveA, reserveB);
    }
    
    /**
     * @notice Add liquidity to the pool
     * @param amountA Amount of token A to add
     * @param amountB Amount of token B to add
     * @param minLpOut Minimum LP tokens to receive
     * @param to Address to receive LP tokens
     * @return lpMinted Amount of LP tokens minted
     */
    function addLiquidity(
        uint256 amountA,
        uint256 amountB,
        uint256 minLpOut,
        address to
    ) external nonReentrant returns (uint256 lpMinted) {
        require(amountA > 0 && amountB > 0, "Invalid amounts");
        require(to != address(0), "Invalid recipient");
        
        // Transfer tokens to pool
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
        
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        uint256 _totalSupply = totalSupply();
        
        if (_totalSupply == 0) {
            // First liquidity provider
            lpMinted = Math.sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(1), MINIMUM_LIQUIDITY); // Lock minimum liquidity
        } else {
            // Calculate proportional LP tokens
            lpMinted = Math.min(
                (amountA * _totalSupply) / reserveA,
                (amountB * _totalSupply) / reserveB
            );
        }
        
        require(lpMinted >= minLpOut, "Insufficient LP output");
        require(lpMinted > 0, "Insufficient liquidity minted");
        
        _mint(to, lpMinted);
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit LiquidityAdded(msg.sender, amountA, amountB, lpMinted);
    }
    
    /**
     * @notice Remove liquidity from the pool
     * @param lpAmount Amount of LP tokens to burn
     * @param minA Minimum amount of token A to receive
     * @param minB Minimum amount of token B to receive
     * @param to Address to receive tokens
     * @return outA Amount of token A received
     * @return outB Amount of token B received
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
        
        require(outA >= minA, "Insufficient A output");
        require(outB >= minB, "Insufficient B output");
        require(outA > 0 && outB > 0, "Insufficient liquidity burned");
        
        // Burn LP tokens
        _burn(msg.sender, lpAmount);
        
        // Transfer tokens
        IERC20(tokenA).transfer(to, outA);
        IERC20(tokenB).transfer(to, outB);
        
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit LiquidityRemoved(msg.sender, lpAmount, outA, outB);
    }
    
    /**
     * @notice Swap exact amount of tokens
     * @param tokenIn Address of input token
     * @param amountIn Amount of input tokens
     * @param minOut Minimum output amount
     * @param to Address to receive output tokens
     * @return outAmount Amount of output tokens
     */
    function swapExactTokens(
        address tokenIn,
        uint256 amountIn,
        uint256 minOut,
        address to
    ) external nonReentrant returns (uint256 outAmount) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");
        require(amountIn > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        bool isTokenA = tokenIn == tokenA;
        address tokenOut = isTokenA ? tokenB : tokenA;
        
        // Transfer input tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Apply fee
        uint256 amountInWithFee = amountIn * (10000 - feeBps);
        
        // Calculate output amount using constant product formula
        uint256 numerator;
        uint256 denominator;
        
        if (isTokenA) {
            numerator = amountInWithFee * reserveB;
            denominator = (reserveA * 10000) + amountInWithFee;
        } else {
            numerator = amountInWithFee * reserveA;
            denominator = (reserveB * 10000) + amountInWithFee;
        }
        
        outAmount = numerator / denominator;
        require(outAmount >= minOut, "Insufficient output");
        require(outAmount > 0, "Insufficient output amount");
        
        // Transfer output tokens
        IERC20(tokenOut).transfer(to, outAmount);
        
        // Update reserves
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        _update(balanceA, balanceB, reserveA, reserveB);
        
        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, outAmount, feeBps);
    }
    
    /**
     * @notice Update fee (governance only)
     * @param _feeBps New fee in basis points
     */
    function setFee(uint16 _feeBps) external onlyRole(GOVERNANCE_ROLE) {
        require(_feeBps <= 1000, "Fee too high"); // Max 10%
        feeBps = _feeBps;
        emit FeeUpdated(_feeBps);
    }
    
    /**
     * @notice Update oracle address (governance only)
     * @param _oracle New oracle address
     */
    function setOracle(address _oracle) external onlyRole(GOVERNANCE_ROLE) {
        oracle = _oracle;
        emit OracleUpdated(_oracle);
    }
    
    /**
     * @notice Force reserves to sync with actual balances
     */
    function sync() external nonReentrant {
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        _update(balanceA, balanceB, reserveA, reserveB);
    }
    
    /**
     * @notice Skim excess tokens to caller (protection against donations)
     */
    function skim(address to) external nonReentrant {
        require(to != address(0), "Invalid recipient");
        
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        
        if (balanceA > reserveA) {
            IERC20(tokenA).transfer(to, balanceA - reserveA);
        }
        if (balanceB > reserveB) {
            IERC20(tokenB).transfer(to, balanceB - reserveB);
        }
    }
}

/**
 * @title Math library
 * @dev Provides sqrt function
 */
library Math {
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
