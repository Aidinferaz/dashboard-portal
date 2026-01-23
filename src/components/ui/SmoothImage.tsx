import { useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { Image as ImageIcon } from 'lucide-react';

interface SmoothImageProps extends HTMLMotionProps<"img"> {
    src: string;
    alt: string;
    className?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
}

const SmoothImage = ({ src, alt, className, objectFit = 'cover', ...props }: SmoothImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={clsx("relative overflow-hidden", className)}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center z-10"
                    >
                        <ImageIcon className="text-slate-400 opacity-50" size={24} />
                    </motion.div>
                )}
            </AnimatePresence>

            {!hasError ? (
                <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    className={clsx("w-full h-full", objectFit === 'contain' ? 'object-contain' : 'object-cover')}
                    {...props}
                />
            ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <span className="text-xs">Gagal memuat gambar</span>
                </div>
            )}
        </div>
    );
};

export default SmoothImage;
