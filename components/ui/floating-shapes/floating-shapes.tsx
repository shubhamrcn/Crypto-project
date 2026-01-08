"use client";

import { motion } from "framer-motion";

export const FloatingShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-[2000px]">

            {/* Floating Icosahedron-like shape (CSS 3D) */}
            <motion.div
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    y: [0, 20, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[20%] left-[15%] w-24 h-24 border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm"
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
                animate={{
                    rotateX: [360, 0],
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md"
            />

            {/* Decorative Grid Plane */}
            <motion.div
                initial={{ rotateX: 60, opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1 }}
                className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-[50vh] bg-[linear-gradient(to_right,#4a5568_1px,transparent_1px),linear-gradient(to_bottom,#4a5568_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(to_top,black,transparent)]"
                style={{ transform: "perspective(1000px) rotateX(60deg)" }}
            />
        </div>
    );
};
