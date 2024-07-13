"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import Link from "next/link";
import { parseEther, formatEther } from "viem";
import styles from "./Browse.module.css"; // Import the CSS module

const contractAddress = "0x12D1e124F8C2f20FE9b98CA91B9a51f71A8792E9";

export default function Browse() {
    const { address, isConnected } = useAccount();
    const [offerings, setOfferings] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [builderScores, setBuilderScores] = useState<{
        [key: string]: number;
    }>({});

    // Function to convert Ether to Wei using viem
    const convertEtherToWei = (etherValue: string): bigint => {
        return parseEther(etherValue);
    };

    // Function to convert a string to BigInt

    const stringToBigInt = (value: string): bigint => {
        return BigInt(value);
    };

    const convertWeiToEther = (weiValue: bigint): string => {
        return formatEther(weiValue);
    };

    useEffect(() => {
        fetchAllOfferings();
        checkClientRegistration();
        console.log(offerings);
    }, [address]);

    useEffect(() => {
        if (offerings.length > 0) {
            fetchBuilderScores();
        }
    }, [offerings]);

    const fetchBuilderScores = async () => {
        const scores: { [key: string]: number } = {};
        for (const offering of offerings) {
            try {
                const developer = offering.developer;
                if (!scores[developer]) {
                    const result = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "developers",
                        args: [developer],
                        chainId: 84532,
                    });
                    scores[developer] = result[3];
                }
            } catch (error) {
                console.error(
                    `Error fetching builder score for ${offering.developer}:`,
                    error
                );
            }
        }
        setBuilderScores(scores);
    };

    const fetchAllOfferings = async () => {
        try {
            const allOfferings = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getAllOfferings",
                chainId: 84532,
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
            });
            console.log(result);

            setIsClient(result[2]);
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
            });
            console.log("Offering purchased:", result);
            // Update offerings list or perform additional actions after purchase
        } catch (error) {
            console.error("Error purchasing offering:", error);
        }
    };

    return (
        <div>
            <h1 className={styles.header}>Browse Offerings</h1>
            {isConnected ? (
                <p></p>
            ) : (
                <p className={styles.text}>
                    {" "}
                    Connect your wallet to be able to buy offerings
                </p>
            )}
            <div className={styles.container}>
                {offerings.length > 0 ? (
                    offerings.map((offering, index) => (
                        <div key={index} className={styles.offering}>
                            <h3>{offering.title}</h3>
                            <p>{offering.description}</p>
                            <p>
                                Price: {convertWeiToEther(offering.price)} ETH
                            </p>
                            <p>Status: {offering.status}</p>
                            <p>Builder: {offering.developer}</p>
                            {builderScores[offering.developer] !==
                                undefined && (
                                <p>
                                    Builder Score:{" "}
                                    {builderScores[offering.developer]}
                                </p>
                            )}
                            {offering.status === 1 || offering.status === 2 ? (
                                <p>Client: {offering.client}</p>
                            ) : null}
                            <Link
                                className={styles.button}
                                href={`/devprofile/${offering.developer}`}
                            >
                                View Developer Profile
                            </Link>
                            {isClient &&
                                offering.status == 0 &&
                                isConnected && (
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            buyOffering(
                                                offering.id,
                                                offering.price
                                            )
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
        </div>
    );
}
