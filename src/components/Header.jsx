import { PlusCircle, LogIn, LogOut, User as UserIcon, ImageIcon } from 'lucide-react';
import Button from './Button';

export default function Header({ user, userProfile, onOpenAuth, onOpenCreate, onOpenProfile, onSignOut, onOpenGallery }) {
    console.log(user);
    return (
        <header className="border-b-2 border-ny-border bg-ny-card/90 backdrop-blur sticky top-0 z-40 px-4 py-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Logo / Titre 90s */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => window.location.reload()}
                >
                    <div className="bg-ny-yellow text-black font-display font-bold text-2xl px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-0.5 transition-transform">
                        BLOCK PARTY
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-wider text-ny-muted uppercase">RDR & Entraide Underground</h1>
                        <p className="text-xs text-gray-400">New York City Style • 1990s Vibes</p>
                    </div>
                </div>

                {/* Actions utilisateur */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Bouton Publier */}
                            <Button
                                variant="yellow"
                                size="sm"
                                onClick={onOpenCreate}
                            >
                                <PlusCircle size={16} /> Publier
                            </Button>

                            {/* Bloc Utilisateur avec Avatar & Pseudo */}
                            <div className="flex items-center gap-2.5 bg-ny-bg px-3 py-1.5 border-2 border-black text-xs">
                                <button
                                    onClick={onOpenProfile}
                                    className="flex items-center gap-2 font-semibold hover:text-ny-yellow transition-colors group"
                                    title="Accéder à mon profil"
                                >
                                    {/* Avatar de l'utilisateur */}
                                    <div className="w-6 h-6 border border-black overflow-hidden bg-ny-card flex items-center justify-center">
                                        {userProfile?.avatar_url ? (
                                            <img
                                                src={userProfile.avatar_url}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={14} className="text-ny-yellow" />
                                        )}
                                    </div>

                                    {/* Pseudo de l'utilisateur */}
                                    <span className="max-w-[120px] truncate font-bold text-ny-yellow">
                                        {userProfile?.username || user.email.split('@')[0]}
                                    </span>
                                </button>
                            </div>
                            <button
                                onClick={onOpenGallery}
                                className="flex items-center gap-1.5 text-xs text-ny-muted hover:text-ny-yellow font-bold uppercase transition-colors"
                                title="Ma Galerie Photo"
                            >
                                <ImageIcon size={16} />
                                <span className="hidden md:inline">Galerie</span>
                            </button>
                            {/* Bouton de Déconnexion */}
                            <Button
                                variant="red"
                                size="sm"
                                onClick={onSignOut}
                                title="Se déconnecter"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </Button>
                        </>
                    ) : (
                        /* Bouton Connexion */
                        <Button
                            variant="red"
                            size="sm"
                            onClick={onOpenAuth}
                        >
                            <LogIn size={16} /> Connexion / Inscription
                        </Button>
                    )}
                </div>

            </div>
        </header>
    );
}