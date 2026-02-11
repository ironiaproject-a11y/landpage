"use client";

import { cn } from "@/lib/utils"; // Assuming utils exists, if not I will use a simple utility

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-white/[0.03]",
                className
            )}
            {...props}
        >
            {/* Base shimmer layer */}
            <div className="absolute inset-0 skeleton-shimmer opacity-40" />

            {/* High-end "Silver Sweep" overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                style={{ transform: 'skewX(-20deg)' }} />
        </div>
    );
}
