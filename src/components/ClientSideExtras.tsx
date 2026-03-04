"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("@/components/Cursor").then(mod => mod.Cursor), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton").then(mod => mod.WhatsAppButton), {
    ssr: false,
});

export function ClientSideExtras() {
    return (
        <>
            <Cursor />
            <WhatsAppButton />
        </>
    );
}
