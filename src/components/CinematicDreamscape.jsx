import { Player } from '@remotion/player';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
// import Starfield from './dreamscape/Starfield';
// import NebulaLayer from './dreamscape/NebulaLayer';
import FloatingIcon from './dreamscape/FloatingIcon';
import SpringText from './dreamscape/SpringText';
import { useRef, useState, useEffect } from 'react';

// The Inner Composition
const DreamscapeComposition = () => {
    const frame = useCurrentFrame();

    // 1. Global Zoom Intro
    // Scale 10 -> 1 over first 40 frames (approx 1.3s) using exponential-ish or simple interpolate
    // User requested "power function" like y = x^4, but interpolate with easing is easier to manage.
    const zoomProgress = Math.min(1, frame / 50); // Normalized 0-1 over 50 frames
    // Easing: easeOutExpo-ish
    // let's just use interpolate with extrapolation

    // We want Scale: 10 -> 1
    const globalScale = interpolate(frame, [0, 50], [10, 1], {
        extrapolateRight: 'clamp',
        easing: (t) => 1 - Math.pow(1 - t, 4), // EaseOutQuart
    });

    // Also fade from black?
    const globalOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

    // 2. Glow Sync
    // sin(frame / 20) -> 0.4 to 0.8
    const pulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.4, 0.8]);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'transparent',
                overflow: 'visible',
                // CSS Variable for Glow Sync (passed to children via inheritance if they use var(--pulse-intensity))
                '--pulse-intensity': pulse,
            }}
        >
            <AbsoluteFill
                style={{
                    transform: `scale(${globalScale})`,
                    transformOrigin: 'center center',
                    opacity: globalOpacity,
                }}
            >
                {/* Background handled by GlobalBackground */}

                {/* Layer 3: Main Content */}
                <AbsoluteFill
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        zIndex: 10
                    }}
                >
                    <FloatingIcon />

                    <SpringText text={"Custom soundscape for\nbetter sleep."} />

                    {/* Extra "Dreamscape" caption below */}
                    <div style={{ opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' }), marginTop: '20px', color: '#718096' }}>
                        * immersive audio experience
                    </div>
                </AbsoluteFill>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// Main Wrapped Component
const CinematicDreamscape = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Responsive Dimensions Step 1: Initialize
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Simple Audio Logic (reused)
    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
        }
    };

    return (
        <section style={{ width: '100%', height: '100vh', position: 'relative', background: 'transparent' }}>
            <Player
                component={DreamscapeComposition}
                durationInFrames={300} // 10 seconds
                fps={30}
                compositionWidth={dimensions.width}
                compositionHeight={dimensions.height}
                style={{ width: '100%', height: '100%' }}
                autoPlay={true}
                loop={true}
                controls={false} // Clean look
            />

            {/* Audio Toggle (Float bottom center) */}
            <button
                onClick={toggleAudio}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '30px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                }}
            >
                {isPlaying ? 'Pause Soundscape' : 'Start Experience'}
            </button>
            <audio ref={audioRef} src="/sample.mp3" loop />
        </section>
    );
};

export default CinematicDreamscape;
