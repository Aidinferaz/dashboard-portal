
import { useState, useEffect } from 'react';
import { useAdmin, SiteConfig as SiteConfigType, Banner } from '../../context/AdminContext';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Trash2, Plus, Image as ImageIcon, Save, Edit2, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const SiteConfig = () => {
    const { siteConfig, updateSiteConfig } = useAdmin();

    // Local state for "Draft" mode
    const [draftConfig, setDraftConfig] = useState<SiteConfigType>(siteConfig);
    const [isDirty, setIsDirty] = useState(false);

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [editingType, setEditingType] = useState<'hero' | 'popup'>('hero'); // Track what we are editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempBanner, setTempBanner] = useState<Banner>({
        id: '',
        title: '',
        subtitle: '',
        image: '',
        color: 'from-blue-600 to-indigo-600'
    });

    // Reset draft when global config changes
    useEffect(() => {
        setDraftConfig(siteConfig);
    }, []);

    const handleSaveAll = () => {
        updateSiteConfig(draftConfig);
        setIsDirty(false);
        alert("Perubahan berhasil disimpan!");
    };

    // --- Banner CRUD Helpers ---
    const resetTempBanner = () => {
        setTempBanner({
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            subtitle: '',
            image: '',
            color: 'from-blue-600 to-indigo-600'
        });
    }

    const handleAdd = (type: 'hero' | 'popup') => {
        resetTempBanner();
        setEditingType(type);
        setEditingId(null);
        setIsEditing(true);
    };

    const handleEdit = (banner: Banner, type: 'hero' | 'popup') => {
        setTempBanner(banner);
        setEditingType(type);
        setEditingId(banner.id);
        setIsEditing(true);
    };

    const handleDelete = (id: string, type: 'hero' | 'popup') => {
        if (confirm("Hapus item ini?")) {
            setDraftConfig(prev => {
                const listKey = type === 'hero' ? 'heroBanners' : 'popupBanners';
                const currentList = prev[listKey] || [];
                const newList = currentList.filter(b => b.id !== id);
                return { ...prev, [listKey]: newList };
            });
            setIsDirty(true);
        }
    };

    const saveTempBanner = () => {
        // Validation check? maybe just allow empty title

        setDraftConfig(prev => {
            const listKey = editingType === 'hero' ? 'heroBanners' : 'popupBanners';
            // Defensive coding: ensure array exists
            let newList = prev[listKey] ? [...prev[listKey]] : [];

            if (editingId) {
                // Edit existing
                const index = newList.findIndex(b => b.id === editingId);
                if (index !== -1) newList[index] = tempBanner;
            } else {
                // Add new
                newList.push(tempBanner);
            }
            return { ...prev, [listKey]: newList };
        });

        setIsDirty(true);
        setIsEditing(false);
    };

    // --- Popup General Updates ---
    const updatePopupConfig = (updates: Partial<SiteConfigType>) => {
        setDraftConfig(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    };

    const gradients = [
        "from-blue-600 to-indigo-600",
        "from-purple-600 to-pink-600",
        "from-orange-500 to-red-500",
        "from-emerald-500 to-teal-600",
        "from-slate-700 to-slate-900",
        "from-slate-800 to-slate-900", // Dark gray
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Konfigurasi Situs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Atur Hero Banner dan Popup Kampanye</p>
                </div>

                {isDirty && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSaveAll}
                        className="px-6 py-3 bg-primary hover:bg-teal-600 text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-bold transition-all"
                    >
                        <Save size={20} /> Simpan Perubahan
                    </motion.button>
                )}
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* --- HERO BANNER CONFIG --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hero Banner Slider</h2>
                        <button
                            onClick={() => handleAdd('hero')}
                            className="text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} /> Tambah
                        </button>
                    </div>

                    {/* Banner List */}
                    <div className="space-y-4">
                        {draftConfig?.heroBanners?.map((banner, index) => (
                            <div key={banner.id} className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex gap-4 items-center">
                                <div className={`w-20 h-14 rounded-lg bg-gradient-to-br ${banner.color} shrink-0 overflow-hidden`}>
                                    {banner.image && <img src={banner.image} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 dark:text-white truncate">{banner.title}</h4>
                                    <p className="text-xs text-slate-500 truncate">{banner.subtitle}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(banner, 'hero')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(banner.id, 'hero')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- POPUP CONFIG --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Popup Kampanye</h2>
                        <ToggleSwitch
                            isOn={draftConfig.popupActive}
                            onToggle={() => updatePopupConfig({ popupActive: !draftConfig.popupActive })}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Judul Jendela</label>
                            <input
                                type="text"
                                value={draftConfig.popupTitle || ''}
                                onChange={(e) => updatePopupConfig({ popupTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Valid Popup Banners List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Slide Pengumuman</label>
                                <button
                                    onClick={() => handleAdd('popup')}
                                    className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg font-medium transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} /> Tambah
                                </button>
                            </div>

                            <div className="space-y-3">
                                {draftConfig.popupBanners?.map((banner) => (
                                    <div key={banner.id} className="group relative bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex gap-4 items-center">
                                        <div className={`w-16 h-12 rounded-lg bg-gradient-to-br ${banner.color} shrink-0 overflow-hidden`}>
                                            {banner.image && <img src={banner.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{banner.title || "(Tanpa Judul)"}</h4>
                                            <p className="text-[10px] text-slate-500 truncate">{banner.subtitle}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(banner, 'popup')} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(banner.id, 'popup')} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!draftConfig.popupBanners || draftConfig.popupBanners.length === 0) && (
                                    <div className="py-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                        <ImageIcon size={24} className="mb-2 opacity-50" />
                                        <span className="text-sm text-center">Belum ada pengumuman.<br />Klik Tambah.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- UNIVERSAL EDIT MODAL --- */}
                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
                            >
                                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        {editingId ? 'Edit' : 'Tambah'} {editingType === 'hero' ? 'Hero Banner' : 'Popup Item'}
                                    </h3>
                                    <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={20} /></button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Judul</label>
                                        <input
                                            value={tempBanner.title}
                                            onChange={e => setTempBanner({ ...tempBanner, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masukan judul..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subjudul (Opsional)</label>
                                        <input
                                            value={tempBanner.subtitle}
                                            onChange={e => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masukan deskripsi singkat..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">URL Gambar</label>
                                        <input
                                            value={tempBanner.image}
                                            onChange={e => setTempBanner({ ...tempBanner, image: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Background Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {gradients.map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setTempBanner({ ...tempBanner, color: g })}
                                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-all ${tempBanner.color === g ? 'ring-primary scale-110' : 'ring-transparent hover:scale-105'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={saveTempBanner}
                                        className="px-6 py-2 bg-primary hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SiteConfig;
