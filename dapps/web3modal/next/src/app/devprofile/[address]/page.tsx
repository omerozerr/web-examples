"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import { useAccount, useDisconnect } from "wagmi";

const contractAddress = "0xC5B5827B55F31D17018BbC52B6bb123f7615B68F";

export default function DeveloperProfile() {
    const { address } = useParams();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (address) {
            fetchDeveloperProfile(address as `0x${string}`);
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

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Developer Profile</h1>
            <div>Address: {address}</div>
            <div>Name: {profile[1]}</div>
            <div>Bio: {profile[2]}</div>
            <div>Builder Score: {profile[3].toString()}</div>
            {/* Assuming there's a profile picture URL stored in the profile data */}
            {profile[5] && <img src={profile[5]} alt="Profile Picture" />}
        </div>
    );
}
