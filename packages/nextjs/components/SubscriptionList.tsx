"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SubscriptionIcon } from "./SubscriptionIcon";
import { formatEther } from "viem";
import { useDeployedContractInfo, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export type SubscriptionType =
  | "Rent"
  | "Utilities"
  | "Internet"
  | "Streaming"
  | "Gym"
  | "Food Delivery"
  | "Mobile Plan";

interface Subscription {
  length: number;
  id: bigint;
  name: string;
  price: bigint; // Price in Wei
  duration: number;
}

export const SubscriptionList: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
  const router = useRouter();
  const { data: subscriptionData } = useDeployedContractInfo("SubscriptionManager");
  const { writeContractAsync: writeSubscriptionManager } = useScaffoldWriteContract("SubscriptionManager");

  if (!subscriptionData) return <div>Loading contract data...</div>;
  if (subscription.length === 0) return <div>No subscriptions available.</div>;

  const handleBuySubscription = async (subscription: Subscription) => {
    try {
      await writeSubscriptionManager({
        functionName: "buySubscription",
        args: [subscription.id],
      });
      router.push("/viewSubscription"); // Navigate to view subscription page after purchase
    } catch (error) {
      console.error("Error buying subscription", error);
    }
  };

  return (
    <div className="subscription-card border p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-24 h-24 relative"></div>
        <SubscriptionIcon type={subscription.name as SubscriptionType} />
      </div>
      <div className="subscription-details text-center">
        <h3 className="text-2xl font-semibold mb-2">{subscription.name}</h3>
        <p className="mb-2">Price: {parseFloat(formatEther(subscription.price)).toFixed(4)} ETH</p>
        <p className="mb-4">Duration: {Number(subscription.duration) / (24 * 60 * 60)} days</p>
        <button className="btn btn-primary mt-4" onClick={() => handleBuySubscription(subscription)}>
          Pay
        </button>
      </div>
    </div>
  );
};

export default SubscriptionList;
