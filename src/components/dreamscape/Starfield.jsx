import { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { createNoise3D } from 'simplex-noise';

const Starfield = () => {
    const canvasRef = useRef(null);
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Initialize noise function only once usually, but inside component is fine if memoized.
    // Using a ref to store the noise function to avoid recreating it every render
    const noise3D = useRef(createNoise3D()).current;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Config
        const numStars = 300;
        const speed = 0.5; // Base drift speed

        // Draw stars
        // Using a seeded random logic or consistent logic based on index would be best for determinism
        // For Remotion, we generally want determinism. 
        // We'll generate stars on the fly based on a pseudo-random function of index

        const pseudoRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        ctx.fillStyle = '#ffffff';

        for (let i = 0; i < numStars; i++) {
            // Deterministic positions
            const xSeed = i * 12.34;
            const ySeed = i * 56.78;
            const zSeed = i * 90.12; // Z-depth

            let x = pseudoRandom(xSeed) * width;
            let y = pseudoRandom(ySeed) * height;
            const z = pseudoRandom(zSeed) * 2 + 0.5; // depth factor 0.5 - 2.5

            // Simplex noise for organic drift
            // time scales with frame
            const time = frame * 0.002;
            const noiseX = noise3D(i, 0, time) * 20;
            const noiseY = noise3D(0, i, time) * 20;

            // Apply parallax movement
            // We simulate camera moving right/down slightly or just stars moving left
            // Move stars slowly to the left based on depth

            // Endless scroll logic
            const driftX = (frame * speed * z) % width;
            x = (x - driftX + width) % width;

            // Add noise
            const finalX = x + noiseX;
            const finalY = y + noiseY;

            // Twinkle effect
            const alpha = 0.5 + 0.5 * Math.sin(frame * 0.1 + i);

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(finalX, finalY, Math.max(0.5, z * 0.8), 0, Math.PI * 2);
            ctx.fill();
        }
    }, [frame, width, height, noise3D]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default Starfield;
