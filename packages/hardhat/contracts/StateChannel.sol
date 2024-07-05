// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MockServiceProvider.sol";

contract SimpleStateChannel {
    MockServiceProvider public serviceProvider;
    mapping(address => uint256) public balances;

    // Events to log actions
    event ChannelOpened(address indexed user, uint256 amount);
    event ChannelClosed(address indexed user, uint256 amount);
    event SubscriptionPurchased(address indexed user, bytes32 indexed subscriptionId);
    event SubscriptionCancelled(address indexed user, bytes32 indexed subscriptionId);

    // Custom errors
    error InvalidAmount();
    error InsufficientBalance();
    error InvalidSignature();

    // Constructor to set the service provider address
    constructor(address _serviceProviderAddress) {
        serviceProvider = MockServiceProvider(_serviceProviderAddress);
    }

    // Function to open a channel and deposit ETH
    function openChannel() external payable {
        if (msg.value <= 0) {
            revert InvalidAmount();
        }
        balances[msg.sender] += msg.value;
        emit ChannelOpened(msg.sender, msg.value);
    }

    // Function to subscribe to a service
    function subscribe(bytes32 subscriptionId, bytes memory signature) external {
        bytes32 message = keccak256(abi.encodePacked(msg.sender, subscriptionId, "subscribe"));
        if (!verifySignature(message, signature)) {
            revert InvalidSignature();
        }

        uint256 fee = serviceProvider.getSubscriptionFee(subscriptionId);
        if (balances[msg.sender] < fee) {
            revert InsufficientBalance();
        }

        balances[msg.sender] -= fee;
        serviceProvider.subscribe(msg.sender, subscriptionId);

        emit SubscriptionPurchased(msg.sender, subscriptionId);
    }

    // Function to unsubscribe from a service
    function unsubscribe(bytes32 subscriptionId) external {
        serviceProvider.unsubscribe(msg.sender, subscriptionId);
        emit SubscriptionCancelled(msg.sender, subscriptionId);
    }

    // Function to close the channel and withdraw balance
    function closeChannel() external {
        uint256 amount = balances[msg.sender];
        if (amount <= 0) {
            revert InvalidAmount();
        }

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit ChannelClosed(msg.sender, amount);
    }

    // Internal function to verify the signature
    function verifySignature(bytes32 message, bytes memory signature) internal view returns (bool) {
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        address recoveredSigner = ecrecover(prefixedHash, v, r, s);
        return recoveredSigner == msg.sender;
    }
}
