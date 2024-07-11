"use client";

import React from "react";
import { SubscriptionIcon } from "../../components/SubscriptionIcon";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const useActiveSubscriptions = () => {
  const { address } = useAccount();
  const { data: activeSubscriptions, isLoading: isLoadingActiveSubscriptions } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getActiveSubscriptions",
    args: [address],
  });

  return { activeSubscriptions, isLoadingActiveSubscriptions };
};

const useAllSubscriptions = () => {
  const { data: allSubscriptions, isLoading: isLoadingAllSubscriptions } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getAllSubscriptions",
  });

  return { allSubscriptions, isLoadingAllSubscriptions };
};

const ViewSubscription: React.FC = () => {
  const { activeSubscriptions, isLoadingActiveSubscriptions } = useActiveSubscriptions();
  const { allSubscriptions, isLoadingAllSubscriptions } = useAllSubscriptions();

  if (isLoadingActiveSubscriptions || isLoadingAllSubscriptions) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const activeSubscriptionList =
    allSubscriptions?.filter(
      subscription =>
        Array.isArray(activeSubscriptions) &&
        activeSubscriptions.some(activeSubscription => activeSubscription.id === subscription.id),
    ) ?? [];

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-5xl font-medium italic text-center mb-4 mt-3">Active Subscriptions</h1>

        {activeSubscriptionList && activeSubscriptionList.length > 0 ? (
          activeSubscriptionList.map((subscription: any, index: number) => (
            <div key={index} className="bg-base-100 shadow-xl rounded-box p-4 m-4 w-full max-w-2xl">
              <div className="flex justify-evenly">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 relative">
                    <SubscriptionIcon type={subscription.name} />
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
          <h2 className="text-xl font-bold text-center mb-4 mt-3">No active subscriptions</h2>
        )}
      </div>
    </div>
  );
};

export default ViewSubscription;
