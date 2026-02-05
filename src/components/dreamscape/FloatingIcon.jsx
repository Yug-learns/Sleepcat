import { spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import icon from '../../assets/icon.webp';

const FloatingIcon = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Intro Scale (handled partly by Global Zoom, but we can add a local pop)
    // Spring physics for a "pop" in
    const scale = spring({
        frame: frame - 10, // Slight delay
        fps,
        from: 0,
        to: 1,
        config: {
            damping: 15,
            stiffness: 100,
        }
    });

    // Hover effect
    const hoverY = Math.sin(frame / 30) * 10;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            transform: `translateY(${hoverY}px) scale(${scale})`,
        }}>
            <img
                src={icon}
                alt="SleepCat"
                width="180"
                height="180"
                style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255, var(--pulse-intensity, 0.5)))',
                }}
            />
        </div>
    );
};

export default FloatingIcon;
