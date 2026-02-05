import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

const NebulaLayer = () => {
    const frame = useCurrentFrame();

    // Pulse and drift
    const pulse1 = interpolate(Math.sin(frame / 60), [-1, 1], [0.4, 0.7]);
    const pulse2 = interpolate(Math.sin((frame + 100) / 70), [-1, 1], [0.3, 0.6]);

    return (
        <AbsoluteFill style={{ zIndex: 1 }}>
            {/* Purple Nebula - Top Left */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '60%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(99, 66, 165, 0.5) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    opacity: pulse1,
                    transform: `translate(${frame * 0.5}px, ${frame * 0.2}px)`,
                }}
            />

            {/* Blue Nebula - Bottom Right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '70%',
                    height: '70%',
                    background: 'radial-gradient(circle, rgba(45, 100, 150, 0.4) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    opacity: pulse2,
                    transform: `translate(${-frame * 0.3}px, ${-frame * 0.1}px)`,
                }}
            />

            {/* Drifting "Clouds" - White/Grey mist */}
            <div
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '20%',
                    width: '400px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    transform: `translateX(${frame * -0.5}px)`,
                }}
            />
        </AbsoluteFill>
    );
};

export default NebulaLayer;
