"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import styles from "./DeveloperProfile.module.css"; // Import the CSS module
import { formatEther } from "viem";

const contractAddress = "0x9f874922ED78A4dCf7DfdD3a0A7CE636e8E7AC8f";

export default function DeveloperProfile() {
    const { address } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [farcasterURL, setFarcasterURL] = useState<string>("");
    const [passportURL, setPassportURL] = useState<string>("");
    const [offerings, setOfferings] = useState<any[]>([]); // State to store developer's job offerings

    useEffect(() => {
        if (address) {
            fetchDeveloperProfile(address as `0x${string}`);
            fetchPassportInfo(address as `0x${string}`);
            fetchDeveloperOfferings(address as `0x${string}`);
        }
    }, [address]);

    const fetchDeveloperProfile = async (developerAddress: `0x${string}`) => {
        try {
            const result = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "developers",
                args: [developerAddress],
                chainId: 8453,
            });
            console.log(result);

            setProfile(result);
        } catch (error) {
            console.error("Error fetching developer profile:", error);
        }
    };

    const fetchPassportInfo = async (developerAddress: `0x${string}`) => {
        try {
            const response = await fetch(
                `https://api.talentprotocol.com/api/v2/passports/${developerAddress}`
            );
            if (response.ok) {
                const data = await response.json();
                if (
                    data.passport &&
                    data.passport.passport_socials &&
                    data.passport.passport_socials.length > 0
                ) {
                    const profileUrl =
                        data.passport.passport_socials[0].profile_url;
                    setFarcasterURL(profileUrl);
                }
                const passportId = data.passport.passport_id;
                setPassportURL(
                    `https://passport.talentprotocol.com/profile/${passportId}`
                );
            } else {
                console.error(
                    "Error fetching passport info:",
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error fetching passport info:", error);
        }
    };

    const fetchDeveloperOfferings = async (developerAddress: `0x${string}`) => {
        try {
            const offeringIds = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getDeveloperOfferings",
                args: [developerAddress],
                chainId: 8453,
            });

            const offeringDetails = await Promise.all(
                offeringIds.map(async (id: bigint) => {
                    const offering = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "offerings",
                        args: [id],
                        chainId: 8453,
                    });
                    return offering;
                })
            );
            setOfferings(offeringDetails);
        } catch (error) {
            console.error("Error fetching developer offerings:", error);
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
            <h1 className={styles.header}>Developer Profile</h1>
            <div className={styles.info}>Address: {address}</div>
            <div className={styles.info}>Name: {profile[1]}</div>
            <div className={styles.info}>Bio: {profile[2]}</div>
            <div className={styles.info}>Telegram Handle: {profile[4]}</div>
            <div className={styles.info}>
                Builder Score: {profile[3].toString()}
            </div>
            {farcasterURL && (
                <a
                    href={farcasterURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.button}
                >
                    View Farcaster
                </a>
            )}
            <br></br>
            <br></br>

            {passportURL && (
                <a
                    href={passportURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.button}
                >
                    View Talent Passport
                </a>
            )}
            <h2 className={styles.subHeader}>Job Offerings</h2>
            {offerings.length > 0 ? (
                offerings.map((offering, index) => (
                    <div key={index} className={styles.offering}>
                        <h3>{offering[3]}</h3>
                        <p>{offering[4]}</p>
                        <p>Price: {formatEther(offering[5])} ETH</p>
                        <p>Status: {getStatusText(offering[6])}</p>
                    </div>
                ))
            ) : (
                <p>No job offerings found.</p>
            )}
        </div>
    );
}
