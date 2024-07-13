"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionIcon } from "./SubscriptionIcon";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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

const SubscriptionList: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
  const router = useRouter();
  const { address: userAddress } = useAccount();
  const [channelOpen, setChannelOpen] = useState(false);
  const [channelBalance, setChannelBalance] = useState<bigint>(BigInt(0));

  const { data: channelData } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "channels",
    args: [userAddress],
  });

  const { data: balanceData, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getChannelBalance",
    args: [userAddress],
  });

  const { writeContractAsync: activateSubscription } = useScaffoldWriteContract("SubscriptionManager");

  useEffect(() => {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    if (channelData && channelData[0] !== ZERO_ADDRESS) {
      setChannelOpen(true);
    } else {
      setChannelOpen(false);
    }
  }, [channelData]);

  useEffect(() => {
    if (balanceData !== undefined) {
      setChannelBalance(BigInt(balanceData.toString()));
    }
  }, [balanceData]);

  const handleBuySubscription = async (subscription: Subscription) => {
    if (!channelOpen) {
      console.error("Channel not open. Please open a channel first.");
      return;
    }

    if (channelBalance < subscription.price) {
      console.error("Insufficient balance in the channel. Please add more funds.");
      return;
    }

    try {
      await activateSubscription({
        args: [subscription.id],
        functionName: "activateSubscription",
      });

      console.log("Subscription activated successfully");
      refetchBalance();
      router.push("/viewSubscription");
    } catch (error) {
      console.error("Error activating subscription", error);
    }
  };

  return (
    <div className="subscription-card border p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-24 h-24 relative">
          <SubscriptionIcon type={subscription.name as SubscriptionType} />
        </div>
      </div>
      <div className="subscription-details text-center">
        <h3 className="text-2xl font-semibold mb-2">{subscription.name}</h3>
        <p className="mb-2">Price: {formatEther(subscription.price)} ETH</p>
        <p className="mb-4">Duration: {Number(subscription.duration) / (24 * 60 * 60)} days</p>
        <p className="mb-4">Channel Balance: {formatEther(channelBalance)} ETH</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => handleBuySubscription(subscription)}
          disabled={!channelOpen || channelBalance < subscription.price}
        >
          {!channelOpen
            ? "Open Channel"
            : channelBalance < subscription.price
              ? "Insufficient Balance"
              : "Activate Subscription"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionList;
