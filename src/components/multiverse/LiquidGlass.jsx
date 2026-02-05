import { motion } from 'framer-motion';

// SVG Filter ID must be unique
const FILTER_ID = "liquid-glass-turbulence";

const LiquidGlass = ({ children, intensity = 0.5 }) => {
    return (
        <div style={{ position: 'relative' }}>
            {/* The SVG Filter definition (Local) */}
            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
                <defs>
                    <filter id={FILTER_ID}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.02"
                            numOctaves="3"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={intensity * 10}
                        />
                    </filter>
                </defs>
            </svg>

            {/* Content Wrapper with Glass Effect */}
            <motion.div
                style={{
                    backdropFilter: `blur(${intensity * 5}px) brightness(1.1)`,
                    // Apply subtle turbulence only on interaction or steady state if desired
                    // filter: `url(#${FILTER_ID})`, 
                    // Note: Permanent URL filter can be expensive. 
                    // Let's use backdrop-filter primarily + border
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default LiquidGlass;
