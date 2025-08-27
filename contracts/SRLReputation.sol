// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SRLReputation
 * @notice Soulbound tokens representing SRL contribution scores
 * @dev Non-transferable NFTs that track community contributions to SRL loops
 */
contract SRLReputation is ERC721, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    struct Contribution {
        uint256 srlTonsConverted;      // Total SRL tons converted by this address
        uint256 crlEventsReported;     // CRL events reported and verified
        uint256 nodesActivated;        // Community nodes brought online
        uint256 loopsClosed;           // Local loops closed
        uint256 lastUpdateBlock;       // Last update block number
        string nodeAffiliation;        // Primary node (e.g., "Brighton_Community_Compost")
    }
    
    // Mapping from token ID to contribution data
    mapping(uint256 => Contribution) public contributions;
    
    // Mapping from address to token ID (one token per address)
    mapping(address => uint256) public addressToTokenId;
    
    // Events
    event ReputationMinted(address indexed contributor, uint256 tokenId, string nodeAffiliation);
    event ContributionUpdated(
        uint256 indexed tokenId,
        uint256 srlTons,
        uint256 crlEvents,
        uint256 nodes,
        uint256 loops
    );
    event NodeAffiliationUpdated(uint256 indexed tokenId, string newNode);
    
    constructor() ERC721("SRL Reputation", "SRLREP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }
    
    /**
     * @notice Mint reputation token for a contributor
     * @param contributor Address to mint token for
     * @param nodeAffiliation Initial node affiliation
     */
    function mintReputation(
        address contributor,
        string memory nodeAffiliation
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(contributor != address(0), "Invalid address");
        require(addressToTokenId[contributor] == 0, "Already has reputation");
        require(bytes(nodeAffiliation).length > 0, "Invalid node");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(contributor, tokenId);
        
        contributions[tokenId] = Contribution({
            srlTonsConverted: 0,
            crlEventsReported: 0,
            nodesActivated: 0,
            loopsClosed: 0,
            lastUpdateBlock: block.number,
            nodeAffiliation: nodeAffiliation
        });
        
        addressToTokenId[contributor] = tokenId;
        
        emit ReputationMinted(contributor, tokenId, nodeAffiliation);
        
        return tokenId;
    }
    
    /**
     * @notice Update contribution metrics for a token holder
     * @param contributor Address of contributor
     * @param srlTonsToAdd SRL tons to add
     * @param crlEventsToAdd CRL events to add
     * @param nodesToAdd Nodes activated to add
     * @param loopsToAdd Loops closed to add
     */
    function updateContribution(
        address contributor,
        uint256 srlTonsToAdd,
        uint256 crlEventsToAdd,
        uint256 nodesToAdd,
        uint256 loopsToAdd
    ) external onlyRole(UPDATER_ROLE) {
        uint256 tokenId = addressToTokenId[contributor];
        require(tokenId > 0, "No reputation token");
        
        Contribution storage contrib = contributions[tokenId];
        
        contrib.srlTonsConverted += srlTonsToAdd;
        contrib.crlEventsReported += crlEventsToAdd;
        contrib.nodesActivated += nodesToAdd;
        contrib.loopsClosed += loopsToAdd;
        contrib.lastUpdateBlock = block.number;
        
        emit ContributionUpdated(
            tokenId,
            contrib.srlTonsConverted,
            contrib.crlEventsReported,
            contrib.nodesActivated,
            contrib.loopsClosed
        );
    }
    
    /**
     * @notice Update node affiliation
     * @param contributor Address of contributor
     * @param newNode New node affiliation
     */
    function updateNodeAffiliation(
        address contributor,
        string memory newNode
    ) external onlyRole(UPDATER_ROLE) {
        uint256 tokenId = addressToTokenId[contributor];
        require(tokenId > 0, "No reputation token");
        require(bytes(newNode).length > 0, "Invalid node");
        
        contributions[tokenId].nodeAffiliation = newNode;
        
        emit NodeAffiliationUpdated(tokenId, newNode);
    }
    
    /**
     * @notice Get SRL/CRL score for an address
     * @param contributor Address to check
     * @return srlScore Positive SRL contributions
     * @return crlScore Negative CRL impact
     * @return netScore Net reputation score
     */
    function getScore(address contributor) external view returns (
        uint256 srlScore,
        uint256 crlScore,
        int256 netScore
    ) {
        uint256 tokenId = addressToTokenId[contributor];
        if (tokenId == 0) {
            return (0, 0, 0);
        }
        
        Contribution memory contrib = contributions[tokenId];
        
        // SRL score formula: tons + (nodes * 10) + (loops * 20)
        srlScore = contrib.srlTonsConverted + 
                   (contrib.nodesActivated * 10) + 
                   (contrib.loopsClosed * 20);
        
        // CRL score: events * 5
        crlScore = contrib.crlEventsReported * 5;
        
        // Net score (can be negative if too many CRL events)
        netScore = int256(srlScore) - int256(crlScore);
    }
    
    /**
     * @notice Get full contribution data
     * @param contributor Address to check
     */
    function getContribution(address contributor) external view returns (Contribution memory) {
        uint256 tokenId = addressToTokenId[contributor];
        require(tokenId > 0, "No reputation token");
        return contributions[tokenId];
    }
    
    /**
     * @notice Check if address has reputation token
     * @param contributor Address to check
     */
    function hasReputation(address contributor) external view returns (bool) {
        return addressToTokenId[contributor] > 0;
    }
    
    /**
     * @notice Override transfer functions to make tokens soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(
            from == address(0) || to == address(0),
            "SRLReputation: tokens are soulbound"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @notice Burn reputation token (only by token owner)
     * @param tokenId Token to burn
     */
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        address owner = ownerOf(tokenId);
        delete addressToTokenId[owner];
        delete contributions[tokenId];
        
        _burn(tokenId);
    }
    
    /**
     * @notice Required override for ERC721
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
