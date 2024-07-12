"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import React, { useEffect, useState } from "react";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "./abi";

const contractAddress = "0xC5B5827B55F31D17018BbC52B6bb123f7615B68F";

export default function Profile({ role }: { role: "client" | "developer" }) {
    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { chainId, address, isConnected, isDisconnected } = useAccount();
    const [isRegistered, setIsRegistered] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [builderScore, setBuilderScore] = useState<number>(0); // Initialize as 0

    // New state variables for job offering
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobPrice, setJobPrice] = useState<number>(0);
    const [offerings, setOfferings] = useState<any[]>([]); // State to store offerings

    useEffect(() => {
        if (address) {
            fetchBuilderScore(address);
            checkRegistration(role);
        }
    }, [address]);

    useEffect(() => {
        if (isRegistered && role === "developer") {
            fetchDeveloperOfferings();
        }
    }, [isRegistered, role]);

    const fetchBuilderScore = async (walletAddress: string) => {
        try {
            const response = await fetch(
                `https://api.talentprotocol.com/api/v2/passports/${walletAddress}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    setBuilderScore(0);
                    console.log("Builder does not have a Talent Passport");
                } else {
                    throw new Error(`Error: ${response.status}`);
                }
            } else {
                const data = await response.json();
                if (data && data.passport) {
                    setBuilderScore(data.passport.score);
                }
            }
        } catch (error) {
            console.error("Error fetching builder score:", error);
        }
    };

    const checkRegistration = async (role: "client" | "developer") => {
        if (!address) return;
        try {
            if (role === "developer") {
                const result = await readContract(config, {
                    abi,
                    address: contractAddress,
                    functionName: "developers",
                    args: [address],
                });
                console.log(result);
                setName(result[1]);
                setBio(result[2]);
                setIsRegistered(result[4]);
            } else if (role === "client") {
                const result = await readContract(config, {
                    abi,
                    address: contractAddress,
                    functionName: "clients",
                    args: [address],
                });
                console.log(result);
                setIsRegistered(result[1]);
            }
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    };

    const registerDeveloper = async () => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "registerDeveloper",
                args: [name, bio, builderScore],
                chainId: 11155111,
            });
            setIsRegistered(true);
        } catch (error) {
            console.error("Error registering developer:", error);
        }
    };

    const registerClient = async () => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "registerClient",
                chainId: 11155111,
            });
            setIsRegistered(true);
        } catch (error) {
            console.error("Error registering client:", error);
        }
    };

    const createJobOffering = async () => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "createOffering",
                args: [jobTitle, jobDescription, jobPrice],
            });
            console.log("Job offering created:", result);
            fetchDeveloperOfferings();
            // Reset form
            setJobTitle("");
            setJobDescription("");
            setJobPrice(0);
        } catch (error) {
            console.error("Error creating job offering:", error);
        }
    };

    const fetchDeveloperOfferings = async () => {
        if (!address) return; // Added check for address
        try {
            console.log("checking");
            const offeringIds = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getDeveloperOfferings",
                args: [address],
                chainId: 11155111,
            });
            console.log(offeringIds);

            const offeringDetails = await Promise.all(
                offeringIds.map(async (id: bigint) => {
                    const offering = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "offerings",
                        args: [id],
                        chainId: 11155111,
                    });
                    return offering;
                })
            );
            console.log(offeringDetails);

            setOfferings(offeringDetails);
        } catch (error) {
            console.error("Error fetching developer offerings:", error);
        }
    };

    return (
        <div>
            <div>Connected Wallet Address: {address}</div>

            {isRegistered && isConnected ? (
                role === "developer" ? (
                    <div>
                        <div>
                            <h3>Developer Profile</h3>
                            <div>Name: {name}</div>
                            <div>Bio: {bio}</div>
                            <div>Builder Score: {builderScore.toString()}</div>
                        </div>
                        <div>
                            <h4>Create Job Offering</h4>
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Job Description"
                                value={jobDescription}
                                onChange={(e) =>
                                    setJobDescription(e.target.value)
                                }
                            />
                            <input
                                type="number"
                                placeholder="Job Price"
                                value={jobPrice}
                                onChange={(e) =>
                                    setJobPrice(Number(e.target.value))
                                }
                            />
                            <button onClick={createJobOffering}>
                                Create Job Offering
                            </button>
                        </div>
                        <div>
                            <h4>My Job Offerings</h4>
                            {offerings.length > 0 ? (
                                offerings.map((offering, index) => (
                                    <div key={index}>
                                        <h3>title: {offering[3]}</h3>
                                        <p>description: {offering[4]}</p>
                                        <p>Price: {offering[5].toString()}</p>
                                        <p>Status: {offering[6]}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No job offerings found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Client Profile</h3>
                    </div>
                )
            ) : isConnected ? (
                <div>
                    {role === "developer" ? (
                        <div>
                            <h3>Register as Developer</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <button onClick={registerDeveloper}>
                                Register
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3>Register as Client</h3>
                            <button onClick={registerClient}>Register</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
}
