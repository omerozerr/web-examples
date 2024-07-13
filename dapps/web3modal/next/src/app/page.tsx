"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.textSection}>
                    <h1 className={styles.header}>Welcome to Threer</h1>
                    <p className={styles.paragraph}>
                        Welcome to Threer, the ultimate platform on Base for
                        connecting clients with top developers. Here, clients
                        can register, browse available job offerings, and hire
                        developers for their projects. Developers can create
                        profiles showcasing their skills, register their
                        services, and list job offerings. Clients can view
                        developer profiles, including builder scores and project
                        details, and track their purchased offerings. Both
                        clients and developers can update their profiles with
                        relevant information. Get started by connecting your
                        wallet and navigating through our intuitive interface to
                        explore and manage job offerings efficiently.
                    </p>
                </div>
                <div className={styles.logoSection}>
                    <img
                        src="/DevChainBg.png"
                        alt="Logo"
                        className={styles.logo}
                    />
                </div>
            </div>
        </div>
    );
}
