"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import Connect from "./Connect";
import styles from "./Header.module.css";
import { useAccount, useDisconnect } from "wagmi";

const Header = () => {
    const { disconnect } = useDisconnect();
    const { chainId, address, isConnected, isDisconnected } = useAccount();

    const router = useRouter();

    const goToClientProfile = () => {
        router.push("/clientprofile");
    };

    const goToDeveloperProfile = () => {
        router.push("/devprofile");
    };

    const goToBrowse = () => {
        router.push("/browse");
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/">
                    <img
                        src="/DevChainBg.png"
                        alt="Logo"
                        className={styles.logo}
                    />
                </Link>
            </div>
            <nav>
                <ul className={styles.nav}>
                    <li className={styles.navItem}>
                        <button
                            className={styles.button}
                            onClick={goToClientProfile}
                        >
                            Client Profile
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button
                            className={styles.button}
                            onClick={goToDeveloperProfile}
                        >
                            Developer Profile
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button className={styles.button} onClick={goToBrowse}>
                            Browse
                        </button>
                    </li>
                </ul>
            </nav>
            {isConnected ? (
                <button className={styles.button} onClick={() => disconnect()}>
                    Disconnect
                </button>
            ) : (
                <p></p>
            )}
            <Connect />
        </header>
    );
};

export default Header;
