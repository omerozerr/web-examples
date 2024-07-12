"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import Link from "next/link";

const contractAddress = "0xC5B5827B55F31D17018BbC52B6bb123f7615B68F";

export default function Browse() {
    const { address, isConnected } = useAccount();
    const [offerings, setOfferings] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        fetchAllOfferings();
        checkClientRegistration();
        console.log(offerings);
    }, [address]);

    const fetchAllOfferings = async () => {
        try {
            const allOfferings = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getAllOfferings",
            });
            setOfferings(Array.from(allOfferings)); // Convert readonly array to mutable array
        } catch (error) {
            console.error("Error fetching all offerings:", error);
        }
    };

    const checkClientRegistration = async () => {
        if (!address) return;
        try {
            const result = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "clients",
                args: [address],
                chainId: 11155111,
            });
            console.log(result);

            setIsClient(result[1]);
        } catch (error) {
            console.error("Error checking client registration:", error);
        }
    };

    const buyOffering = async (id: bigint, price: bigint) => {
        if (!isClient) {
            alert(
                "You must be registered as a client to purchase an offering."
            );
            return;
        }
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "purchaseOffering",
                args: [id],
                value: price,
                chainId: 11155111,
            });
            console.log("Offering purchased:", result);
            // Update offerings list or perform additional actions after purchase
        } catch (error) {
            console.error("Error purchasing offering:", error);
        }
    };

    return (
        <div>
            <h1>Browse Offerings</h1>
            {isConnected ? (
                <p></p>
            ) : (
                <p>Connect your wallet to be able to buy offerings</p>
            )}
            {offerings.length > 0 ? (
                offerings.map((offering, index) => (
                    <div key={index}>
                        <h3>{offering.title}</h3>
                        <p>{offering.description}</p>
                        <p>Price: {offering.price.toString()}</p>
                        <p>Status: {offering.status}</p>
                        <p>Builder: {offering.developer}</p>
                        <Link href={`/devprofile/${offering.developer}`}>
                            View Developer Profile
                        </Link>
                        {isClient && offering.status == 0 && isConnected && (
                            <button
                                onClick={() =>
                                    buyOffering(offering.id, offering.price)
                                }
                            >
                                Buy
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No offerings available.</p>
            )}
        </div>
    );
}
