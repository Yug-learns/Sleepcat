import { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import LiquidGlass from './LiquidGlass';

const MagneticSection = ({ children, intensity = 0.5 }) => {
    // Magnetic Logic
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for snapping back
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance from center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Magnetic pull (limit movement range)
        x.set(distanceX * 0.1); // 10% movement
        y.set(distanceY * 0.1);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: springX,
                y: springY,
                touchAction: 'none'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <LiquidGlass intensity={intensity}>
                {children}
            </LiquidGlass>
        </motion.div>
    );
};

export default MagneticSection;
