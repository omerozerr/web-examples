import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { abi } from "./abi";
import { config } from "./config";

const contractAddress = "0x73C5f658AE2716FC10056944A3445a0A026256Db";

interface WalletComponentProps {
    wagmiConfig: any; // Define the type for wagmiConfig if you have a specific type
}

const WalletComponent: React.FC<WalletComponentProps> = ({ wagmiConfig }) => {
    const { address, isConnecting, isDisconnected } = useAccount();
    const [role, setRole] = useState<"client" | "developer" | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [builderScore, setBuilderScore] = useState<bigint>(0n); // Initialize as 0

    useEffect(() => {
        if (address) {
            fetchBuilderScore(address);
        }
    }, [address]);

    const fetchBuilderScore = async (walletAddress: string) => {
        try {
            const response = await fetch(
                `https://api.talentprotocol.com/api/v2/passports/${walletAddress}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    setBuilderScore(0n);
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
                const result = await readContract(wagmiConfig, {
                    abi,
                    address: contractAddress,
                    functionName: "developers",
                    args: [address],
                    chainId: 11155111,
                });
                console.log(result);
                setName(result[1]);
                setBio(result[2]);
                setIsRegistered(result[4]);
            } else if (role === "client") {
                const result = await readContract(wagmiConfig, {
                    abi,
                    address: contractAddress,
                    functionName: "clients",
                    args: [address],
                    chainId: 11155111,
                });
                console.log(result);
                setIsRegistered(result[1]);
            }
            setRole(role);
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    };

    const registerDeveloper = async () => {
        try {
            const result = await writeContract(wagmiConfig, {
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
            const result = await writeContract(wagmiConfig, {
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

    if (isConnecting) return <div>Connecting…</div>;
    if (isDisconnected) return <div>Disconnected</div>;

    return (
        <div>
            <div>Connected Wallet Address: {address}</div>
            {role === null ? (
                <div>
                    <button onClick={() => checkRegistration("client")}>
                        Client Profile
                    </button>
                    <button onClick={() => checkRegistration("developer")}>
                        Developer Profile
                    </button>
                </div>
            ) : isRegistered ? (
                role === "developer" ? (
                    <div>
                        <h3>Developer Profile</h3>
                        <div>Name: {name}</div>
                        <div>Bio: {bio}</div>
                        <div>Builder Score: {builderScore.toString()}</div>
                        {/* Add more developer-specific information and functionality */}
                    </div>
                ) : (
                    <div>
                        <h3>Client Profile</h3>
                        {/* Add client-specific information and functionality */}
                    </div>
                )
            ) : (
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
            )}
        </div>
    );
};

export default WalletComponent;
