"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Subscription {
  id: bigint;
  name: string;
  price: bigint;
  duration: bigint;
}

const BatchSubscription: React.FC = () => {
  const { address } = useAccount();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[]>([]);
  const [channelBalance, setChannelBalance] = useState<bigint>(BigInt(0));

  const { data: allSubscriptions, isLoading: isLoadingAllSubscriptions } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getAllSubscriptions",
  });

  const { data: balanceData, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getChannelBalance",
    args: [address],
  });

  const { writeContractAsync: activateSubscriptionsBatch } = useScaffoldWriteContract("SubscriptionManager");

  useEffect(() => {
    if (balanceData !== undefined) {
      setChannelBalance(BigInt(balanceData.toString()));
    }
  }, [balanceData]);

  const totalCost = selectedSubscriptions.reduce((sum, sub) => sum + sub.price, BigInt(0));
  const gasSavingsPercentage = Math.min(100, selectedSubscriptions.length * 5); // 5% savings per subscription, max 100%

  const handleSelectSubscription = (subscription: Subscription) => {
    setSelectedSubscriptions(prev =>
      prev.find(s => s.id === subscription.id) ? prev.filter(s => s.id !== subscription.id) : [...prev, subscription],
    );
  };

  const handleActivateSelected = async () => {
    if (selectedSubscriptions.length === 0) return;

    const subscriptionIds = selectedSubscriptions.map(s => s.id.toString());
    try {
      await activateSubscriptionsBatch({
        args: [subscriptionIds.map(id => BigInt(id))],
        functionName: "activateSubscriptionsBatch",
      });
      console.log("Batch subscriptions activated successfully");
      refetchBalance();
      setSelectedSubscriptions([]);
    } catch (error) {
      console.error("Error activating batch subscriptions", error);
    }
  };

  if (isLoadingAllSubscriptions) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">batch for lower gas</h1>

      <div className="mb-8 text-center">
        <p className="text-xl mb-2">Channel Balance: {formatEther(channelBalance)} ETH</p>
        <p className="text-xl mb-4">
          Selected: {selectedSubscriptions.length} | Total Cost: {formatEther(totalCost)} ETH
        </p>

        {/* Gas Tank Visualization */}
        <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-green-400"
            initial={{ width: "0%" }}
            animate={{ width: `${gasSavingsPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-lg">Gas Savings: {gasSavingsPercentage}%</span>
          </div>
        </div>

        <button
          className="btn btn-primary mt-6 text-lg px-8 py-3 rounded-full bg-yellow-400 text-purple-900 hover:bg-yellow-300 transition-colors"
          onClick={handleActivateSelected}
          disabled={selectedSubscriptions.length === 0 || totalCost > channelBalance}
        >
          Activate {selectedSubscriptions.length} Subscriptions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSubscriptions &&
          allSubscriptions.map((subscription: Subscription) => (
            <motion.div
              key={subscription.id.toString()}
              className={`bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-6 cursor-pointer ${
                selectedSubscriptions.find(s => s.id === subscription.id) ? "ring-4 ring-yellow-400" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectSubscription(subscription)}
            >
              <h2 className="text-2xl font-semibold mb-2 text-purple-300">{subscription.name}</h2>
              <p className="text-lg text-white">Price: {formatEther(subscription.price)} ETH</p>
              <p className="text-gray-300">Duration: {Number(subscription.duration) / (24 * 60 * 60)} days</p>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default BatchSubscription;
