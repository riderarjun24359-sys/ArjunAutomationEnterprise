"use client";

import { useEffect } from "react";

export function TeluguDocumentLanguage() {
    useEffect(() => {
        document.documentElement.lang = "te";
        return () => {
            document.documentElement.lang = "en-IN";
        };
    }, []);
    return null;
}
