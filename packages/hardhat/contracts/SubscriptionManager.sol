// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SubscriptionManager is Ownable {
    using ECDSA for bytes32;

    struct Subscription {
        uint256 id;
        string name;
        uint256 price;
        uint256 duration;
    }

    struct Channel {
        address user;
        uint256 balance;
        uint256 lastSettled;
        mapping(uint256 => bool) activeSubscriptions;
    }

    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => Channel) public channels;
    mapping(address => uint256[]) public activeSubscriptions;
    uint256 public subscriptionCount;

    event SubscriptionAdded(uint256 id, string name, uint256 price, uint256 duration);
    event ChannelOpened(address indexed user, uint256 balance);
    event ChannelClosed(address indexed user, uint256 finalBalance);
    event Withdraw(address indexed owner, uint256 amount);

    constructor() {
        // Constructor logic (if any)
    }

    function openChannel() external payable {
        require(channels[msg.sender].user == address(0), "Channel already exists");
        Channel storage channel = channels[msg.sender];
        channel.user = msg.sender;
        channel.balance = msg.value;
        channel.lastSettled = block.timestamp;
        emit ChannelOpened(msg.sender, msg.value);
    }

    function closeChannel() external {
        Channel storage channel = channels[msg.sender];
        require(channel.user != address(0), "Channel does not exist");

        uint256 toTransfer = channel.balance;
        require(address(this).balance >= toTransfer, "Insufficient contract balance");

        payable(msg.sender).transfer(toTransfer);
        emit ChannelClosed(msg.sender, toTransfer);
        delete channels[msg.sender];
    }

    function addSubscription(string memory name, uint256 price, uint256 duration) external onlyOwner {
        uint256 newId = subscriptionCount;
        subscriptions[newId] = Subscription(newId, name, price, duration);
        subscriptionCount++;
        emit SubscriptionAdded(newId, name, price, duration);
    }

    function verifySubscription(address user, uint256 subscriptionId, uint256 timestamp, bytes memory signature) public pure returns (bool) {
        bytes32 message = keccak256(abi.encodePacked(user, subscriptionId, timestamp));
        bytes32 ethSignedMessageHash = message.toEthSignedMessageHash();
        return ethSignedMessageHash.recover(signature) == user;
    }

    function getAllSubscriptions() external view returns (Subscription[] memory) {
        Subscription[] memory allSubscriptions = new Subscription[](subscriptionCount);
        
        for (uint256 i = 0; i < subscriptionCount; i++) {
            allSubscriptions[i] = subscriptions[i];
        }
        
        return allSubscriptions;
    }
    function activateSubscription(uint256 subscriptionId) external {
    require(channels[msg.sender].user != address(0), "Channel does not exist");
    require(subscriptionId < subscriptionCount, "Invalid subscription ID");
    require(channels[msg.sender].balance >= subscriptions[subscriptionId].price, "Insufficient balance");
    
    channels[msg.sender].balance -= subscriptions[subscriptionId].price;
    channels[msg.sender].activeSubscriptions[subscriptionId] = true;
    activeSubscriptions[msg.sender].push(subscriptionId);}

    /**
     * @dev Gets the active subscriptions for a user
     * @param user The address of the user
     * @return An array of booleans representing active subscriptions
     */
    function getActiveSubscriptions(address user) external view returns (bool[] memory) {
    require(channels[user].user != address(0), "Channel does not exist");

    bool[] memory activeSubs = new bool[](subscriptionCount);
    for (uint256 i = 0; i < subscriptionCount; i++) {
        activeSubs[i] = channels[user].activeSubscriptions[i];
    }

    return activeSubs;
}

    function getSubscriptionDetails(uint256 id) external view returns (string memory, uint256, uint256) {
        require(id < subscriptionCount, "Invalid subscription ID");
        Subscription memory sub = subscriptions[id];
        return (sub.name, sub.price, sub.duration);
    }

    function getChannelBalance(address user) external view returns (uint256) {
        require(channels[user].user != address(0), "Channel does not exist");
        return channels[user].balance;
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(owner()).transfer(amount);
        emit Withdraw(owner(), amount);
    }
}