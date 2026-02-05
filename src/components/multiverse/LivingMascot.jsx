import { useState, useEffect } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import sleepCatIcon from '../../assets/icon.png';

const LivingMascot = () => {
    // Scroll Physics
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Map velocity to "Energy" (0 to 1)
    const velocityFactor = useTransform(scrollVelocity, [-2000, 0, 2000], [1, 0, 1]);
    const smoothEnergy = useSpring(velocityFactor, { damping: 20, stiffness: 200 });

    // Breathing Logic (Idle)
    // We'll use CSS animation for the idle breath to save JS thread

    return (
        <motion.div
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 50,
                width: '80px',
                height: '80px',
                scale: useTransform(smoothEnergy, [0, 1], [1, 1.2]), // Scales up on fast scroll
            }}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        >
            <motion.div
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    // Glow intensifies with speed
                    boxShadow: useTransform(smoothEnergy,
                        [0, 1],
                        ['0 5px 15px rgba(0,0,0,0.3)', '0 0 30px rgba(99, 66, 165, 0.8)']
                    ),
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <motion.img
                    src={sleepCatIcon}
                    alt="SleepCat Companion"
                    style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                    // Shake on high energy
                    animate={{
                        y: [0, -3, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3, // Slow breathing default
                        ease: "easeInOut"
                    }}
                />

                {/* Waking Eye Effect overlay could go here */}
            </motion.div>
        </motion.div>
    );
};

export default LivingMascot;
