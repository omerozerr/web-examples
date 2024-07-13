"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "@/components/abi";
import { useAccount, useDisconnect } from "wagmi";

const contractAddress = "0x12D1e124F8C2f20FE9b98CA91B9a51f71A8792E9";

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
        </div>
    );
}
