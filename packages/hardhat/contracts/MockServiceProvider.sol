// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockServiceProvider {
    struct Subscription {
        uint256 id;
        string name;
        uint256 fee;
        bool isActive;
    }

    struct UserSubscription {
        bool isActive;
        uint256 expirationTime;
    }

    // Mappings to store subscription types and user subscriptions
    mapping(uint256 => Subscription) public subscriptionTypes;
    mapping(address => mapping(uint256 => UserSubscription)) public userSubscriptions;

    // Array and counter for subscription types
    Subscription[] public subscriptionTypesArray;
    uint256 public numberOfSubscriptionTypes;

    // Owner and state channel address
    address public owner;
    address public stateChannelAddress;

    // Events to log actions
    event SubscriptionTypeAdded(address indexed adder, Subscription subscription);
    event UserSubscribed(address indexed user, uint256 indexed subscriptionId);
    event UserUnsubscribed(address indexed user, uint256 indexed subscriptionId);

    // Custom errors
    error Unauthorized();
    error SubscriptionTypeExists();
    error InvalidFee();
    error InvalidSubscriptionType();
    error NotSubscribed();

    // Constructor to set the owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    // Modifier to restrict access to the state channel
    modifier onlyStateChannel() {
        if (msg.sender != stateChannelAddress) {
            revert Unauthorized();
        }
        _;
    }

    // Function to set the state channel address
    function setStateChannelAddress(address _stateChannelAddress) external onlyOwner {
        stateChannelAddress = _stateChannelAddress;
    }

    // Function to add a new subscription type
     function addSubscriptionType(string memory name, uint256 fee) public onlyOwner {
        uint256 subscriptionId = numberOfSubscriptionTypes;
        
        // Check if subscription type already exists
        if (subscriptionTypes[subscriptionId].isActive) {
            revert SubscriptionTypeExists();
        }
        
        // Check if the fee is valid
        if (fee <= 0) {
            revert InvalidFee();
        }

        Subscription memory subscription = Subscription({
            id: subscriptionId,
            name: name,
            fee: fee,
            isActive: true
        });

        subscriptionTypes[subscriptionId] = subscription;
        subscriptionTypesArray.push(subscription);
        numberOfSubscriptionTypes++;

        emit SubscriptionTypeAdded(msg.sender, subscription);
    }


    // Function to subscribe a user to a subscription type
    function subscribe(address user,uint256 subscriptionId) external onlyStateChannel {
        // Check if the subscription type is valid
        if (!subscriptionTypes[subscriptionId].isActive) {
            revert InvalidSubscriptionType();
        }
        
        userSubscriptions[user][subscriptionId] = UserSubscription(true, block.timestamp + 30 days);
        emit UserSubscribed(user, subscriptionId);
    }

    // Function to unsubscribe a user from a subscription type
    function unsubscribe(address user, uint256 subscriptionId) external onlyStateChannel {
        if (!userSubscriptions[user][subscriptionId].isActive) {
            revert NotSubscribed();
        }
        
        delete userSubscriptions[user][subscriptionId];
        emit UserUnsubscribed(user, subscriptionId);
    }

    // Function to check if a user is subscribed
    function isSubscribed(address user, uint256 subscriptionId) external view returns (bool) {
        UserSubscription memory sub = userSubscriptions[user][subscriptionId];
        return sub.isActive && sub.expirationTime > block.timestamp;
    }

    // Function to get the fee for a subscription type
    function getSubscriptionFee(uint256 subscriptionId) external view returns (uint256) {
        return subscriptionTypes[subscriptionId].fee;
    }
}
