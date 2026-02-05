import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame } from 'remotion'; // Added useCurrentFrame
import Starfield from './dreamscape/Starfield';
import NebulaLayer from './dreamscape/NebulaLayer';
import { useState, useEffect } from 'react';

// Wrapper to pass scroll prop to composition
const BackgroundComposition = ({ scrollY }) => {
    // Differential Drag Logic:
    // As scrollY increases, we "fly forward" (scale up)

    // Simple z-push simulation:
    // Scale: 1 + scrollY * 0.0005
    const scale = 1 + (scrollY || 0) * 0.0005;

    // Opacity fade as we get "too deep"
    // If scale > 2, start fading slightly
    const opacity = Math.max(0.2, 1 - (scrollY || 0) * 0.0002);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#000',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                opacity: opacity
            }}
        >
            <Starfield />
            <NebulaLayer />
        </AbsoluteFill>
    );
};

const GlobalBackground = () => {
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080
    });

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, backgroundColor: '#000' }}>
            <Player
                component={BackgroundComposition}
                inputProps={{ scrollY }} // Pass scroll state to Remotion
                durationInFrames={300}
                fps={30}
                compositionWidth={dimensions.width}
                compositionHeight={dimensions.height}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                autoPlay={true}
                loop={true}
                controls={false}
            />
        </div>
    );
};

export default GlobalBackground;
