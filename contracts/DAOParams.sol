// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DAOParams
 * @notice Governance-controlled parameter registry
 * @dev Stores protocol parameters with access control and history tracking
 */
contract DAOParams is AccessControl, Pausable {
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Parameter types
    mapping(bytes32 => uint256) private _uintParams;
    mapping(bytes32 => address) private _addressParams;
    mapping(bytes32 => bytes) private _bytesParams;
    
    // Parameter history for audit trail
    struct ParamChange {
        uint256 timestamp;
        address changedBy;
        bytes oldValue;
        bytes newValue;
    }
    
    mapping(bytes32 => ParamChange[]) private _paramHistory;
    
    // Common parameter keys
    bytes32 public constant MAX_ESCROW_FEE = keccak256("MAX_ESCROW_FEE");
    bytes32 public constant MIN_LIQUIDITY_THRESHOLD = keccak256("MIN_LIQUIDITY_THRESHOLD");
    bytes32 public constant ORACLE_UPDATE_FREQUENCY = keccak256("ORACLE_UPDATE_FREQUENCY");
    bytes32 public constant INSURANCE_MIN_RESERVE_RATIO = keccak256("INSURANCE_MIN_RESERVE_RATIO");
    bytes32 public constant AMM_DEFAULT_FEE = keccak256("AMM_DEFAULT_FEE");
    bytes32 public constant AMM_MAX_FEE = keccak256("AMM_MAX_FEE");
    bytes32 public constant ESCROW_CONTRACT = keccak256("ESCROW_CONTRACT");
    bytes32 public constant AMM_FACTORY = keccak256("AMM_FACTORY");
    bytes32 public constant INSURANCE_POOL = keccak256("INSURANCE_POOL");
    bytes32 public constant TREASURY = keccak256("TREASURY");
    bytes32 public constant PRICE_ORACLE = keccak256("PRICE_ORACLE");
    bytes32 public constant AUDIT_ORACLE = keccak256("AUDIT_ORACLE");
    
    // Events
    event ParamUpdated(bytes32 indexed key, uint256 value);
    event AddressUpdated(bytes32 indexed key, address value);
    event BytesUpdated(bytes32 indexed key, bytes value);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GOVERNANCE_ROLE, msg.sender);
        _setupRole(OPERATOR_ROLE, msg.sender);
        
        // Initialize default parameters
        _initializeDefaults();
    }
    
    /**
     * @notice Initialize default parameter values
     */
    function _initializeDefaults() private {
        _uintParams[MAX_ESCROW_FEE] = 1000; // 10%
        _uintParams[MIN_LIQUIDITY_THRESHOLD] = 1000 * 1e18; // 1000 tokens
        _uintParams[ORACLE_UPDATE_FREQUENCY] = 3600; // 1 hour
        _uintParams[INSURANCE_MIN_RESERVE_RATIO] = 5000; // 50%
        _uintParams[AMM_DEFAULT_FEE] = 30; // 0.3%
        _uintParams[AMM_MAX_FEE] = 1000; // 10%
    }
    
    /**
     * @notice Set uint256 parameter
     * @param key Parameter key
     * @param value Parameter value
     */
    function setParam(bytes32 key, uint256 value) 
        external 
        onlyRole(GOVERNANCE_ROLE) 
        whenNotPaused 
    {
        require(key != bytes32(0), "Invalid key");
        
        // Validate specific parameters
        if (key == MAX_ESCROW_FEE || key == AMM_MAX_FEE) {
            require(value <= 10000, "Fee too high"); // Max 100%
        }
        
        if (key == INSURANCE_MIN_RESERVE_RATIO) {
            require(value >= 2000 && value <= 8000, "Invalid reserve ratio"); // 20-80%
        }
        
        // Record history
        _recordHistory(key, abi.encode(_uintParams[key]), abi.encode(value));
        
        _uintParams[key] = value;
        emit ParamUpdated(key, value);
    }
    
    /**
     * @notice Set address parameter
     * @param key Parameter key
     * @param value Parameter value
     */
    function setAddress(bytes32 key, address value) 
        external 
        onlyRole(GOVERNANCE_ROLE) 
        whenNotPaused 
    {
        require(key != bytes32(0), "Invalid key");
        require(value != address(0), "Invalid address");
        
        // Record history
        _recordHistory(key, abi.encode(_addressParams[key]), abi.encode(value));
        
        _addressParams[key] = value;
        emit AddressUpdated(key, value);
    }
    
    /**
     * @notice Set bytes parameter
     * @param key Parameter key
     * @param value Parameter value
     */
    function setBytes(bytes32 key, bytes calldata value) 
        external 
        onlyRole(GOVERNANCE_ROLE) 
        whenNotPaused 
    {
        require(key != bytes32(0), "Invalid key");
        require(value.length > 0, "Empty value");
        require(value.length <= 1024, "Value too large"); // Max 1KB
        
        // Record history
        _recordHistory(key, _bytesParams[key], value);
        
        _bytesParams[key] = value;
        emit BytesUpdated(key, value);
    }
    
    /**
     * @notice Get uint256 parameter
     * @param key Parameter key
     * @return Parameter value
     */
    function getParam(bytes32 key) external view returns (uint256) {
        return _uintParams[key];
    }
    
    /**
     * @notice Get address parameter
     * @param key Parameter key
     * @return Parameter value
     */
    function getAddress(bytes32 key) external view returns (address) {
        return _addressParams[key];
    }
    
    /**
     * @notice Get bytes parameter
     * @param key Parameter key
     * @return Parameter value
     */
    function getBytes(bytes32 key) external view returns (bytes memory) {
        return _bytesParams[key];
    }
    
    /**
     * @notice Batch update multiple uint parameters
     * @param keys Array of parameter keys
     * @param values Array of parameter values
     */
    function batchSetParams(bytes32[] calldata keys, uint256[] calldata values) 
        external 
        onlyRole(GOVERNANCE_ROLE) 
        whenNotPaused 
    {
        require(keys.length == values.length, "Length mismatch");
        require(keys.length <= 20, "Too many updates");
        
        for (uint256 i = 0; i < keys.length; i++) {
            this.setParam(keys[i], values[i]);
        }
    }
    
    /**
     * @notice Get parameter change history
     * @param key Parameter key
     * @return Array of parameter changes
     */
    function getParamHistory(bytes32 key) 
        external 
        view 
        returns (ParamChange[] memory) 
    {
        return _paramHistory[key];
    }
    
    /**
     * @notice Get latest parameter change
     * @param key Parameter key
     * @return Latest parameter change
     */
    function getLatestChange(bytes32 key) 
        external 
        view 
        returns (ParamChange memory) 
    {
        ParamChange[] memory history = _paramHistory[key];
        require(history.length > 0, "No history");
        return history[history.length - 1];
    }
    
    /**
     * @notice Record parameter change history
     * @param key Parameter key
     * @param oldValue Old value encoded as bytes
     * @param newValue New value encoded as bytes
     */
    function _recordHistory(
        bytes32 key, 
        bytes memory oldValue, 
        bytes memory newValue
    ) private {
        _paramHistory[key].push(ParamChange({
            timestamp: block.timestamp,
            changedBy: msg.sender,
            oldValue: oldValue,
            newValue: newValue
        }));
        
        // Limit history size to prevent unbounded growth
        if (_paramHistory[key].length > 100) {
            // Remove oldest entry
            for (uint i = 0; i < _paramHistory[key].length - 1; i++) {
                _paramHistory[key][i] = _paramHistory[key][i + 1];
            }
            _paramHistory[key].pop();
        }
    }
    
    /**
     * @notice Emergency pause
     */
    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause
     */
    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Check if a parameter exists (has non-zero value)
     * @param key Parameter key
     * @return exists Whether the parameter exists
     */
    function paramExists(bytes32 key) external view returns (bool exists) {
        return _uintParams[key] != 0 || 
               _addressParams[key] != address(0) || 
               _bytesParams[key].length != 0;
    }
    
    /**
     * @notice Get all parameter types for a key
     * @param key Parameter key
     * @return uintValue The uint256 value
     * @return addressValue The address value
     * @return bytesValue The bytes value
     */
    function getAllParamTypes(bytes32 key) 
        external 
        view 
        returns (
            uint256 uintValue,
            address addressValue,
            bytes memory bytesValue
        ) 
    {
        uintValue = _uintParams[key];
        addressValue = _addressParams[key];
        bytesValue = _bytesParams[key];
    }
}
