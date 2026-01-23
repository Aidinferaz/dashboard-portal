import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SmoothImage from './ui/SmoothImage';

import { useAdmin } from '../context/AdminContext';

const FeatureCarousel = () => {
    const { siteConfig } = useAdmin();
    const [current, setCurrent] = useState(0);

    const slides = siteConfig.heroBanners.length > 0 ? siteConfig.heroBanners : [
        // Fallback if empty
        {
            id: 'fallback-1',
            title: "Welcome to Dashboard",
            subtitle: "Configure your banners in Site Config",
            color: "from-slate-700 to-slate-900",
            image: ""
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Preload images for smoother transitions
    useEffect(() => {
        const nextIndex = (current + 1) % slides.length;
        const nextImage = slides[nextIndex]?.image;
        if (nextImage) {
            const img = new Image();
            img.src = nextImage;
        }
    }, [current, slides]);

    return (
        <div className="relative w-full h-64 md:h-80 perspective-1000">
            <div className="absolute inset-0">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${slides[current].color} relative`}
                    >
                        {/* Background Image if available */}
                        {slides[current].image && (
                            <div className="absolute inset-0 z-0">
                                {/* Use SmoothImage for better loading UX */}
                                <SmoothImage
                                    src={slides[current].image!}
                                    alt={slides[current].title}
                                    className="w-full h-full opacity-40 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        )}

                        {/* Abstract Shapes overlay */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 z-0"></div>

                        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white z-10">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
                            >
                                {slides[current].title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg opacity-90 text-blue-50 max-w-2xl"
                            >
                                {slides[current].subtitle}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-8 flex gap-3 z-20">
                <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default FeatureCarousel;
