"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import styles from "./ClientProfile.module.css"; // Import the CSS module
import { formatEther } from "viem";

const contractAddress = "0x9f874922ED78A4dCf7DfdD3a0A7CE636e8E7AC8f";

export default function ClientProfile() {
    const { address } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [purchasedOffers, setPurchasedOffers] = useState<any[]>([]);

    useEffect(() => {
        if (address) {
            fetchClientProfile(address as `0x${string}`);
            fetchClientPurchases(address as `0x${string}`);
        }
    }, [address]);

    const fetchClientProfile = async (clientAddress: `0x${string}`) => {
        try {
            const result = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "clients",
                args: [clientAddress],
                chainId: 8453,
            });
            console.log(result);

            setProfile(result);
        } catch (error) {
            console.error("Error fetching client profile:", error);
        }
    };

    const fetchClientPurchases = async (clientAddress: `0x${string}`) => {
        try {
            const purchaseIds = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getClientPurchases",
                args: [clientAddress],
                chainId: 8453,
            });

            const purchaseDetails = await Promise.all(
                purchaseIds.map(async (id: bigint) => {
                    const purchase = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "offerings",
                        args: [id],
                        chainId: 8453,
                    });
                    return purchase;
                })
            );
            setPurchasedOffers(purchaseDetails);
        } catch (error) {
            console.error("Error fetching client purchases:", error);
        }
    };

    const getStatusText = (status: number): string => {
        switch (status) {
            case 0:
                return "Open";
            case 1:
                return "In Progress";
            case 2:
                return "Completed";
            default:
                return "Unknown";
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Client Profile</h1>
            <div className={styles.info}>Address: {address}</div>
            <div className={styles.info}>Telegram Handle: {profile[1]}</div>
            <h2 className={styles.subHeader}>Purchased Offers</h2>
            {purchasedOffers.length > 0 ? (
                purchasedOffers.map((offering, index) => (
                    <div key={index} className={styles.offering}>
                        <h3>{offering[3]}</h3>
                        <p>{offering[4]}</p>
                        <p>Price: {formatEther(offering[5])} ETH</p>
                        <p>Status: {getStatusText(offering[6])}</p>
                        <p>Builder: {offering[1]}</p>
                    </div>
                ))
            ) : (
                <p>No purchased offers found.</p>
            )}
        </div>
    );
}
