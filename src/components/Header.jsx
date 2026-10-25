import { PlusCircle, LogIn, LogOut, User } from 'lucide-react';

export default function Header({ user, onOpenAuth, onOpenCreate, onSignOut }) {
    return (
        <header className="border-b-2 border-ny-border bg-ny-card/80 backdrop-blur sticky top-0 z-40 px-4 py-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Logo / Titre */}
                <div className="flex items-center gap-3">
                    <div className="bg-ny-yellow text-black font-display font-bold text-2xl px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                        BLOCK PARTY
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-wider text-ny-muted uppercase">
                            RDR & Entraide Underground
                        </h1>
                        <p className="text-xs text-gray-400">New York City Style • 1990s Vibes</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 bg-ny-yellow text-black font-bold px-4 py-2 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase"
                            >
                                <PlusCircle size={18} /> Publier un article
                            </button>

                            <div className="flex items-center gap-2 bg-ny-border px-3 py-2 border-2 border-black text-xs">
                                <User size={16} className="text-ny-yellow" />
                                <span className="font-semibold text-white">{user.email.split('@')[0]}</span>
                                <button
                                    onClick={onSignOut}
                                    className="ml-2 text-ny-red hover:text-red-400 font-bold"
                                    title="Se déconnecter"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="flex items-center gap-2 bg-ny-red text-white font-bold px-4 py-2 border-2 border-black shadow-brut-red hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase"
                        >
                            <LogIn size={18} /> Connexion / Inscription
                        </button>
                    )}
                </div>
            </div>
        </header >
    )
}