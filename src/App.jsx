import { useState, useEffect, useRef } from 'react'
// import ScrollSequence from './components/ScrollSequence' // Temporarily disabled

const rotatingWords = [
    'Fall Asleep',
    'Better Rest',
    'Drift Off',
    'Help Yourself'
]

// FAQ Accordion Item Component
function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
                className="faq-question"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </div>
    )
}

function App() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [showMascot, setShowMascot] = useState(false)
    const [wordsInHeader, setWordsInHeader] = useState(false)
    const comingSoonRef = useRef(null)
    const faqRef = useRef(null)
    const heroRef = useRef(null)

    // Rotating text effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Detect when Coming Soon section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShowMascot(true)
                    }
                })
            },
            { threshold: 0.3 }
        )

        if (comingSoonRef.current) {
            observer.observe(comingSoonRef.current)
        }

        return () => observer.disconnect()
    }, [])

    // Detect when to move rotating words to header
    useEffect(() => {
        const handleScroll = () => {
            if (!faqRef.current || !heroRef.current) return

            const heroRect = heroRef.current.getBoundingClientRect()
            const faqRect = faqRef.current.getBoundingClientRect()

            // When hero section is mostly scrolled past OR approaching FAQ
            const heroScrolledPast = heroRect.bottom < 200
            const nearFaq = faqRect.top < window.innerHeight * 0.8

            if (heroScrolledPast || nearFaq) {
                setWordsInHeader(true)
            } else {
                setWordsInHeader(false)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Scroll-triggered animations for all elements
    useEffect(() => {
        const animateObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.1 }
        )

        const elements = document.querySelectorAll('.animate-on-scroll')
        elements.forEach((el) => animateObserver.observe(el))

        return () => animateObserver.disconnect()
    }, [])

    return (
        <>
            {/* Header with Logo */}
            <header className="header">
                <a href="https://sleepcat.app" className="logo-container" target="_blank" rel="noopener noreferrer">
                    <img
                        src="/assets/icon.png"
                        alt="SleepCat"
                        className="logo-image"
                    />
                    <span className="logo-text">SleepCat</span>
                </a>
                {/* Rotating words in header */}
                <div className={`header-rotating-words ${wordsInHeader ? 'visible' : ''}`}>
                    <span className="header-rotating-word" key={currentWordIndex}>
                        {rotatingWords[currentWordIndex]}
                    </span>
                </div>
            </header>

            {/* Section 1: Awareness Hero */}
            <section className="hero-section" id="awareness" ref={heroRef}>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text animate-on-scroll animate-from-left">
                            {/* Rotating words section - hides when moved to header */}
                            <div className={`rotating-text-container ${wordsInHeader ? 'hidden' : ''}`}>
                                <span className="rotating-word" key={currentWordIndex}>
                                    {rotatingWords[currentWordIndex]}
                                </span>
                            </div>
                            <p className={`hero-subtitle ${wordsInHeader ? 'hidden' : ''}`}>with SleepCat</p>

                            <div className="hero-body">
                                <div className="hero-section-block animate-on-scroll animate-from-bottom animate-delay-1">
                                    <h3>Why sleep feels hard</h3>
                                    <p>
                                        Insomnia often begins when the mind stays active after the body is tired.
                                        Modern life adds stress, artificial light, and constant stimulation.
                                    </p>
                                    <p>
                                        Healthy adults usually need 7–9 hours of sleep, but quality matters as much as time.
                                        Restless sleep prevents the brain from reaching deep, restorative stages.
                                    </p>
                                </div>

                                <div className="hero-section-block animate-on-scroll animate-from-bottom animate-delay-2">
                                    <h3>How sound can help</h3>
                                    <p>
                                        Sound gives the brain something steady and predictable to focus on.
                                        Gentle audio can reduce background noise, calm intrusive thoughts,
                                        and support the natural transition into sleep.
                                    </p>
                                </div>

                                <div className="hero-section-block animate-on-scroll animate-from-bottom animate-delay-3">
                                    <h3>What SleepCat does</h3>
                                    <p>
                                        SleepCat lets you choose sounds that match how you want to rest —
                                        whether you need silence, softness, or structure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hero-illustration animate-on-scroll animate-from-right animate-delay-2">
                            {/* Phone Mockups Container */}
                            <div className="mockups-container">
                                {/* iPhone Mockup */}
                                <div className="mock-app-card mock-iphone">
                                    <div className="mock-app-blur"></div>
                                    <div className="mock-app-content">
                                        <img
                                            src="/assets/icon.png"
                                            alt="SleepCat"
                                            className="mock-app-icon"
                                        />
                                        <div className="mock-app-sound">
                                            <span className="mock-app-label">Sound</span>
                                            <span className="mock-app-value">Soft Rain</span>
                                        </div>
                                        <div className="mock-app-timer">
                                            <span className="mock-app-label">Timer</span>
                                            <span className="mock-app-value">30 min</span>
                                        </div>
                                        <div className="mock-app-slider">
                                            <div className="mock-slider-track">
                                                <div className="mock-slider-fill"></div>
                                                <div className="mock-slider-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pixel Mockup */}
                                <div className="mock-app-card mock-pixel">
                                    <div className="mock-app-blur"></div>
                                    <div className="mock-app-content">
                                        <img
                                            src="/assets/icon.png"
                                            alt="SleepCat"
                                            className="mock-app-icon"
                                        />
                                        <div className="mock-app-sound">
                                            <span className="mock-app-label">Sound</span>
                                            <span className="mock-app-value">Ocean Waves</span>
                                        </div>
                                        <div className="mock-app-timer">
                                            <span className="mock-app-label">Timer</span>
                                            <span className="mock-app-value">45 min</span>
                                        </div>
                                        <div className="mock-app-slider">
                                            <div className="mock-slider-track">
                                                <div className="mock-slider-fill" style={{ width: '45%' }}></div>
                                                <div className="mock-slider-thumb" style={{ left: '45%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: FAQ */}
            <section className="faq-section" id="faq" ref={faqRef}>
                <div className="container">
                    <h2 className="faq-title animate-on-scroll animate-from-bottom">Frequently Asked Questions</h2>
                    <div className="faq-list animate-on-scroll animate-from-bottom animate-delay-2">
                        <FAQItem
                            question="What is SleepCat?"
                            answer="SleepCat is a sleep companion app designed to help you fall asleep faster and wake up feeling refreshed. It offers a curated collection of soothing sounds and ambient music tailored to your preferences."
                        />
                        <FAQItem
                            question="How does SleepCat help me sleep better?"
                            answer="SleepCat uses scientifically-backed audio techniques to calm your mind and reduce stress. Our sounds mask disruptive noise, provide a steady focus for your brain, and help ease the transition from wakefulness to sleep naturally."
                        />
                        <FAQItem
                            question="Is SleepCat free to use?"
                            answer="SleepCat offers a free tier with essential sounds and features. Premium subscribers get access to our full library, advanced customization options, and exclusive content updated regularly."
                        />
                        <FAQItem
                            question="Can I use SleepCat offline?"
                            answer="Yes! Once you download your favorite sounds, you can use them anytime without an internet connection. Perfect for travel, camping, or areas with limited connectivity."
                        />
                        <FAQItem
                            question="When will SleepCat be available?"
                            answer="We're working hard to bring SleepCat to you soon! Check our website regularly to be the first to know when we launch and get exclusive early access benefits."
                        />
                    </div>
                </div>
            </section>

            {/* Section 3: Scroll Animation - TEMPORARILY DISABLED
            <ScrollSequence onAnimationComplete={handleAnimationComplete} />
            */}

            {/* Section 4: Coming Soon */}
            <section className="coming-soon-section" id="coming-soon" ref={comingSoonRef}>
                <div className={`coming-soon-mascot ${showMascot ? 'visible' : ''}`}>
                    <img
                        src="/assets/icon.png"
                        alt="SleepCat mascot"
                    />
                </div>
                <h2 className="coming-soon-title">Coming Soon</h2>
                <p className="coming-soon-text">
                    SleepCat is preparing something special for you.
                    Stay tuned for the ultimate sleep companion.
                </p>
            </section>
        </>
    )
}

export default App
