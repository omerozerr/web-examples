"use client";
import Connect from "@/components/Connect";
import styles from "./page.module.css";
import { useRouter } from "next/navigation"; // Update import to next/navigation
import React from "react";

export default function Home() {
    const router = useRouter();

    return (
        <div>
            <h1>Welcome to the Threer</h1>
        </div>
    );
}
