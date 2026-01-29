import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import icon from '../assets/icon.png';

gsap.registerPlugin(ScrollTrigger);

const HeroReveal = () => {
    const componentRef = useRef(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        const component = componentRef.current;
        if (!component) return;

        const splitItems = component.querySelectorAll('.hero-reveal__split-item');
        const contentNode = component.querySelector('.hero-reveal__content-inner');

        // Initial states
        gsap.set(splitItems[0], { x: '0%' });
        gsap.set(splitItems[1], { x: '0%' });
        gsap.set(contentNode, { opacity: 0, y: 50 });


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: component,
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // Split Animation
        tl.to(splitItems[0], {
            x: '-100%',
            ease: "power2.inOut",
            duration: 1
        }, 0);

        tl.to(splitItems[1], {
            x: '100%',
            ease: "power2.inOut",
            duration: 1
        }, 0);

        // Content Reveal
        tl.to(contentNode, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.8
        }, 0.2);

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

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
                    setHasInteracted(true);
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
        <section className="hero-reveal" ref={componentRef}>
            {/* PINNED HEADER (Curtains) */}
            <header className="hero-reveal__header">
                <div className="hero-reveal__split">
                    {/* LEFT CURTAIN */}
                    <div className="hero-reveal__split-item left">
                        <div className="split-content">
                            <h1 className="hero-reveal-title">Sleep</h1>
                        </div>
                    </div>

                    {/* RIGHT CURTAIN */}
                    <div className="hero-reveal__split-item right">
                        <div className="split-content">
                            <h1 className="hero-reveal-title">Cat</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* REVEALED CONTENT */}
            <div className="hero-reveal__content">
                <div className="hero-reveal__content-inner">
                    <img src={icon} alt="SleepCat Logo" className="hero-reveal-logo" />
                    <h2 className="reveal-headline">Custom soundscape for better sleep.</h2>

                    <div className="audio-controls-wrapper">
                        <button
                            className={`play-button ${isPlaying ? 'playing' : ''}`}
                            onClick={toggleAudio}
                            aria-label={isPlaying ? "Pause sample" : "Play sample"}
                        >
                            <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
                            <span className="play-label">{isPlaying ? 'Playing sample...' : 'Play sample sound'}</span>
                        </button>

                        <div className="volume-control-container">
                            {/* Simple Volume Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="volume-icon">
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
                                className="volume-slider"
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
                </div>
            </div>
        </section>
    );
};

export default HeroReveal;
