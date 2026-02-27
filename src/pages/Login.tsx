import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("¡Protocolo de Acceso Autorizado!");
            navigate('/');
        } catch (error: any) {
            let message = "Fallo al iniciar sesión. Revisa tus credenciales.";
            if (error.code === 'auth/user-not-found') message = "Usuario no registrado.";
            if (error.code === 'auth/wrong-password') message = "Contraseña incorrecta.";
            toast.error(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-4 selection:bg-blue-500/30">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse capitalize" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-md w-full space-y-12 relative z-10">
                {/* Brand Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/20 border border-blue-400/20 mb-6 group transition-transform hover:scale-105 duration-500">
                        <Shield className="w-12 h-12 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                            <span className="text-blue-500">Maxi</span>OS
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <span className="h-px w-8 bg-slate-800"></span>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Acceso Central</p>
                            <span className="h-px w-8 bg-slate-800"></span>
                        </div>
                        <p className="text-slate-600 text-sm italic mt-2">Protocolo Administrativo de Seguridad</p>
                    </div>
                </div>

                {/* Login Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-3xl relative group">
                    <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Credencial de Email</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 transition-colors group-focus-within/input:text-blue-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="wuise051@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clave de Acceso</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 transition-colors group-focus-within/input:text-blue-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xl"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-600/10 transition-all hover:shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Validando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Desbloquear Panel</span>
                                    <Activity className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Security Badge */}
                <div className="text-center pt-4">
                    <p className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Cifrado de Grado Institucional Activo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
