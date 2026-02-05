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
            {text.split(/(\s+)/).map((word, wordIndex) => {
                // If it's a newline (explicit), break
                if (word.includes('\n')) {
                    return <div key={wordIndex} style={{ width: '100%', height: 0 }} />;
                }

                // If it's pure whitespace (space), render it but allow it to break if needed? 
                // Actually, logic: Words are blocks. Spaces are blocks.
                // We want: [Custom] [ ] [soundscape]

                // Calculate starting index for this word's characters to maintain animation continuity
                const previousCharsCount = text.split(/(\s+)/).slice(0, wordIndex).join('').length;

                return (
                    <div
                        key={wordIndex}
                        style={{
                            display: 'inline-flex', // Keep chars in word together
                            whiteSpace: 'pre-wrap', // Respect spaces
                        }}
                    >
                        {word.split('').map((char, charIndex) => {
                            const globalIndex = previousCharsCount + charIndex;
                            const delay = 30 + globalIndex * 2;

                            const springVal = spring({
                                frame: frame - delay,
                                fps,
                                from: 0,
                                to: 1,
                                config: { damping: 20, stiffness: 80, mass: 0.8 }
                            });

                            const opacity = Math.min(1, Math.max(0, (frame - delay) / 10));

                            return (
                                <span
                                    key={charIndex}
                                    style={{
                                        display: 'inline-block',
                                        transform: `scale(${springVal}) translateY(${(1 - springVal) * 20}px)`,
                                        opacity: opacity,
                                        fontSize: '2rem',
                                        fontWeight: 600,
                                        color: '#e2e8f0',
                                        textShadow: '0 0 10px rgba(255,255,255, var(--pulse-intensity, 0.3))',
                                    }}
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default SpringText;
