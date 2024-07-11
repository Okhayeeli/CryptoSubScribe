// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SubscriptionManager
 * @dev Manages subscriptions using state channels for efficient off-chain transactions
 */
contract SubscriptionManager is Ownable {
    using ECDSA for bytes32;

    // Struct to represent a subscription
    struct Subscription {
        uint256 id;
        string name;
        uint256 price;
        uint256 duration;
    }

    // Struct to represent a user's channel
    struct Channel {
        address user;
        uint256 balance;
        uint256 lastSettled;
        mapping(uint256 => bool) activeSubscriptions;
    }

    // Mapping of subscription IDs to Subscription structs
    mapping(uint256 => Subscription) public subscriptions;
    // Mapping of user addresses to their Channel
    mapping(address => Channel) public channels;
    uint256 public subscriptionCount;

    // Events for logging important actions
    event SubscriptionAdded(uint256 id, string name, uint256 price, uint256 duration);
    event ChannelOpened(address indexed user, uint256 balance);
    event ChannelClosed(address indexed user, uint256 finalBalance);
    event SubscriptionActivated(address indexed user, uint256 indexed subscriptionId);
    event SubscriptionDeactivated(address indexed user, uint256 indexed subscriptionId);
    event Withdraw(address indexed owner, uint256 amount);
    event SubscriptionPurchased(address indexed user, uint256 indexed subscriptionId, uint256 price);

    /**
     * @dev Constructor to initialize the contract with default subscriptions
     */
    constructor() {
       
   }

    /**
     * @dev Opens a new channel for the user
     */
    function openChannel() external payable {
        require(channels[msg.sender].user == address(0), "Channel already exists");
        Channel storage channel = channels[msg.sender];
        channel.user = msg.sender;
        channel.balance = msg.value;
        channel.lastSettled = block.timestamp;
        emit ChannelOpened(msg.sender, msg.value);
    }

    /**
     * @dev Closes the channel and settles the final balance
     */
    function closeChannel() external {
        Channel storage channel = channels[msg.sender];
        require(channel.user != address(0), "Channel does not exist");

        uint256 toTransfer = channel.balance;
        require(address(this).balance >= toTransfer, "Insufficient contract balance");

        payable(msg.sender).transfer(toTransfer);
        emit ChannelClosed(msg.sender, toTransfer);
        delete channels[msg.sender];
    }

    /**
     * @dev Adds a new subscription to the contract
     * @param name The name of the subscription
     * @param price The price of the subscription
     * @param duration The duration of the subscription
     */
    function addSubscription(string memory name, uint256 price, uint256 duration) external onlyOwner {
        uint256 newId = subscriptionCount;
        subscriptions[newId] = Subscription(newId, name, price, duration);
        subscriptionCount++;
        emit SubscriptionAdded(newId, name, price, duration);
    }

    /**
     * @dev Buys a subscription for the user
     * @param subscriptionId The ID of the subscription to activate
     */
    function buySubscription(uint256 subscriptionId) external {
    require(subscriptionId < subscriptionCount, "Invalid subscription ID");
    
    Subscription storage subscription = subscriptions[subscriptionId];
    Channel storage channel = channels[msg.sender];
    
    require(channel.user != address(0), "Channel does not exist. Please open a channel first.");
    require(channel.balance >= subscription.price, "Insufficient channel balance");

    // Check if the subscription is already active
    if (!channel.activeSubscriptions[subscriptionId]) {
        // Deduct the subscription price from the channel balance
        channel.balance -= subscription.price;
        
        // Activate the subscription
        channel.activeSubscriptions[subscriptionId] = true;

        emit SubscriptionPurchased(msg.sender, subscriptionId, subscription.price);
        emit SubscriptionActivated(msg.sender, subscriptionId);
    } else {
        revert("Subscription already active");
    }
}
    /**
     * @dev Gets all subscriptions stored in the contract
     * @return allSubscriptions An array of all Subscription structs
     */
    function getAllSubscriptions() external view returns (Subscription[] memory) {
        Subscription[] memory allSubscriptions = new Subscription[](subscriptionCount);
        
        for (uint256 i = 0; i < subscriptionCount; i++) {
            allSubscriptions[i] = subscriptions[i];
        }
        
        return allSubscriptions;
    }

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
    /**
     * @dev Gets the details of a specific subscription
     * @param id The ID of the subscription
     * @return The name, price, and duration of the subscription
     */
    function getSubscriptionDetails(uint256 id) external view returns (string memory, uint256, uint256) {
        require(id < subscriptionCount, "Invalid subscription ID");
        Subscription memory sub = subscriptions[id];
        return (sub.name, sub.price, sub.duration);
    }

    /**
     * @dev Gets the channel balance for a user
     * @param user The address of the user
     * @return The current balance in the user's channel
     */
    function getChannelBalance(address user) external view returns (uint256) {
        require(channels[user].user != address(0), "Channel does not exist");
        return channels[user].balance;
    }

    /**
     * @dev Withdraws funds from the contract to the owner
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(owner()).transfer(amount);
        emit Withdraw(owner(), amount);
    }
}
