import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Check for custom claim
                const idTokenResult = await currentUser.getIdTokenResult();
                if (idTokenResult.claims.admin) {
                    setUser(currentUser);
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050b18] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Autenticando Protocolos...</p>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900/50 border border-red-500/20 p-12 rounded-[2.5rem] text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Acceso Denegado</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Su cuenta no posee privilegios administrativos de nivel <span className="text-red-500 font-bold">MaxiOS</span>. Contacte al desarrollador del sistema.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        Volver al Login
                    </button>
                    {!user && (
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest pt-4">No se detectó una sesión activa</p>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
