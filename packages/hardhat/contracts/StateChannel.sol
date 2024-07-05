// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MockServiceProvider.sol";

contract SimpleStateChannel {
    MockServiceProvider public serviceProvider;
    mapping(address => uint256) public balances;

    event ChannelOpened(address indexed user, uint256 amount);
    event ChannelClosed(address indexed user, uint256 amount);
    event SubscriptionPurchased(address indexed user, uint256 indexed subscriptionId);

    constructor(address _serviceProviderAddress) {
        serviceProvider = MockServiceProvider(_serviceProviderAddress);
    }

    function openChannel() external payable {
        require(msg.value > 0, "Must deposit some ETH");
        balances[msg.sender] += msg.value;
        emit ChannelOpened(msg.sender, msg.value);
    }

    function subscribe(uint256 subscriptionId, bytes memory signature) external {
        bytes32 message = keccak256(abi.encodePacked(msg.sender, subscriptionId, "subscribe"));
        require(verifySignature(message, signature), "Invalid signature");

        uint256 fee = serviceProvider.getSubscriptionFee(subscriptionId);
        require(balances[msg.sender] >= fee, "Insufficient balance");

        balances[msg.sender] -= fee;
        serviceProvider.subscribe(msg.sender, subscriptionId);

        emit SubscriptionPurchased(msg.sender, subscriptionId);
    }

    function unsubscribe(uint256 subscriptionId) external {
        serviceProvider.unsubscribe(msg.sender, subscriptionId);
    }

    function closeChannel() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

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
