import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const SpringText = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const chars = text.split('');

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.2rem', // Reduced gap for individual chars
            maxWidth: '800px',
            marginTop: '30px',
            zIndex: 10,
        }}>
            {chars.map((char, i) => {
                // Stagger spring
                // Space counts as a char but doesn't show
                const delay = 30 + i * 2;

                const springVal = spring({
                    frame: frame - delay,
                    fps,
                    from: 0,
                    to: 1,
                    config: {
                        damping: 20,
                        stiffness: 80,
                        mass: 0.8
                    }
                });

                const opacity = Math.min(1, Math.max(0, (frame - delay) / 10));

                if (char === '\n') {
                    return <div key={i} style={{ width: '100%', height: 0 }} />;
                }

                return (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            transform: `scale(${springVal}) translateY(${(1 - springVal) * 20}px)`,
                            opacity: opacity,
                            fontSize: '2rem',
                            fontWeight: 600,
                            color: '#e2e8f0',
                            textShadow: '0 0 10px rgba(255,255,255, var(--pulse-intensity, 0.3))',
                            whiteSpace: 'pre', // Preserve spaces
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

export default SpringText;
