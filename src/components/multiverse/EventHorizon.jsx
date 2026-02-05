import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const GravityLink = ({ href, children }) => {
    return (
        <motion.a
            href={href}
            style={{
                display: 'block',
                color: 'inherit',
                textDecoration: 'none',
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
            }}
            whileHover={{ scale: 1.1, skewX: -10, color: '#9f7aea' }}
        >
            {children}
        </motion.a>
    );
};

const EventHorizon = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Reversed Logic: Starts distorted (20deg), becomes clear (0deg) as you arrive
    const distortion = useTransform(scrollYProgress, [0.6, 1], [30, 0]);
    const scale = useTransform(scrollYProgress, [0.6, 1], [0.8, 1]); // Expand to full size
    const opacity = useTransform(scrollYProgress, [0.7, 1], [0.3, 1]); // Fade in

    // Warp Back Logic
    const warpBack = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            ref={containerRef}
            style={{
                position: 'relative',
                minHeight: '80vh', // Big footer
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 10
            }}
        >
            <motion.div
                style={{
                    textAlign: 'center',
                    skewX: distortion,
                    scale: scale,
                    opacity,
                    transformOrigin: 'bottom center'
                }}
            >
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '20px', mixBlendMode: 'exclusion' }}>Coming Soon</h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto', color: '#a0aec0' }}>
                        Where deep sleep meets infinite dreams.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <GravityLink href="#coming-soon">Join Waitlist</GravityLink>
                    {/* Removed extra links per request */}
                </div>

                {/* Warp Back Button */}
                <motion.button
                    onClick={warpBack}
                    style={{
                        marginTop: '60px',
                        padding: '20px 40px',
                        fontSize: '1.2rem',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '50%;', // Circle ish
                        cursor: 'pointer',
                        fontWeight: '900',
                        letterSpacing: '2px',
                    }}
                    whileHover={{ scale: 1.2, boxShadow: '0 0 50px white' }}
                    whileTap={{ scale: 0.9 }}
                >
                    WARP HOME
                </motion.button>
            </motion.div>

            {/* Black Hole Visual Helper */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw',
                    height: '50vh',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, transparent 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}
            />
        </footer>
    );
};

export default EventHorizon;
