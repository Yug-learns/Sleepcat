import { useRef, useState } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, staticFile, spring } from 'remotion';
import icon from '../assets/icon.png';

// Main Remotion Composition
const HeroRevealComposition = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Eyelid panels using spring physics for organic movement
    const topPanelY = spring({
        frame,
        fps,
        from: 0,
        to: -100,
        config: {
            damping: 20,
            stiffness: 50,
            mass: 1,
        },
    });

    const bottomPanelY = spring({
        frame,
        fps,
        from: 0,
        to: 100,
        config: {
            damping: 20,
            stiffness: 50,
            mass: 1,
        },
    });

    // Pulsing glow effect - breathing rhythm (4 seconds / 120 frames)
    const glowCycle = (frame % 120) / 120; // Normalize to 0-1
    const glowOpacity = 0.3 + 0.3 * Math.sin(glowCycle * Math.PI * 2); // Oscillate between 0.3 and 0.6
    const glowScale = 1 + 0.15 * Math.sin(glowCycle * Math.PI * 2); // Gentle scale pulsing

    // Icon and content fade in
    const contentOpacity = interpolate(frame, [30, 60], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Staggered text animation
    const words = ['Custom', 'soundscape', 'for', 'better', 'sleep.'];

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Eyelid Panels */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                    transform: `translateY(${topPanelY}%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
            >
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    letterSpacing: '0.05em',
                }}>
                    Sleep
                </h1>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(0deg, #2a2a2a 0%, #1a1a1a 100%)',
                    transform: `translateY(${bottomPanelY}%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
            >
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    letterSpacing: '0.05em',
                }}>
                    Cat
                </h1>
            </div>

            {/* Revealed Content */}
            <AbsoluteFill style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: contentOpacity,
            }}>
                {/* Pulsing Glow Backdrop */}
                <div
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 66, 165, 0.4) 0%, transparent 70%)',
                        opacity: glowOpacity,
                        transform: `scale(${glowScale})`,
                        filter: 'blur(60px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Icon */}
                <img
                    src={icon}
                    alt="SleepCat Logo"
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'contain',
                        marginBottom: '30px',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                        zIndex: 2,
                    }}
                />

                {/* Staggered Text */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    maxWidth: '600px',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: '#a0aec0',
                }}>
                    {words.map((word, i) => {
                        const startFrame = 40 + i * 4;
                        const wordOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
                            extrapolateLeft: 'clamp',
                            extrapolateRight: 'clamp',
                        });
                        const wordY = interpolate(frame, [startFrame, startFrame + 10], [15, 0], {
                            extrapolateLeft: 'clamp',
                            extrapolateRight: 'clamp',
                        });
                        const wordBlur = interpolate(frame, [startFrame, startFrame + 10], [5, 0], {
                            extrapolateLeft: 'clamp',
                            extrapolateRight: 'clamp',
                        });

                        return (
                            <span
                                key={i}
                                style={{
                                    opacity: wordOpacity,
                                    transform: `translateY(${wordY}px)`,
                                    filter: `blur(${wordBlur}px)`,
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// Wrapper Component with Audio Controls
const HeroReveal = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.error("Playback failed:", error);
                });
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <section style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
        }}>
            {/* Remotion Player */}
            <Player
                component={HeroRevealComposition}
                durationInFrames={180} // 6 seconds at 30fps
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                autoPlay={true}
                loop={true}
                controls={false}
            />

            {/* Audio Controls Overlay */}
            <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                zIndex: 100,
            }}>
                <button
                    onClick={toggleAudio}
                    style={{
                        padding: '15px 30px',
                        backgroundColor: 'rgba(99, 66, 165, 0.8)',
                        border: 'none',
                        borderRadius: '50px',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(99, 66, 165, 1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(99, 66, 165, 0.8)'}
                >
                    <span style={{ fontSize: '20px' }}>{isPlaying ? '⏸' : '▶'}</span>
                    <span>{isPlaying ? 'Playing sample...' : 'Play sample sound'}</span>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#a0aec0' }}>
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: '100px',
                            cursor: 'pointer',
                        }}
                        aria-label="Volume"
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src="/sample.mp3"
                loop
                preload="none"
            />
        </section>
    );
};

export default HeroReveal;
