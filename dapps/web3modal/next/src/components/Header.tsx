"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
                <button onClick={() => disconnect()}>Disconnect</button>
            ) : (
                <p></p>
            )}
            <Connect />
        </header>
    );
};

export default Header;
