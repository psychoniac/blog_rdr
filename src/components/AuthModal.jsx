import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Lock, Mail, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            });
            if (error) setError(error.message);
            else {
                alert("Compte créé ! Vérifie tes emails si la confirmation est activée.");
                onClose();
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) setError(error.message);
            else {
                onClose();
            }
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-ny-card border-2 border-black shadow-[8px_8px_0px_0px_#facc15] w-full max-w-md p-6 relative">

                {/* Bouton Fermer */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="font-display text-3xl mb-1 text-ny-yellow">
                    {isSignUp ? 'Rejoindre le Block' : 'Connexion Membre'}
                </h2>
                <p className="text-xs text-ny-muted mb-6">Espace d'entraide & réduction des risques - NYC 90s</p>

                {error && (
                    <div className="bg-ny-red/20 border-2 border-ny-red text-ny-red p-3 text-xs mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Pseudo / Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-ny-muted" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ex: Skater90"
                                    className="w-full bg-ny-bg border-2 border-ny-border pl-10 pr-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-ny-muted" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ton.email@domain.com"
                                className="w-full bg-ny-bg border-2 border-ny-border pl-10 pr-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-ny-muted" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-ny-bg border-2 border-ny-border pl-10 pr-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ny-yellow text-black font-bold py-3 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase text-sm mt-2"
                    >
                        {loading ? 'Chargement...' : isSignUp ? "S'inscrire" : 'Se connecter'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-ny-muted hover:text-ny-yellow underline"
                    >
                        {isSignUp ? "Déjà un compte ? Connecte-toi" : "Pas de compte ? Inscris-toi ici"}
                    </button>
                </div>

            </div>
        </div>
    );
}