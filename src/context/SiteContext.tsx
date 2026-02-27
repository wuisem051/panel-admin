import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AdPlacement = {
    id: string;
    name: string;
    type: 'zone' | 'script';
    value: string; // zoneId or script code
    width: number;
    height: number;
    active: boolean;
};

export type FooterPage = {
    slug: string;
    title: string;
    content: string;
};

type SiteSettings = {
    siteName: string;
    footerText: string;
    downloadTimer: number;
    adPlacements: Record<string, AdPlacement>;
    homeHero: {
        title: string;
        subtitle: string;
    };
    footerPages: FooterPage[];
    language: 'en' | 'es';
    headCode: string;
    footerCode: string;
};

type SiteContextType = SiteSettings & {
    updateSettings: (settings: Partial<SiteSettings>) => void;
    updateAdPlacement: (id: string, placement: Partial<AdPlacement>) => void;
    isLoading: boolean;
};

const DEFAULT_PLACEMENTS: Record<string, AdPlacement> = {
    'home_banner_1': { id: 'home_banner_1', name: 'Home Banner Top', type: 'zone', value: '', width: 728, height: 90, active: true },
    'home_banner_2': { id: 'home_banner_2', name: 'Home Banner Bottom', type: 'zone', value: '', width: 728, height: 90, active: true },
    'games_banner_1': { id: 'games_banner_1', name: 'Games List Banner', type: 'zone', value: '', width: 728, height: 90, active: true },
    'apps_banner_1': { id: 'apps_banner_1', name: 'Apps List Banner', type: 'zone', value: '', width: 728, height: 90, active: true },
    'game_detail_banner_1': { id: 'game_detail_banner_1', name: 'Game Detail Main', type: 'zone', value: '', width: 728, height: 90, active: true },
    'game_detail_sidebar_1': { id: 'game_detail_sidebar_1', name: 'Game Detail Sidebar 1', type: 'zone', value: '', width: 300, height: 250, active: true },
    'game_detail_sidebar_2': { id: 'game_detail_sidebar_2', name: 'Game Detail Sidebar 2', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_1': { id: 'download_step_1', name: 'Download Step 1', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_2': { id: 'download_step_2', name: 'Download Step 2', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_3': { id: 'download_step_3', name: 'Download Step 3', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_4': { id: 'download_step_4', name: 'Download Step 4', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_5': { id: 'download_step_5', name: 'Download Step 5', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_6': { id: 'download_step_6', name: 'Download Step 6 (Final)', type: 'zone', value: '', width: 300, height: 250, active: true },
    'native_ad_1': {
        id: 'native_ad_1',
        name: 'Native/Script Ad (Downloads & Details)',
        type: 'script',
        value: '<script async="async" data-cfasync="false" src="https://downyattainprojects.com/d3e9e872caab09be3b22c7c5d6a8c65f/invoke.js"></script><div id="container-d3e9e872caab09be3b22c7c5d6a8c65f"></div>',
        width: 300,
        height: 250,
        active: true
    },
    'native_banner_2': {
        id: 'native_banner_2',
        name: 'Native Banner 728x90',
        type: 'script',
        value: '<script type="text/javascript">atOptions = { "key" : "dde01996abb5c99ad56ff1640bd460dd", "format" : "iframe", "height" : 90, "width" : 728, "params" : {} };</script><script type="text/javascript" src="https://downyattainprojects.com/dde01996abb5c99ad56ff1640bd460dd/invoke.js"></script>',
        width: 728,
        height: 90,
        active: true
    },
};

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'APKVault',
    footerText: '© 2025 APKVault. All rights reserved.',
    downloadTimer: 15,
    adPlacements: DEFAULT_PLACEMENTS,
    homeHero: {
        title: 'Download Android Games & Apps',
        subtitle: 'Discover thousands of free Android games and apps. Safe, fast downloads with no registration required.'
    },
    footerPages: [
        { slug: 'privacy', title: 'Privacy Policy', content: '# Privacy Policy\n\nYour privacy is important to us...' },
        { slug: 'terms', title: 'Terms of Service', content: '# Terms of Service\n\nBy using our site, you agree to these terms...' },
        { slug: 'dmca', title: 'DMCA', content: '# DMCA Policy\n\nWe respect intellectual property rights...' },
        { slug: 'contact', title: 'Contact Us', content: '# Contact Us\n\nYou can reach us at contact@apkvault.com' }
    ],
    language: 'en',
    headCode: '',
    footerCode: ''
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const globalRef = doc(db, 'settings', 'global');

        const initializeSite = async () => {
            try {
                const docSnap = await getDoc(globalRef);
                if (!docSnap.exists()) {
                    console.log("Seeding initial site settings to Firestore...");
                    await setDoc(globalRef, DEFAULT_SETTINGS);
                }
            } catch (error) {
                console.error("Firestore Site Setup Error:", error);
                setIsLoading(false);
            }
        };

        initializeSite();

        const unsub = onSnapshot(globalRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data() as SiteSettings;
                    // Ensure new default placements logic remains
                    const mergedPlacements = { ...DEFAULT_PLACEMENTS, ...(data.adPlacements || {}) };
                    // Merge complete settings: Defaults + Fetched Data + Merged Placements
                    setSettings({ ...DEFAULT_SETTINGS, ...data, adPlacements: mergedPlacements });
                }
                setIsLoading(false);
            },
            (error) => {
                console.error("Firestore Site Listener Error:", error);
                setIsLoading(false);
            }
        );

        return unsub;
    }, []);

    const updateSettings = async (newSettings: Partial<SiteSettings>) => {
        const globalRef = doc(db, 'settings', 'global');
        await setDoc(globalRef, { ...settings, ...newSettings }, { merge: true });
    };

    const updateAdPlacement = async (id: string, placement: Partial<AdPlacement>) => {
        const updatedPlacements = {
            ...settings.adPlacements,
            [id]: { ...settings.adPlacements[id], ...placement }
        };
        const globalRef = doc(db, 'settings', 'global');
        await updateDoc(globalRef, { adPlacements: updatedPlacements });
    };

    return (
        <SiteContext.Provider value={{ ...settings, updateSettings, updateAdPlacement, isLoading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within a SiteProvider');
    }
    return context;
};
