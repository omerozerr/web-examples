"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import React, { useEffect, useState } from "react";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/config";
import abi from "./abi";
import { parseEther, formatEther } from "viem";
import styles from "./Profile.module.css"; // Import the CSS module

const contractAddress = "0x9f874922ED78A4dCf7DfdD3a0A7CE636e8E7AC8f";

export default function Profile({ role }: { role: "client" | "developer" }) {
    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { chainId, address, isConnected, isDisconnected } = useAccount();
    const [isRegistered, setIsRegistered] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [builderScore, setBuilderScore] = useState<number>(0); // Initialize as 0
    const [telegramHandle, setTelegramHandle] = useState("");

    // New state variables for job offering
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobPrice, setJobPrice] = useState<string>("");
    const [offerings, setOfferings] = useState<any[]>([]); // State to store offerings

    const [purchasedOffers, setPurchasedOffers] = useState<any[]>([]); // State to store purchased offerings

    const [updateDevTxHash, setUpdateDevTxHash] = useState<string | null>(null);
    const [updateClientTxHash, setUpdateClientTxHash] = useState<string | null>(
        null
    );
    const [registerDevTxHash, setRegisterDevTxHash] = useState<string | null>(
        null
    );
    const [registerClientTxHash, setRegisterClientTxHash] = useState<
        string | null
    >(null);
    const [createJobTxHash, setCreateJobTxHash] = useState<string | null>(null);
    const [markcompletedTxHash, setmarkcompletedTxHash] = useState<
        string | null
    >(null);

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

    const convertEtherToWei = (etherValue: string): bigint => {
        return parseEther(etherValue);
    };

    const stringToBigInt = (value: string): bigint => {
        return BigInt(value);
    };

    const convertWeiToEther = (weiValue: bigint): string => {
        return formatEther(weiValue);
    };

    useEffect(() => {
        if (address) {
            fetchBuilderScore(address);
            checkRegistration(role);
        }
    }, [address]);

    useEffect(() => {
        if (isRegistered && role === "developer") {
            fetchDeveloperOfferings();
        } else if (isRegistered && role === "client") {
            fetchClientPurchases();
        }
    }, [isRegistered, role]);

    const fetchClientPurchases = async () => {
        if (!address) return; // Added check for address
        try {
            console.log("checking purchases");
            const purchaseIds = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: "getClientPurchases",
                args: [address],
                chainId: 84532, // Ensure the chain ID is set correctly for Base Sepolia
            });
            console.log(purchaseIds);

            const purchaseDetails = await Promise.all(
                purchaseIds.map(async (id: bigint) => {
                    const purchase = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "offerings",
                        args: [id],
                        chainId: 84532, // Ensure the chain ID is set correctly for Base Sepolia
                    });
                    return purchase;
                })
            );
            console.log(purchaseDetails);

            setPurchasedOffers(purchaseDetails);
        } catch (error) {
            console.error("Error fetching client purchases:", error);
        }
    };

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
                setTelegramHandle(result[4]);
                setIsRegistered(result[5]);
            } else if (role === "client") {
                const result = await readContract(config, {
                    abi,
                    address: contractAddress,
                    functionName: "clients",
                    args: [address],
                });
                console.log(result);
                setTelegramHandle(result[1]);
                setIsRegistered(result[2]);
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
                args: [name, bio, builderScore, telegramHandle],
                chainId: 8453,
            });
            setIsRegistered(true);
            setRegisterDevTxHash(result); // Capture transaction hash
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
                args: [telegramHandle],
                chainId: 8453,
            });
            setIsRegistered(true);
            setRegisterClientTxHash(result); // Capture transaction hash
        } catch (error) {
            console.error("Error registering client:", error);
        }
    };

    const updateDeveloperProfile = async () => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "updateDeveloperProfile",
                args: [name, bio, builderScore, telegramHandle],
                chainId: 8453,
            });
            console.log("Developer profile updated:", result);
            setUpdateDevTxHash(result); // Capture transaction hash
        } catch (error) {
            console.error("Error updating developer profile:", error);
        }
    };

    const updateClientProfile = async () => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "updateClientProfile",
                args: [telegramHandle],
                chainId: 8453,
            });
            console.log("Client profile updated:", result);
            setUpdateClientTxHash(result); // Capture transaction hash
        } catch (error) {
            console.error("Error updating client profile:", error);
        }
    };

    const createJobOffering = async () => {
        try {
            console.log(jobPrice);
            console.log(convertEtherToWei(jobPrice));
            console.log(Number(convertEtherToWei(jobPrice)));

            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "createOffering",
                args: [jobTitle, jobDescription, convertEtherToWei(jobPrice)],
                chainId: 8453,
            });
            console.log("Job offering created:", result);
            setCreateJobTxHash(result); // Capture transaction hash
            fetchDeveloperOfferings();
            // Reset form
            setJobTitle("");
            setJobDescription("");
            setJobPrice("");
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
            });
            console.log(offeringIds);

            const offeringDetails = await Promise.all(
                offeringIds.map(async (id: bigint) => {
                    const offering = await readContract(config, {
                        abi,
                        address: contractAddress,
                        functionName: "offerings",
                        args: [id],
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

    const markOfferingCompleted = async (id: bigint) => {
        try {
            const result = await writeContract(config, {
                abi,
                address: contractAddress,
                functionName: "markOfferingCompleted",
                args: [id],
                chainId: 8453,
            });
            console.log("Offering marked as completed:", result);
            fetchDeveloperOfferings(); // Refresh the offerings
            setmarkcompletedTxHash(result); // Capture transaction hash
        } catch (error) {
            console.error("Error marking offering as completed:", error);
        }
    };

    return (
        <div className={styles["profile-container"]}>
            {isRegistered && isConnected ? (
                role === "developer" ? (
                    <div>
                        <div className={styles["profile-section"]}>
                            <h3>Developer Profile</h3>
                            <div>Connected Wallet Address: {address}</div>
                            <div>Name: {name}</div>
                            <div>Bio: {bio}</div>
                            <div>Builder Score: {builderScore.toString()}</div>
                            <div>Telegram Handle: {telegramHandle}</div>
                        </div>
                        <div className={styles["profile-section"]}>
                            <h4>Edit Profile</h4>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Telegram Handle"
                                value={telegramHandle}
                                onChange={(e) =>
                                    setTelegramHandle(e.target.value)
                                }
                                className={styles.input}
                            />

                            <button
                                onClick={updateDeveloperProfile}
                                className={styles.button}
                            >
                                Update Profile
                            </button>
                            <br></br>
                            <br></br>

                            {updateDevTxHash && (
                                <a
                                    href={`https://base.blockscout.com/tx/${updateDevTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    See the tx on Blockscout Explorer
                                </a>
                            )}
                        </div>
                        <div className={styles["profile-section"]}>
                            <h4>Create Job Offering</h4>
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Job Description"
                                value={jobDescription}
                                onChange={(e) =>
                                    setJobDescription(e.target.value)
                                }
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Job Price in ETH"
                                value={jobPrice}
                                onChange={(e) => setJobPrice(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                onClick={createJobOffering}
                                className={styles.button}
                            >
                                Create Job Offering
                            </button>
                            <br></br>
                            <br></br>
                            {createJobTxHash && (
                                <a
                                    href={`https://base.blockscout.com/tx/${createJobTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    See the tx on Blockscout Explorer
                                </a>
                            )}
                        </div>
                        <div className={styles["profile-section"]}>
                            <h4>My Job Offerings</h4>
                            {offerings.length > 0 ? (
                                offerings.map((offering, index) => (
                                    <div
                                        key={index}
                                        className={styles["offering"]}
                                    >
                                        <h3>Title: {offering[3]}</h3>
                                        <p>Description: {offering[4]}</p>
                                        <p>
                                            Price:{" "}
                                            {convertWeiToEther(offering[5])} ETH
                                        </p>
                                        <p>
                                            Status: {getStatusText(offering[6])}
                                        </p>
                                        {offering[6] == 1 && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        markOfferingCompleted(
                                                            offering[0]
                                                        )
                                                    }
                                                    className={styles.button}
                                                >
                                                    Mark as Completed
                                                </button>
                                                <br></br>
                                                <br></br>

                                                {markcompletedTxHash && (
                                                    <a
                                                        href={`https://base.blockscout.com/tx/${markcompletedTxHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.link}
                                                    >
                                                        See the tx on Blockscout
                                                        Explorer
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No job offerings found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles["profile-section"]}>
                        <h3>Client Profile</h3>
                        <div>Connected Wallet Address: {address}</div>
                        <div>Telegram Handle: {telegramHandle}</div>
                        <div>
                            <h4>Edit Profile</h4>
                            <input
                                type="text"
                                placeholder="Telegram Handle"
                                value={telegramHandle}
                                onChange={(e) =>
                                    setTelegramHandle(e.target.value)
                                }
                                className={styles.input}
                            />
                            <button
                                onClick={updateClientProfile}
                                className={styles.button}
                            >
                                Update Profile
                            </button>
                            <br></br>
                            <br></br>

                            {updateClientTxHash && (
                                <a
                                    href={`https://base.blockscout.com/tx/${updateClientTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    See the tx on Blockscout Explorer
                                </a>
                            )}
                        </div>
                        <div>
                            <h4>Purchased Offers</h4>
                            {purchasedOffers.length > 0 ? (
                                purchasedOffers.map((offering, index) => (
                                    <div
                                        key={index}
                                        className={styles.offering}
                                    >
                                        <h3>{offering[3]}</h3>
                                        <p>{offering[4]}</p>
                                        <p>
                                            Price:{" "}
                                            {convertWeiToEther(
                                                offering[5].toString()
                                            )}
                                        </p>
                                        <p>
                                            Status: {getStatusText(offering[6])}
                                        </p>
                                        <p>Builder: {offering[1]}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No purchased offers found.</p>
                            )}
                        </div>
                    </div>
                )
            ) : isConnected ? (
                <div className={styles["profile-section"]}>
                    {role === "developer" ? (
                        <div>
                            <h3>Register as Developer</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Telegram Handle"
                                value={telegramHandle}
                                onChange={(e) =>
                                    setTelegramHandle(e.target.value)
                                }
                                className={styles.input}
                            />

                            <button
                                onClick={registerDeveloper}
                                className={styles.button}
                            >
                                Register
                            </button>
                            <br></br>
                            <br></br>

                            {registerDevTxHash && (
                                <a
                                    href={`https://base.blockscout.com/tx/${registerDevTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    See the tx on Blockscout Explorer
                                </a>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3>Register as Client</h3>
                            <input
                                type="text"
                                placeholder="Telegram Handle"
                                value={telegramHandle}
                                onChange={(e) =>
                                    setTelegramHandle(e.target.value)
                                }
                                className={styles.input}
                            />

                            <button
                                onClick={registerClient}
                                className={styles.button}
                            >
                                Register
                            </button>
                            <br></br>
                            <br></br>

                            {registerClientTxHash && (
                                <a
                                    href={`https://base.blockscout.com/tx/${registerClientTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    See the tx on Blockscout Explorer
                                </a>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p className={styles.text}>Please connect your wallet</p>
            )}
        </div>
    );
}
