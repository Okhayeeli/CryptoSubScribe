"use client";

import { useEffect } from "react";
import { ChannelManager } from "../components/ChannelManager";
import { Address, Balance } from "../components/scaffold-eth";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  ///const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      // const ownerAddress = await contract.owner();
      // setIsOwner(address === ownerAddress);
    };

    if (isConnected) {
      checkOwner();
    }
  }, [address, isConnected]);

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Subscription Channel</h1>

      {isConnected ? (
        <>
          <div className="mb-8">
            <Address address={address} />
            <Balance address={address} />
          </div>
          <ChannelManager />
        </>
      ) : (
        <p>Please connect your wallet to use the Subscription Manager.</p>
      )}
    </div>
  );
};

export default Home;
