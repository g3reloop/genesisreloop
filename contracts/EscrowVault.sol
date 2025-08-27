// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EscrowVault
 * @notice Multi-asset escrow supporting ERC20, ERC721, and ERC1155
 * @dev Implements secure escrow with deadline-based release and cancellation
 */
contract EscrowVault is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    enum AssetType { ERC20, ERC721, ERC1155 }

    struct Escrow {
        address payer;
        address beneficiary;
        address token;
        uint256 tokenId;     // 0 for ERC20
        uint256 amount;      // for ERC20/1155
        AssetType assetType;
        uint64  deadline;    // unix ts
        bytes32 termsHash;   // IPFS/Arweave hash of off-chain terms
        bool    deposited;
        bool    released;
        bool    cancelled;
    }

    Counters.Counter private _escrowIdCounter;
    mapping(uint256 => Escrow) private _escrows;
    
    // Fee structure (basis points)
    uint16 public feeBps = 30; // 0.3%
    address public feeRecipient;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed beneficiary,
        address token,
        uint256 tokenId,
        uint256 amount,
        AssetType assetType,
        uint64 deadline,
        bytes32 termsHash
    );
    event Deposited(uint256 indexed escrowId);
    event Released(uint256 indexed escrowId, address to);
    event Cancelled(uint256 indexed escrowId, address to);
    event FeeUpdated(uint16 newFeeBps);

    constructor(address _feeRecipient) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ORACLE_ROLE, msg.sender);
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Create a new escrow
     * @param beneficiary Address that will receive funds on release
     * @param token Token contract address
     * @param tokenId Token ID (0 for ERC20)
     * @param amount Amount (for ERC20/1155)
     * @param assetType Type of asset (ERC20/721/1155)
     * @param deadline Unix timestamp deadline
     * @param termsHash Hash of off-chain terms
     * @return escrowId The created escrow ID
     */
    function createEscrow(
        address beneficiary,
        address token,
        uint256 tokenId,
        uint256 amount,
        AssetType assetType,
        uint64 deadline,
        bytes32 termsHash
    ) external nonReentrant returns (uint256 escrowId) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(token != address(0), "Invalid token");
        require(deadline > block.timestamp, "Invalid deadline");
        require(termsHash != bytes32(0), "Invalid terms hash");
        
        if (assetType == AssetType.ERC20) {
            require(amount > 0, "Invalid amount");
            require(tokenId == 0, "TokenId must be 0 for ERC20");
        } else if (assetType == AssetType.ERC721) {
            require(amount == 1, "Amount must be 1 for ERC721");
        } else {
            require(amount > 0, "Invalid amount");
        }

        escrowId = _escrowIdCounter.current();
        _escrowIdCounter.increment();

        _escrows[escrowId] = Escrow({
            payer: msg.sender,
            beneficiary: beneficiary,
            token: token,
            tokenId: tokenId,
            amount: amount,
            assetType: assetType,
            deadline: deadline,
            termsHash: termsHash,
            deposited: false,
            released: false,
            cancelled: false
        });

        emit EscrowCreated(
            escrowId,
            msg.sender,
            beneficiary,
            token,
            tokenId,
            amount,
            assetType,
            deadline,
            termsHash
        );
    }

    /**
     * @notice Deposit assets into escrow
     * @param escrowId The escrow to deposit into
     */
    function deposit(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = _escrows[escrowId];
        require(escrow.payer == msg.sender, "Not the payer");
        require(!escrow.deposited, "Already deposited");
        require(!escrow.cancelled, "Escrow cancelled");
        require(block.timestamp < escrow.deadline, "Deadline passed");

        escrow.deposited = true;

        if (escrow.assetType == AssetType.ERC20) {
            IERC20(escrow.token).transferFrom(
                msg.sender,
                address(this),
                escrow.amount
            );
        } else if (escrow.assetType == AssetType.ERC721) {
            IERC721(escrow.token).transferFrom(
                msg.sender,
                address(this),
                escrow.tokenId
            );
        } else {
            IERC1155(escrow.token).safeTransferFrom(
                msg.sender,
                address(this),
                escrow.tokenId,
                escrow.amount,
                ""
            );
        }

        emit Deposited(escrowId);
    }

    /**
     * @notice Release escrowed assets to beneficiary
     * @param escrowId The escrow to release
     */
    function release(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = _escrows[escrowId];
        require(escrow.deposited, "Not deposited");
        require(!escrow.released, "Already released");
        require(!escrow.cancelled, "Escrow cancelled");
        
        // Allow oracle, arbitrator, or beneficiary to release
        require(
            hasRole(ORACLE_ROLE, msg.sender) ||
            hasRole(ARBITRATOR_ROLE, msg.sender) ||
            msg.sender == escrow.beneficiary,
            "Not authorized"
        );

        escrow.released = true;

        uint256 amountAfterFee = escrow.amount;
        uint256 fee = 0;

        // Calculate and deduct fee for ERC20/1155
        if (escrow.assetType != AssetType.ERC721 && feeBps > 0) {
            fee = (escrow.amount * feeBps) / 10000;
            amountAfterFee = escrow.amount - fee;
        }

        // Transfer assets
        if (escrow.assetType == AssetType.ERC20) {
            if (fee > 0) {
                IERC20(escrow.token).transfer(feeRecipient, fee);
            }
            IERC20(escrow.token).transfer(escrow.beneficiary, amountAfterFee);
        } else if (escrow.assetType == AssetType.ERC721) {
            IERC721(escrow.token).transferFrom(
                address(this),
                escrow.beneficiary,
                escrow.tokenId
            );
        } else {
            if (fee > 0) {
                IERC1155(escrow.token).safeTransferFrom(
                    address(this),
                    feeRecipient,
                    escrow.tokenId,
                    fee,
                    ""
                );
            }
            IERC1155(escrow.token).safeTransferFrom(
                address(this),
                escrow.beneficiary,
                escrow.tokenId,
                amountAfterFee,
                ""
            );
        }

        emit Released(escrowId, escrow.beneficiary);
    }

    /**
     * @notice Cancel escrow and return assets to payer
     * @param escrowId The escrow to cancel
     */
    function cancel(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = _escrows[escrowId];
        require(!escrow.released, "Already released");
        require(!escrow.cancelled, "Already cancelled");
        
        // Allow cancellation by payer, oracle, or arbitrator
        require(
            msg.sender == escrow.payer ||
            hasRole(ORACLE_ROLE, msg.sender) ||
            hasRole(ARBITRATOR_ROLE, msg.sender),
            "Not authorized"
        );

        // If deposited, require deadline passed or arbitrator approval
        if (escrow.deposited) {
            require(
                block.timestamp >= escrow.deadline ||
                hasRole(ARBITRATOR_ROLE, msg.sender),
                "Cannot cancel before deadline"
            );
        }

        escrow.cancelled = true;

        // Return assets if deposited
        if (escrow.deposited) {
            if (escrow.assetType == AssetType.ERC20) {
                IERC20(escrow.token).transfer(escrow.payer, escrow.amount);
            } else if (escrow.assetType == AssetType.ERC721) {
                IERC721(escrow.token).transferFrom(
                    address(this),
                    escrow.payer,
                    escrow.tokenId
                );
            } else {
                IERC1155(escrow.token).safeTransferFrom(
                    address(this),
                    escrow.payer,
                    escrow.tokenId,
                    escrow.amount,
                    ""
                );
            }
        }

        emit Cancelled(escrowId, escrow.payer);
    }

    /**
     * @notice Get escrow details
     * @param escrowId The escrow ID
     * @return The escrow struct
     */
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return _escrows[escrowId];
    }

    /**
     * @notice Update fee (governance only)
     * @param _feeBps New fee in basis points
     */
    function setFee(uint16 _feeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feeBps <= 1000, "Fee too high"); // Max 10%
        feeBps = _feeBps;
        emit FeeUpdated(_feeBps);
    }

    /**
     * @notice Update fee recipient (governance only)
     * @param _feeRecipient New fee recipient
     */
    function setFeeRecipient(address _feeRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feeRecipient != address(0), "Invalid recipient");
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Required for ERC1155 transfers
     */
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    /**
     * @notice Required for ERC1155 batch transfers
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
