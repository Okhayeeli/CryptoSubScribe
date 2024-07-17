"use client";

import React from "react";
import { SubscriptionIcon } from "../../components/SubscriptionIcon";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export type SubscriptionType =
  | "Rent"
  | "Utilities"
  | "Internet"
  | "Streaming"
  | "Gym"
  | "Food Delivery"
  | "Mobile Plan";

interface Subscription {
  id: bigint;
  name: string;
  price: bigint;
  duration: bigint;
}

const ViewSubscription: NextPage = () => {
  const { address } = useAccount();

  const { data: activeSubsData, isLoading: isLoadingActiveSubscriptions } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getActiveSubscriptions",
    args: [address],
  });

  const { data: allSubscriptions, isLoading: isLoadingAllSubscriptions } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getAllSubscriptions",
  });

  const { data: channelBalance } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getChannelBalance",
    args: [address],
  });

  if (isLoadingActiveSubscriptions || isLoadingAllSubscriptions) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  const activeSubscriptions = allSubscriptions?.filter((sub, index) => activeSubsData?.[index]);

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Active Subscriptions</h1>
        <div className="mb-8 text-center bg-gray-800 rounded-lg p-4 shadow-md">
          <p className="text-2xl text-blue-400">
            Channel Balance: {channelBalance ? formatEther(channelBalance) : "0"} ETH
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSubscriptions && activeSubscriptions.length > 0 ? (
            activeSubscriptions.map((subscription: Subscription, index: number) => (
              <motion.div
                key={subscription.id.toString()}
                className="bg-gray-800 rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 relative mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <SubscriptionIcon type={subscription.name as SubscriptionType} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-white">{subscription.name}</h2>
                  <div className="text-center">
                    <p className="text-lg mb-1 text-blue-400">
                      Price: {parseFloat(formatEther(subscription.price)).toFixed(4)} ETH
                    </p>
                    <p className="text-md text-gray-400">
                      Duration: {Number(subscription.duration) / (24 * 60 * 60)} days
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-400">No active subscriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubscription;
