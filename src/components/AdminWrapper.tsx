import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

export const AdminWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdTokenResult();
                if (token.claims.admin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Verificando acceso...</p>
            </div>
        </div>
    );

    return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};
