// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GIRMEnforcement
 * @notice GIRM (Generalized Invariant Recursive Mass-balance) enforcement for carbon credits
 * @dev Uses Poseidon hash for recursive digest and PLONK proof system
 */
contract GIRMEnforcement is AccessControl, ReentrancyGuard {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant CHALLENGER_ROLE = keccak256("CHALLENGER_ROLE");
    
    uint256 public constant CHALLENGE_WINDOW = 72 hours;
    uint256 public constant CHALLENGE_BOND = 1000 * 10**6; // 1000 USDC (6 decimals)
    
    IERC20 public immutable bondToken; // USDC for bonds
    
    struct GIRMProof {
        bytes32 wasteHash;      // Hash of waste input data
        uint256 srlTonnes;      // SRL tonnes converted
        bytes32 proofHash;      // PLONK proof hash
        uint256 timestamp;      // Submission timestamp
        address issuer;         // Credit issuer
        bool challenged;        // Has active challenge
        bool verified;          // Passed challenge window
    }
    
    struct Challenge {
        address challenger;      // Who challenged
        uint256 bondAmount;     // Bond posted
        bytes32 evidenceHash;   // Evidence IPFS hash
        uint256 timestamp;      // Challenge timestamp
        bool resolved;          // Challenge resolved
        bool successful;        // Challenge succeeded
    }
    
    // Mapping from proofId to GIRM proof
    mapping(bytes32 => GIRMProof) public proofs;
    
    // Mapping from proofId to challenges
    mapping(bytes32 => Challenge[]) public challenges;
    
    // Poseidon hash state for recursive digest
    mapping(bytes32 => bytes32) public poseidonState;
    
    // Events
    event ProofSubmitted(
        bytes32 indexed proofId,
        bytes32 indexed wasteHash,
        uint256 srlTonnes,
        address issuer
    );
    
    event ProofChallenged(
        bytes32 indexed proofId,
        address indexed challenger,
        bytes32 evidenceHash
    );
    
    event ChallengeResolved(
        bytes32 indexed proofId,
        uint256 challengeIndex,
        bool successful
    );
    
    event ProofVerified(bytes32 indexed proofId);
    
    constructor(address _bondToken) {
        bondToken = IERC20(_bondToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    /**
     * @notice Submit a GIRM proof for carbon credit issuance
     * @param wasteHash Hash of waste input data
     * @param srlTonnes Amount of SRL tonnes converted
     * @param plonkProof PLONK proof bytes
     * @return proofId Unique identifier for this proof
     */
    function submitProof(
        bytes32 wasteHash,
        uint256 srlTonnes,
        bytes calldata plonkProof
    ) external returns (bytes32 proofId) {
        require(srlTonnes > 0, "Invalid SRL amount");
        require(wasteHash != bytes32(0), "Invalid waste hash");
        
        // Generate proof ID
        proofId = keccak256(abi.encodePacked(
            wasteHash,
            srlTonnes,
            msg.sender,
            block.timestamp
        ));
        
        // Verify PLONK proof (simplified - would call verifier contract)
        bytes32 proofHash = keccak256(plonkProof);
        require(_verifyPLONKProof(plonkProof, wasteHash, srlTonnes), "Invalid PLONK proof");
        
        // Update Poseidon state (recursive digest)
        bytes32 currentState = poseidonState[msg.sender];
        bytes32 newState = _poseidonHash(currentState, wasteHash, srlTonnes);
        poseidonState[msg.sender] = newState;
        
        // Store proof
        proofs[proofId] = GIRMProof({
            wasteHash: wasteHash,
            srlTonnes: srlTonnes,
            proofHash: proofHash,
            timestamp: block.timestamp,
            issuer: msg.sender,
            challenged: false,
            verified: false
        });
        
        emit ProofSubmitted(proofId, wasteHash, srlTonnes, msg.sender);
        
        return proofId;
    }
    
    /**
     * @notice Challenge a GIRM proof
     * @param proofId Proof to challenge
     * @param evidenceHash IPFS hash of challenge evidence
     */
    function challengeProof(
        bytes32 proofId,
        bytes32 evidenceHash
    ) external nonReentrant {
        GIRMProof storage proof = proofs[proofId];
        require(proof.timestamp > 0, "Proof not found");
        require(!proof.verified, "Already verified");
        require(
            block.timestamp <= proof.timestamp + CHALLENGE_WINDOW,
            "Challenge window closed"
        );
        
        // Transfer bond
        require(
            bondToken.transferFrom(msg.sender, address(this), CHALLENGE_BOND),
            "Bond transfer failed"
        );
        
        // Create challenge
        challenges[proofId].push(Challenge({
            challenger: msg.sender,
            bondAmount: CHALLENGE_BOND,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            resolved: false,
            successful: false
        }));
        
        proof.challenged = true;
        
        emit ProofChallenged(proofId, msg.sender, evidenceHash);
    }
    
    /**
     * @notice Resolve a challenge
     * @param proofId Proof that was challenged
     * @param challengeIndex Index of the challenge
     * @param successful Whether challenge was successful
     */
    function resolveChallenge(
        bytes32 proofId,
        uint256 challengeIndex,
        bool successful
    ) external onlyRole(VERIFIER_ROLE) {
        GIRMProof storage proof = proofs[proofId];
        require(proof.challenged, "Not challenged");
        
        Challenge storage challenge = challenges[proofId][challengeIndex];
        require(!challenge.resolved, "Already resolved");
        
        challenge.resolved = true;
        challenge.successful = successful;
        
        if (successful) {
            // Challenge succeeded - return bond to challenger
            bondToken.transfer(challenge.challenger, challenge.bondAmount);
            
            // Mark proof as invalid
            delete proofs[proofId];
        } else {
            // Challenge failed - bond goes to issuer
            bondToken.transfer(proof.issuer, challenge.bondAmount);
            
            // Check if all challenges resolved
            bool allResolved = true;
            for (uint i = 0; i < challenges[proofId].length; i++) {
                if (!challenges[proofId][i].resolved) {
                    allResolved = false;
                    break;
                }
            }
            
            if (allResolved) {
                proof.challenged = false;
            }
        }
        
        emit ChallengeResolved(proofId, challengeIndex, successful);
    }
    
    /**
     * @notice Verify a proof after challenge window
     * @param proofId Proof to verify
     */
    function verifyProof(bytes32 proofId) external {
        GIRMProof storage proof = proofs[proofId];
        require(proof.timestamp > 0, "Proof not found");
        require(!proof.verified, "Already verified");
        require(!proof.challenged, "Has active challenges");
        require(
            block.timestamp > proof.timestamp + CHALLENGE_WINDOW,
            "Challenge window still open"
        );
        
        proof.verified = true;
        
        emit ProofVerified(proofId);
    }
    
    /**
     * @notice Check if a proof is valid for credit issuance
     * @param proofId Proof to check
     * @return valid Whether proof can be used
     */
    function isProofValid(bytes32 proofId) external view returns (bool valid) {
        GIRMProof storage proof = proofs[proofId];
        return proof.timestamp > 0 && proof.verified && !proof.challenged;
    }
    
    /**
     * @notice Get Poseidon state for an address
     * @param account Address to check
     * @return state Current Poseidon hash state
     */
    function getPoseidonState(address account) external view returns (bytes32 state) {
        return poseidonState[account];
    }
    
    // Internal functions
    
    function _verifyPLONKProof(
        bytes calldata proof,
        bytes32 wasteHash,
        uint256 srlTonnes
    ) internal pure returns (bool) {
        // Simplified - would call actual PLONK verifier
        // Check proof structure and basic validity
        return proof.length > 0 && wasteHash != bytes32(0) && srlTonnes > 0;
    }
    
    function _poseidonHash(
        bytes32 currentState,
        bytes32 wasteHash,
        uint256 srlTonnes
    ) internal pure returns (bytes32) {
        // Simplified Poseidon hash - would use actual Poseidon implementation
        return keccak256(abi.encodePacked(currentState, wasteHash, srlTonnes));
    }
}
