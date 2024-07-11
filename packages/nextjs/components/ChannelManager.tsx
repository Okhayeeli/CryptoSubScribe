import { useState } from "react";
import { EtherInput } from "../components/scaffold-eth";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ChannelManager = () => {
  const [amount, setAmount] = useState("");
  const { writeContractAsync: openChannel } = useScaffoldWriteContract("SubscriptionManager");
  const { writeContractAsync: closeChannel } = useScaffoldWriteContract("SubscriptionManager");

  const { refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "SubscriptionManager",
    functionName: "getChannelBalance",
    args: [undefined],
  });

  const handleOpenChannel = async () => {
    try {
      if (!amount) {
        console.error("Please enter an amount");
        return;
      }

      await openChannel({ functionName: "openChannel", value: parseEther(amount) });
      await refetchBalance();
    } catch (error) {
      console.error("Error opening channel:", error);
    }
  };

  const handleCloseChannel = async () => {
    try {
      await closeChannel({ functionName: "closeChannel" });
      await refetchBalance();
    } catch (error) {
      console.error("Error closing channel:", error);
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-4">Deposit for Subscriptions</h2>
      <EtherInput value={amount} onChange={value => setAmount(value)} placeholder="Amount to deposit" />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleOpenChannel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        >
          Open Channel
        </button>
        <button
          onClick={handleCloseChannel}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          Close Channel
        </button>
      </div>
    </div>
  );
};

export default ChannelManager;
