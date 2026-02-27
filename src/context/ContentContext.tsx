import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_GAMES } from '../data/mockData';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Game {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    screenshots?: string[];
    rating: number;
    downloads: string;
    size: string;
    version: string;
    category: string;
    developer: string;
    requirements: string;
    releaseDate?: string;
    downloadUrl: string;
    sourceUrl?: string;
    seoTitle?: string;
    metaDescription?: string;
    focusKeywords?: string;
    createdAt: number;
}

export type AppItem = Omit<Game, 'category'> & { appCategory?: string };

interface ContentContextType {
    games: Game[];
    apps: AppItem[];
    addGame: (game: Game) => void;
    updateGame: (game: Game) => void;
    deleteGame: (id: string) => void;
    addApp: (app: AppItem) => void;
    updateApp: (app: AppItem) => void;
    deleteApp: (id: string) => void;
    isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [apps, setApps] = useState<AppItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Seeding logic and real-time listeners
        const initializeContent = async () => {
            try {
                const gamesRef = collection(db, 'games');
                const appsRef = collection(db, 'apps');

                const gamesSnap = await getDocs(gamesRef);
                const appsSnap = await getDocs(appsRef);

                // Seed if completely empty
                if (gamesSnap.empty && appsSnap.empty) {
                    console.log("Seeding initial data to Firestore...");

                    const initialGames = ALL_GAMES.filter(g => !['Social', 'Music'].includes(g.category));
                    const initialApps = ALL_GAMES.filter(g => ['Social', 'Music'].includes(g.category)).map(g => ({
                        ...g,
                        appCategory: g.category
                    }));

                    for (const g of initialGames) {
                        await setDoc(doc(db, 'games', g.id), { ...g, createdAt: Date.now() });
                    }
                    for (const a of initialApps) {
                        await setDoc(doc(db, 'apps', a.id), { ...a, createdAt: Date.now() });
                    }
                }

                // Real-time listeners
                const qGames = query(gamesRef, orderBy('createdAt', 'desc'));
                const unsubGames = onSnapshot(qGames,
                    (snapshot) => {
                        const gamesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Game[];
                        setGames(gamesData);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error("Firestore Games Listener Error:", error);
                        setIsLoading(false);
                    }
                );

                const qApps = query(appsRef, orderBy('createdAt', 'desc'));
                const unsubApps = onSnapshot(qApps,
                    (snapshot) => {
                        const appsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as AppItem[];
                        setApps(appsData);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error("Firestore Apps Listener Error:", error);
                        setIsLoading(false);
                    }
                );

                return () => {
                    unsubGames();
                    unsubApps();
                };
            } catch (error) {
                console.error("Firestore Initialization Error:", error);
                setIsLoading(false);
            }
        };

        initializeContent();
    }, []);

    const addGame = async (game: Game) => {
        const { id, ...data } = game;
        await setDoc(doc(db, 'games', id), data);
    };
    const updateGame = async (game: Game) => {
        const { id, ...data } = game;
        await updateDoc(doc(db, 'games', id), data);
    };
    const deleteGame = async (id: string) => {
        await deleteDoc(doc(db, 'games', id));
    };

    const addApp = async (app: AppItem) => {
        const { id, ...data } = app;
        await setDoc(doc(db, 'apps', id), data);
    };
    const updateApp = async (app: AppItem) => {
        const { id, ...data } = app;
        await updateDoc(doc(db, 'apps', id), data);
    };
    const deleteApp = async (id: string) => {
        await deleteDoc(doc(db, 'apps', id));
    };

    return (
        <ContentContext.Provider value={{
            games,
            apps,
            addGame,
            updateGame,
            deleteGame,
            addApp,
            updateApp,
            deleteApp,
            isLoading
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within a ContentProvider');
    return context;
};
