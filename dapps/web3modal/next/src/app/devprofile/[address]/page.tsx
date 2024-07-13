"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import styles from "./DeveloperProfile.module.css"; // Import the CSS module

const contractAddress = "0x12D1e124F8C2f20FE9b98CA91B9a51f71A8792E9";

export default function DeveloperProfile() {
    const { address } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [farcasterURL, setFarcasterURL] = useState<string>("");
    const [passportURL, setPassportURL] = useState<string>("");

    useEffect(() => {
        if (address) {
            fetchDeveloperProfile(address as `0x${string}`);
            fetchPassportInfo(address as `0x${string}`);
        }
    }, [address]);

    const fetchDeveloperProfile = async (developerAddress: `0x${string}`) => {
        try {
            const result = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "developers",
                args: [developerAddress],
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
        </div>
    );
}
