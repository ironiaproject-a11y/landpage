"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("./Cursor").then(mod => mod.Cursor), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton").then(mod => mod.WhatsAppButton), { ssr: false });
const BackToTop = dynamic(() => import("./BackToTop").then(mod => mod.BackToTop), { ssr: false });
const SofiaChat = dynamic(() => import("./SofiaChat").then(mod => mod.SofiaChat), { ssr: false });

export default function ClientSideExtras() {
    return (
        <>
            <Cursor />
            <WhatsAppButton />
            <BackToTop />
            <SofiaChat />
        </>
    );
}
