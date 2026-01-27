import { useEffect, useRef, useState, useCallback } from 'react'

const FRAME_COUNT = 80
const FRAME_PATH = '/assets/catanimation/ezgif-frame-'

// Lerp function for smooth interpolation
const lerp = (start, end, factor) => start + (end - start) * factor

// Preload images
const preloadImages = (onProgress) => {
    const images = []
    let loadedCount = 0

    return new Promise((resolve) => {
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image()
            const frameNum = String(i).padStart(3, '0')
            img.src = `${FRAME_PATH}${frameNum}.jpg`

            img.onload = () => {
                loadedCount++
                onProgress?.(loadedCount / FRAME_COUNT)
                if (loadedCount === FRAME_COUNT) {
                    resolve(images)
                }
            }

            img.onerror = () => {
                loadedCount++
                if (loadedCount === FRAME_COUNT) {
                    resolve(images)
                }
            }

            images.push(img)
        }
    })
}

export default function ScrollSequence({ onAnimationComplete }) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const imagesRef = useRef([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadProgress, setLoadProgress] = useState(0)
    const hasCompletedRef = useRef(false)

    // Scroll progress refs
    const targetProgressRef = useRef(0)  // Where scroll says we should be
    const currentProgressRef = useRef(0) // Smoothed current position
    const currentFrameRef = useRef(0)
    const rafIdRef = useRef(null)
    const isRunningRef = useRef(false)

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Draw a specific frame to the canvas
    const drawFrame = useCallback((frameIndex) => {
        const canvas = canvasRef.current
        const img = imagesRef.current[frameIndex]
        if (!canvas || !img || !img.complete) return

        const dpr = window.devicePixelRatio || 1
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        // Set canvas size if needed
        if (canvas.width !== windowWidth * dpr || canvas.height !== windowHeight * dpr) {
            canvas.width = windowWidth * dpr
            canvas.height = windowHeight * dpr
        }

        const ctx = canvas.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Calculate cover dimensions
        const imgAspect = img.naturalWidth / img.naturalHeight
        const windowAspect = windowWidth / windowHeight

        let drawWidth, drawHeight, offsetX, offsetY

        if (windowAspect > imgAspect) {
            drawWidth = windowWidth
            drawHeight = windowWidth / imgAspect
            offsetX = 0
            offsetY = (windowHeight - drawHeight) / 2
        } else {
            drawHeight = windowHeight
            drawWidth = windowHeight * imgAspect
            offsetX = (windowWidth - drawWidth) / 2
            offsetY = 0
        }

        ctx.clearRect(0, 0, windowWidth, windowHeight)
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }, [])

    // Animation loop with smoothing
    const animate = useCallback(() => {
        if (!isRunningRef.current) return

        // Smooth interpolation towards target progress
        // Lower factor = smoother but laggier, higher = more responsive but jittery
        const smoothingFactor = 0.15
        currentProgressRef.current = lerp(
            currentProgressRef.current,
            targetProgressRef.current,
            smoothingFactor
        )

        // Map smoothed progress to frame index
        const targetFrame = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.floor(currentProgressRef.current * FRAME_COUNT))
        )

        // Only redraw if frame changed
        if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame
            drawFrame(targetFrame)
        }

        // Check for completion (using target, not smoothed)
        if (targetProgressRef.current >= 0.95 && !hasCompletedRef.current) {
            hasCompletedRef.current = true
            onAnimationComplete?.()
        }

        // Continue animation loop
        rafIdRef.current = requestAnimationFrame(animate)
    }, [drawFrame, onAnimationComplete])

    // Preload all frames
    useEffect(() => {
        preloadImages(setLoadProgress).then((images) => {
            imagesRef.current = images
            setIsLoading(false)

            // Draw first frame and start animation loop
            setTimeout(() => {
                drawFrame(0)
                isRunningRef.current = true
                rafIdRef.current = requestAnimationFrame(animate)
            }, 50)
        })

        return () => {
            isRunningRef.current = false
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current)
            }
        }
    }, [drawFrame, animate])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            drawFrame(currentFrameRef.current)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [drawFrame])

    // Scroll handler - ONLY updates target progress
    useEffect(() => {
        if (prefersReducedMotion) return

        const handleScroll = () => {
            if (!containerRef.current) return

            const container = containerRef.current
            const rect = container.getBoundingClientRect()

            // Calculate normalized progress (0 to 1)
            const sectionHeight = container.offsetHeight
            const viewportHeight = window.innerHeight
            const scrollableDistance = sectionHeight - viewportHeight

            // How far we've scrolled into this section
            const scrolledIntoSection = -rect.top

            // Normalized progress from 0 to 1
            const progress = Math.max(0, Math.min(1, scrolledIntoSection / scrollableDistance))

            // Store target progress - animation loop will smoothly interpolate to this
            targetProgressRef.current = progress
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        // Initial calculation
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [prefersReducedMotion])

    // Reduced motion fallback
    if (prefersReducedMotion) {
        return (
            <section className="scroll-section" style={{ minHeight: '100vh' }}>
                <div className="scroll-container">
                    <img
                        src={`${FRAME_PATH}040.jpg`}
                        alt="SleepCat animation - static view"
                        style={{
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            </section>
        )
    }

    return (
        <section className="scroll-section" ref={containerRef}>
            <div className="scroll-container">
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <div style={{
                            width: '200px',
                            height: '4px',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${loadProgress * 100}%`,
                                height: '100%',
                                background: 'var(--color-highlight)',
                                transition: 'width 0.2s ease'
                            }} />
                        </div>
                        <span>Loading animation...</span>
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        style={{
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover'
                        }}
                        aria-label="Scroll animation"
                    />
                )}
            </div>
        </section>
    )
}
