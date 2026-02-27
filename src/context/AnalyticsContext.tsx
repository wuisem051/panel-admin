import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type EventType = 'visit' | 'view' | 'download' | 'redirect';

export interface AnalyticsLog {
    id: string;
    timestamp: number;
    type: EventType;
    path: string;
    itemId?: string;
    itemTitle?: string;
    geo: {
        ip: string;
        country: string;
        city: string;
        region: string;
    };
    device: {
        browser: string;
        os: string;
        platform: string;
        screen: string;
    };
}

interface AnalyticsContextType {
    logs: AnalyticsLog[];
    trackEvent: (type: EventType, metadata?: { itemId?: string; itemTitle?: string }) => void;
    clearLogs: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<AnalyticsLog[]>([]);
    const [sessionGeo, setSessionGeo] = useState<AnalyticsLog['geo'] | null>(null);

    // Fetch Geo Info once per session
    useEffect(() => {
        const fetchGeo = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setSessionGeo({
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    city: data.city || 'Unknown',
                    region: data.region || 'Unknown'
                });
            } catch (err) {
                console.error('Failed to fetch geo info', err);
                setSessionGeo({ ip: 'Hidden', country: 'Unknown', city: 'Unknown', region: 'Unknown' });
            }
        };
        fetchGeo();
    }, []);

    // Real-time listener for logs (limit to last 500 for performance in dashboard)
    useEffect(() => {
        const logsRef = collection(db, 'analytics_logs');
        const q = query(logsRef, orderBy('timestamp', 'desc'), limit(500));

        const unsub = onSnapshot(q, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as AnalyticsLog[];
            setLogs(logsData);
        });

        return unsub;
    }, []);

    const getDeviceInfo = () => {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";

        let os = "Unknown";
        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        else if (ua.includes("Mac OS")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";

        return {
            browser,
            os,
            platform: navigator.platform || 'Unknown',
            screen: `${window.screen.width}x${window.screen.height}`
        };
    };

    const trackEvent = React.useCallback(async (type: EventType, metadata?: { itemId?: string; itemTitle?: string }) => {
        // Use default geo if not yet fetched to avoid missing events
        const geoPayload = sessionGeo || { ip: 'Pending...', country: 'Pending...', city: 'Pending...', region: 'Pending...' };

        const newLogData = {
            timestamp: Date.now(),
            type,
            path: window.location.pathname,
            itemId: metadata?.itemId || null,
            itemTitle: metadata?.itemTitle || null,
            geo: geoPayload,
            device: getDeviceInfo()
        };

        try {
            await addDoc(collection(db, 'analytics_logs'), newLogData);
        } catch (err) {
            console.error('Failed to track event', err);
        }
    }, [sessionGeo]);

    const clearLogs = async () => {
        if (!confirm("This will clear all logs from the database. Continue?")) return;

        const logsRef = collection(db, 'analytics_logs');
        const snapshot = await getDocs(logsRef);

        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        alert("Analytics cleared!");
    };

    return (
        <AnalyticsContext.Provider value={{ logs, trackEvent, clearLogs }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) throw new Error('useAnalytics must be used within an AnalyticsProvider');
    return context;
};
