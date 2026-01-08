"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStarProps {
    minDelay?: number;
    maxDelay?: number;
    starColor?: string;
    trailColor?: string;
    starWidth?: number;
    starHeight?: number;
    className?: string;
}

export const ShootingStars = ({
    minDelay = 1000,
    maxDelay = 4000,
    starColor = "#9E00FF",
    trailColor = "#2EB9DF",
    starWidth = 10,
    starHeight = 1,
    className,
}: ShootingStarProps) => {
    const [star, setStar] = useState<{
        x: number;
        y: number;
        angle: number;
        scale: number;
        speed: number;
        distance: number;
    } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const createStar = () => {
            const { innerWidth, innerHeight } = window;
            const x = Math.random() * innerWidth;
            const y = Math.random() * innerHeight;
            const angle = 45; // Fixed angle for consistent diagonal movement
            const scale = 0.5 + Math.random();
            const speed = Math.random() * 20 + 10;
            const distance = 0;

            setStar({ x, y, angle, scale, speed, distance });

            const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
            setTimeout(createStar, randomDelay);
        };

        createStar();
    }, [minDelay, maxDelay]);

    useEffect(() => {
        const moveStar = () => {
            if (star) {
                setStar((prevStar) => {
                    if (!prevStar) return null;
                    const newX = prevStar.x + prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
                    const newY = prevStar.y + prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
                    const newDistance = prevStar.distance + prevStar.speed;
                    const scale = prevStar.scale;

                    if (newX < -20 || newX > window.innerWidth + 20 || newY < -20 || newY > window.innerHeight + 20) {
                        return null;
                    }
                    return { ...prevStar, x: newX, y: newY, distance: newDistance, scale };
                });
            }
            requestAnimationFrame(moveStar);
        };

        const animationId = requestAnimationFrame(moveStar);
        return () => cancelAnimationFrame(animationId);
    }, [star]);

    return (
        <svg
            ref={svgRef}
            className={cn("w-full h-full absolute inset-0 z-0 pointer-events-none", className)}
        >
            {star && (
                <rect
                    key={star.distance} // Force re-render
                    x={star.x}
                    y={star.y}
                    width={starWidth * star.scale}
                    height={starHeight}
                    fill="url(#gradient)"
                    transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
                />
            )}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
                    <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    );
};
