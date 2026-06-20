import { useEffect, useState } from "react";

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;

            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const progress =
                docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setScrollProgress(progress);

            // Hero section ke baad show hoga
            setShowButton(scrollTop > 700);
        };

        window.addEventListener("scroll", updateScrollProgress);

        updateScrollProgress();

        return () =>
            window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset =
        circumference - (scrollProgress / 100) * circumference;

    // Hero section me hide
    if (!showButton) return null;

    return (
        <button
            onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-lg"
            aria-label="Scroll to top"
        >
            <svg
                className="absolute inset-0 -rotate-90"
                width="56"
                height="56"
            >
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="3"
                />

                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: "stroke-dashoffset 0.1s linear",
                    }}
                />
            </svg>

            <span className="text-base font-bold text-orange-500">
                ↑
            </span>
        </button>
    );
}