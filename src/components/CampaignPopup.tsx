import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import SmoothImage from './ui/SmoothImage';

export default function CampaignPopup() {
    const { siteConfig } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dbBanners, setDbBanners] = useState<any[]>([]);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/popups');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Map DB format to expected format
                    const formatted = data.map((p: any) => ({
                        image: p.image_path.startsWith('http') ? p.image_path : `http://localhost:3000/${p.image_path}`,
                        title: '', // DB doesn't have title field for popups currently, or we can add it later
                        subtitle: ''
                    }));
                    setDbBanners(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch popups:", error);
            }
        };
        fetchPopups();
    }, []);

    const banners = dbBanners.length > 0 ? dbBanners : (siteConfig.popupBanners || []);
    const hasMultiple = banners.length > 1;

    // Preload next image logic
    useEffect(() => {
        if (!isOpen) return;
        const nextIndex = (currentSlide + 1) % banners.length;
        const nextImage = banners[nextIndex]?.image;
        if (nextImage) {
            const img = new Image();
            img.src = nextImage;
        }
        // Reset slide index if banners change
        useEffect(() => {
            if (currentSlide >= banners.length) {
                setCurrentSlide(0);
            }
        }, [banners.length]);

        const currentBanner = banners[currentSlide];

        // Safety check - if data is missing during render, show nothing or placeholder
        if (!currentBanner && isOpen) return null;

        return (
            <AnimatePresence>
                {isOpen && currentBanner && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closePopup}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        {/* Modal Content - Card Style */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="relative w-full max-w-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header with Title */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center w-full ml-6">
                                    {siteConfig.popupTitle || 'Pengumuman'}
                                </h3>
                                <button
                                    onClick={closePopup}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Image Carousel Section */}
                            <div className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full relative group"
                                    >
                                        {currentBanner.image ? (
                                            <SmoothImage
                                                src={currentBanner.image}
                                                alt={currentBanner.title || "Banner"}
                                                className="w-full h-full"
                                                objectFit="contain"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${currentBanner.color || 'from-slate-200 to-slate-300'} flex items-center justify-center p-8 text-center`}>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-white mb-2">{currentBanner.title}</h4>
                                                    <p className="text-white/90">{currentBanner.subtitle}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Optional Overlay Text for Images */}
                                        {currentBanner.image && (currentBanner.title || currentBanner.subtitle) && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <h4 className="font-bold text-lg">{currentBanner.title}</h4>
                                                <p className="text-sm text-slate-200">{currentBanner.subtitle}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                {hasMultiple && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-md backdrop-blur-sm transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-md backdrop-blur-sm transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Dots Indicator */}
                                {hasMultiple && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm">
                                        {banners.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlide(idx)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer with Buttons */}
                            <div className="p-6 pt-4 bg-white dark:bg-slate-800 flex flex-col gap-3">
                                <button
                                    onClick={closePopup}
                                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Saya Mengerti
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    }
