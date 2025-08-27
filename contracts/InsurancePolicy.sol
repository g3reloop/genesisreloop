// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title InsurancePolicy
 * @notice Parametric micro-insurance for batch deliveries
 * @dev Automated claims processing based on pre-defined triggers
 */
contract InsurancePolicy is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant UNDERWRITER_ROLE = keccak256("UNDERWRITER_ROLE");
    bytes32 public constant CLAIMS_PROCESSOR_ROLE = keccak256("CLAIMS_PROCESSOR_ROLE");

    enum PolicyState { 
        Quoted,    // Quote generated
        Active,    // Premium paid, coverage active
        Expired,   // Past expiry date
        Claimed,   // Claim submitted
        Paid,      // Claim paid out
        Rejected   // Claim rejected
    }

    struct Quote {
        bytes32 batchId;       // off-chain batch key
        uint256 premium;       // wei or token wei
        uint256 coverage;      // max payout
        uint64  expiry;        // policy end ts
        bytes32 riskHash;      // compact risk vector hash
    }

    struct Policy {
        uint256 policyId;
        address holder;
        bytes32 batchId;
        uint256 premium;
        uint256 coverage;
        uint64  expiry;
        PolicyState state;
        uint256 claimAmount;   // Amount claimed
        bytes32 claimReason;   // Reason for claim
    }

    struct RiskParameters {
        uint16 baseRateBps;           // Base rate in basis points
        uint16 srlDiscountBps;        // Discount for SRL compliance
        uint16 trustScoreMultiplier;  // Multiplier based on trust score
        uint16 maxCoverageRatio;      // Max coverage as % of value
    }

    Counters.Counter private _policyIdCounter;
    mapping(uint256 => Policy) private _policies;
    mapping(bytes32 => Quote) private _quotes;
    mapping(bytes32 => bool) private _usedQuotes;
    
    RiskParameters public riskParams;
    uint256 public totalPremiumsCollected;
    uint256 public totalClaimsPaid;
    uint256 public reserveBalance;
    
    // Events
    event QuoteCreated(bytes32 indexed batchId, uint256 premium, uint256 coverage, uint64 expiry);
    event PolicyBound(uint256 indexed policyId, address indexed holder, bytes32 indexed batchId);
    event ClaimSubmitted(uint256 indexed policyId, bytes32 reasonHash);
    event ClaimPaid(uint256 indexed policyId, uint256 payout, address to);
    event ClaimRejected(uint256 indexed policyId, bytes32 reasonHash);
    event RiskParametersUpdated(RiskParameters params);
    event ReserveDeposited(uint256 amount);
    event ReserveWithdrawn(uint256 amount);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ORACLE_ROLE, msg.sender);
        _setupRole(UNDERWRITER_ROLE, msg.sender);
        
        // Initialize default risk parameters
        riskParams = RiskParameters({
            baseRateBps: 200,          // 2% base rate
            srlDiscountBps: 50,        // 0.5% discount for SRL
            trustScoreMultiplier: 100, // 1x multiplier (100/100)
            maxCoverageRatio: 9000     // 90% max coverage
        });
    }

    /**
     * @notice Generate insurance quote for a batch
     * @param batchId Unique batch identifier
     * @param riskHash Hash of risk parameters (quality, route, history)
     * @return quote The generated quote
     */
    function quote(
        bytes32 batchId,
        bytes32 riskHash
    ) external view returns (Quote memory) {
        // In production, decode riskHash to extract:
        // - Batch value
        // - SRL/CRL status
        // - Historical performance
        // - Route risk factors
        
        // Simplified quote calculation
        uint256 batchValue = 10000 * 1e18; // Mock: 10k value
        uint256 basePremium = (batchValue * riskParams.baseRateBps) / 10000;
        uint256 maxCoverage = (batchValue * riskParams.maxCoverageRatio) / 10000;
        
        // Apply SRL discount if applicable
        bool isSRL = uint256(riskHash) % 2 == 0; // Mock SRL check
        if (isSRL) {
            basePremium = (basePremium * (10000 - riskParams.srlDiscountBps)) / 10000;
        }
        
        return Quote({
            batchId: batchId,
            premium: basePremium,
            coverage: maxCoverage,
            expiry: uint64(block.timestamp + 30 days),
            riskHash: riskHash
        });
    }

    /**
     * @notice Bind policy by paying premium
     * @param batchId Batch to insure
     * @param premiumMax Maximum premium willing to pay
     * @param holder Policy holder address
     * @return policyId The created policy ID
     */
    function bindPolicy(
        bytes32 batchId,
        uint256 premiumMax,
        address holder
    ) external payable nonReentrant returns (uint256 policyId) {
        require(holder != address(0), "Invalid holder");
        require(!_usedQuotes[batchId], "Quote already used");
        
        // Generate quote on-chain
        Quote memory q = this.quote(batchId, keccak256(abi.encode(batchId, holder)));
        
        require(q.premium <= premiumMax, "Premium exceeds max");
        require(msg.value >= q.premium, "Insufficient premium");
        require(block.timestamp < q.expiry - 24 hours, "Quote expired");
        
        policyId = _policyIdCounter.current();
        _policyIdCounter.increment();
        
        _policies[policyId] = Policy({
            policyId: policyId,
            holder: holder,
            batchId: batchId,
            premium: q.premium,
            coverage: q.coverage,
            expiry: q.expiry,
            state: PolicyState.Active,
            claimAmount: 0,
            claimReason: bytes32(0)
        });
        
        _usedQuotes[batchId] = true;
        totalPremiumsCollected += q.premium;
        reserveBalance += q.premium;
        
        // Refund excess
        if (msg.value > q.premium) {
            payable(msg.sender).transfer(msg.value - q.premium);
        }
        
        emit PolicyBound(policyId, holder, batchId);
    }

    /**
     * @notice Submit insurance claim
     * @param policyId Policy to claim against
     * @param reasonHash Hash of claim reason and evidence
     */
    function submitClaim(
        uint256 policyId,
        bytes32 reasonHash
    ) external nonReentrant {
        Policy storage policy = _policies[policyId];
        require(policy.holder == msg.sender, "Not policy holder");
        require(policy.state == PolicyState.Active, "Policy not active");
        require(block.timestamp <= policy.expiry, "Policy expired");
        require(reasonHash != bytes32(0), "Invalid reason");
        
        policy.state = PolicyState.Claimed;
        policy.claimReason = reasonHash;
        
        emit ClaimSubmitted(policyId, reasonHash);
    }

    /**
     * @notice Resolve claim (oracle/processor only)
     * @param policyId Policy ID
     * @param approved Whether claim is approved
     * @param payout Amount to pay (if approved)
     * @param to Payout recipient
     */
    function resolveClaim(
        uint256 policyId,
        bool approved,
        uint256 payout,
        address to
    ) external nonReentrant onlyRole(CLAIMS_PROCESSOR_ROLE) {
        Policy storage policy = _policies[policyId];
        require(policy.state == PolicyState.Claimed, "No claim pending");
        require(to != address(0), "Invalid recipient");
        
        if (approved) {
            require(payout > 0 && payout <= policy.coverage, "Invalid payout");
            require(payout <= reserveBalance, "Insufficient reserves");
            
            policy.state = PolicyState.Paid;
            policy.claimAmount = payout;
            
            totalClaimsPaid += payout;
            reserveBalance -= payout;
            
            payable(to).transfer(payout);
            
            emit ClaimPaid(policyId, payout, to);
        } else {
            policy.state = PolicyState.Rejected;
            emit ClaimRejected(policyId, policy.claimReason);
        }
    }

    /**
     * @notice Get policy details
     * @param policyId Policy ID
     * @return Policy struct
     */
    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return _policies[policyId];
    }

    /**
     * @notice Update risk parameters (governance only)
     * @param params New risk parameters
     */
    function updateRiskParameters(
        RiskParameters calldata params
    ) external onlyRole(UNDERWRITER_ROLE) {
        require(params.baseRateBps <= 10000, "Invalid base rate");
        require(params.maxCoverageRatio <= 10000, "Invalid coverage ratio");
        
        riskParams = params;
        emit RiskParametersUpdated(params);
    }

    /**
     * @notice Deposit funds to insurance reserve
     */
    function depositReserve() external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        require(msg.value > 0, "No value sent");
        reserveBalance += msg.value;
        emit ReserveDeposited(msg.value);
    }

    /**
     * @notice Withdraw excess reserves (governance only)
     * @param amount Amount to withdraw
     * @param to Recipient address
     */
    function withdrawReserve(
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        // Maintain minimum reserve ratio
        uint256 minReserve = (totalPremiumsCollected * 5000) / 10000; // 50% min
        require(reserveBalance - amount >= minReserve, "Below minimum reserve");
        
        reserveBalance -= amount;
        payable(to).transfer(amount);
        
        emit ReserveWithdrawn(amount);
    }

    /**
     * @notice Check if policy can be expired
     * @param policyId Policy to check
     */
    function checkAndExpirePolicy(uint256 policyId) external {
        Policy storage policy = _policies[policyId];
        if (policy.state == PolicyState.Active && block.timestamp > policy.expiry) {
            policy.state = PolicyState.Expired;
        }
    }

    /**
     * @notice Get insurance pool statistics
     */
    function getPoolStats() external view returns (
        uint256 premiums,
        uint256 claims,
        uint256 reserves,
        uint256 lossRatio
    ) {
        premiums = totalPremiumsCollected;
        claims = totalClaimsPaid;
        reserves = reserveBalance;
        lossRatio = premiums > 0 ? (claims * 10000) / premiums : 0;
    }

    /**
     * @notice Emergency pause (circuit breaker)
     */
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(msg.sender).transfer(balance);
    }

    receive() external payable {
        // Accept direct deposits to reserve
        reserveBalance += msg.value;
    }
}
