"use client";

import { Skeleton } from "./Skeleton";
import { m } from "framer-motion";

export function ServicesSkeleton() {
    return (
        <m.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-32 bg-[var(--color-deep-black)]"
        >
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mb-24">
                    <Skeleton className="h-4 w-32 mb-6" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-16 w-3/4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[450px] rounded-3xl" />
                    ))}
                </div>
            </div>
        </m.section>
    );
}

export function CaseStudiesSkeleton() {
    return (
        <m.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="py-40 bg-[var(--color-background)]"
        >
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-32">
                    <Skeleton className="h-4 w-40 mb-8" />
                    <Skeleton className="h-24 w-full mb-4" />
                    <Skeleton className="h-24 w-2/3 mb-8" />
                    <Skeleton className="h-20 w-xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-[600px] rounded-organic-lg" />
                    ))}
                </div>
            </div>
        </m.section>
    );
}

export function TestimonialsSkeleton() {
    return (
        <m.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="py-32 bg-[var(--color-deep-black)]"
        >
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <Skeleton className="h-4 w-48 mx-auto mb-4" />
                    <Skeleton className="h-12 w-full mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-[400px] rounded-2xl" />
                    ))}
                </div>
            </div>
        </m.section>
    );
}

