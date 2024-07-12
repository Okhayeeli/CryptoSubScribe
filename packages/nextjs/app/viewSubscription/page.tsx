"use client";

import React from "react";
import { SubscriptionIcon } from "../../components/SubscriptionIcon";
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const activeSubscriptions = allSubscriptions?.filter((sub, index) => activeSubsData?.[index]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-5xl font-bold italic text-center mb-4 mt-3">Active Subscriptions</h1>
        <p className="text-xl mb-4">Channel Balance: {channelBalance ? formatEther(channelBalance) : "0"} ETH</p>
        {activeSubscriptions && activeSubscriptions.length > 0 ? (
          activeSubscriptions.map((subscription: Subscription, index: number) => (
            <div key={index} className="bg-base-100 shadow-xl rounded-box p-4 m-4 w-full max-w-2xl">
              <div className="flex justify-evenly">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 relative">
                    <SubscriptionIcon type={subscription.name as SubscriptionType} />
                    <h2 className="text-2xl font-semibold">{subscription.name}</h2>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xl mb-2">Price: {parseFloat(formatEther(subscription.price)).toFixed(4)} ETH</p>
                    <p className="text-lg mb-2">Duration: {Number(subscription.duration) / (24 * 60 * 60)} days</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No active subscriptions found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewSubscription;
