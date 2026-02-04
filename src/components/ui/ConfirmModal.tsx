import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'danger'
}: ConfirmModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Container for centering */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm z-10"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                                {/* Header */}
                                <div className="p-6 pb-0 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "p-2 rounded-xl",
                                            variant === 'danger' && "bg-red-50 dark:bg-red-900/20 text-red-500",
                                            variant === 'warning' && "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
                                            variant === 'info' && "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
                                            variant === 'success' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                                        )}>
                                            {variant === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {message}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="p-6 pt-0 flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={clsx(
                                            "flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all transform active:scale-95",
                                            variant === 'danger' && "bg-red-500 hover:bg-red-600 shadow-red-500/20",
                                            variant === 'warning' && "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
                                            variant === 'info' && "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20",
                                            variant === 'success' && "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                        )}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
