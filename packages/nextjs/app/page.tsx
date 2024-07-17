"use client";

import React, { useEffect, useState } from "react";
import { EtherInput } from "../components/scaffold-eth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home = () => {
  const [amount, setAmount] = useState("");
  const [channelOpen, setChannelOpen] = useState(false);
  const { address: userAddress, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { writeContractAsync: openChannel } = useScaffoldWriteContract("SubscriptionManager");
  const { writeContractAsync: closeChannel } = useScaffoldWriteContract("SubscriptionManager");

  const { data: channelData } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "channels",
    args: [userAddress],
  });

  useEffect(() => {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    if (channelData && channelData[0] !== ZERO_ADDRESS) {
      setChannelOpen(true);
    } else {
      setChannelOpen(false);
    }
  }, [channelData]);

  const handleOpenChannel = async () => {
    try {
      if (!amount) {
        console.error("Please enter an amount");
        return;
      }

      await openChannel({ functionName: "openChannel", value: parseEther(amount) });
      setAmount("");
    } catch (error) {
      console.error("Error opening channel:", error);
    }
  };

  const handleCloseChannel = async () => {
    try {
      await closeChannel({ functionName: "closeChannel" });
    } catch (error) {
      console.error("Error closing channel:", error);
    }
  };

  return (
    <div className="container max-auto bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Channel</h2>

        {!isConnected ? (
          <button
            onClick={openConnectModal}
            className="w-full py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Deposit Amount</label>
              <EtherInput value={amount} onChange={value => setAmount(value)} placeholder="0.0" />
            </div>
            <div className="flex flex-col space-y-4">
              <motion.button
                onClick={handleOpenChannel}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  channelOpen
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                whileHover={{ scale: channelOpen ? 1 : 1.02 }}
                whileTap={{ scale: channelOpen ? 1 : 0.98 }}
                disabled={channelOpen}
              >
                {channelOpen ? "Channel Open" : "Open Channel"}
              </motion.button>
              <motion.button
                onClick={handleCloseChannel}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  !channelOpen
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-red-700 text-white hover:bg-gray-600"
                }`}
                whileHover={{ scale: !channelOpen ? 1 : 1.02 }}
                whileTap={{ scale: !channelOpen ? 1 : 0.98 }}
                disabled={!channelOpen}
              >
                Close Channel
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
