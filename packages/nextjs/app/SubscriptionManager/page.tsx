"use client";

import React from "react";
import SubscriptionList from "../../components/SubscriptionList";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Subscriptions: NextPage = () => {
  const { data: allSubscriptions, isLoading: isSubscriptionsLoading } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getAllSubscriptions",
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {isSubscriptionsLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <div className="container mx-auto p-4">
            <h1 className="text-5xl font-bold italic text-center mb-4 mt-3">Subscriptions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {Array.isArray(allSubscriptions) ? (
                allSubscriptions.map(item => <SubscriptionList key={item.id} subscription={item} />)
              ) : (
                <p>No subscriptions found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Subscriptions;
