import { createContext, useContext, useState, ReactNode } from 'react';
import defaultBanner from '../assets/PosterCleanDesk.png';

// Types
export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    color?: string; // To keep the gradient aesthetic
}

export interface SiteConfig {
    heroBanners: Banner[];
    popupBanners: Banner[];
    popupTitle: string;
    popupActive: boolean;
}

export interface Document {
    id: string;
    title: string;
    type: 'SKD' | 'SOP';
    division: string;
    classification: 'Public' | 'Private';
    date: string;
    fileUrl: string; // Mock url
    isActive: boolean;
}

interface AdminContextType {
    siteConfig: SiteConfig;
    updateSiteConfig: (config: Partial<SiteConfig>) => void;
    documents: Document[];
    addDocument: (doc: Omit<Document, 'id' | 'date'>) => void;
    deleteDocument: (id: string) => void;
    toggleDocumentStatus: (id: string) => void;
}

// Default Config
const defaultSiteConfig: SiteConfig = {
    heroBanners: [
        {
            id: '1',
            title: "Net Zero Emissions 2060",
            subtitle: "Challenge yourself to take action for a cleaner future.",
            image: "https://picsum.photos/seed/business/1200/600",
            color: "from-blue-600 to-indigo-600"
        },
        {
            id: '2',
            title: "Digital Transformation",
            subtitle: "Embracing technology to drive efficiency.",
            image: "https://picsum.photos/seed/tech/1200/600",
            color: "from-purple-600 to-pink-600"
        },
        {
            id: '3',
            title: "Safety First",
            subtitle: "Prioritizing safety in every operation.",
            image: "https://picsum.photos/seed/safety/1200/600",
            color: "from-orange-500 to-red-500"
        }
    ],
    popupBanners: [
        {
            id: 'p1',
            title: "Perhatian",
            subtitle: "Harap perhatikan.",
            image: defaultBanner,
        }
    ],
    popupTitle: "Pengumuman",
    popupActive: true,
};

// Mock Initial Documents
const initialDocuments: Document[] = [
    { id: '1', title: 'Q1 Financial Report', type: 'SKD', division: 'Finance', classification: 'Private', date: '2024-03-01', fileUrl: '#', isActive: true },
    { id: '2', title: 'Employee Handbook 2024', type: 'SOP', division: 'HR', classification: 'Public', date: '2024-01-15', fileUrl: '#', isActive: true },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);

    const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
        setSiteConfig(prev => ({ ...prev, ...newConfig }));
    };

    const addDocument = (doc: Omit<Document, 'id' | 'date'>) => {
        const newDoc: Document = {
            ...doc,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0]
        };
        setDocuments(prev => [...prev, newDoc]);
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const toggleDocumentStatus = (id: string) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, isActive: !doc.isActive } : doc
        ));
    };

    return (
        <AdminContext.Provider value={{ siteConfig, updateSiteConfig, documents, addDocument, deleteDocument, toggleDocumentStatus }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
