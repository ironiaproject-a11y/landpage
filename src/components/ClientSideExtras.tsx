"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("@/components/Cursor").then(mod => mod.Cursor), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton").then(mod => mod.WhatsAppButton), {
    ssr: false,
});
const Preloader = dynamic(() => import("@/components/Preloader").then(mod => mod.Preloader), { ssr: false });

export function ClientSideExtras() {
    return (
        <>
            <Cursor />
            <Preloader />
            <WhatsAppButton />
        </>
    );
}
