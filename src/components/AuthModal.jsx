import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { generateRandomUsername, PRESET_AVATARS } from '../lib/avatarUtils';
import Button from './Button';
import { X, Lock, Mail, User, Dices, Upload } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Champs Profil
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');

    // Avatar
    const [avatarMode, setAvatarMode] = useState('preset'); // 'preset' | 'file'
    const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleGenerateRandom = () => {
        setUsername(generateRandomUsername());
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setAvatarMode('file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            try {
                const finalUsername = username.trim() || generateRandomUsername();
                let finalAvatarUrl = selectedAvatar;

                // Si l'utilisateur a choisi d'uploader son propre fichier
                if (avatarMode === 'file' && avatarFile) {
                    finalAvatarUrl = await uploadImage(avatarFile, 'avatars');
                }

                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: finalUsername,
                            avatar_url: finalAvatarUrl,
                            bio: bio.trim(),
                            hobbies: hobbies.trim(),
                            gender,
                            age: age ? parseInt(age, 10) : null,
                        }
                    }
                });

                if (signUpError) throw signUpError;

                alert(`Bienvenue ${finalUsername} ! Ton compte a été créé avec succès.`);
                onClose();
            } catch (err) {
                setError(err.message);
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) setError(signInError.message);
            else onClose();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-ny-card border-2 border-black shadow-[8px_8px_0px_0px_#facc15] w-full max-w-lg p-6 relative my-8 max-h-[90vh] flex flex-col justify-between">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-ny-yellow">
                    <X size={24} />
                </button>

                <div className="overflow-y-auto pr-1">
                    <h2 className="font-display text-3xl mb-1 text-ny-yellow uppercase">
                        {isSignUp ? 'Rejoindre le Block' : 'Connexion Membre'}
                    </h2>
                    <p className="text-xs text-ny-muted mb-6">Espace d'entraide & RDR — Style NYC 90s</p>

                    {error && (
                        <div className="bg-ny-red/20 border-2 border-ny-red text-ny-red p-3 text-xs mb-4 font-bold">
                            {error}
                        </div>
                    )}

                    <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">

                        {isSignUp && (
                            <>
                                {/* Pseudonyme */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-bold uppercase">Pseudonyme</label>
                                        <button
                                            type="button"
                                            onClick={handleGenerateRandom}
                                            className="text-[10px] text-ny-yellow hover:underline flex items-center gap-1 font-bold uppercase"
                                        >
                                            <Dices size={12} /> Pseudo Aléatoire
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-ny-muted" size={18} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Laisse vide pour pseudo auto..."
                                            className="w-full bg-ny-bg border-2 border-ny-border pl-10 pr-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Choix d'Avatar (Preset vs Upload) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Choisis ton Avatar</label>

                                    {/* Onglets Avatar */}
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setAvatarMode('preset')}
                                            className={`text-[10px] px-3 py-1 font-bold border uppercase ${avatarMode === 'preset' ? 'bg-ny-yellow text-black border-black' : 'bg-ny-bg text-ny-muted border-ny-border'
                                                }`}
                                        >
                                            Galerie DiceBear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAvatarMode('file')}
                                            className={`text-[10px] px-3 py-1 font-bold border uppercase flex items-center gap-1 ${avatarMode === 'file' ? 'bg-ny-yellow text-black border-black' : 'bg-ny-bg text-ny-muted border-ny-border'
                                                }`}
                                        >
                                            <Upload size={10} /> Mon Fichier Perso
                                        </button>
                                    </div>

                                    {avatarMode === 'preset' ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {PRESET_AVATARS.map((avatarUrl, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedAvatar(avatarUrl);
                                                        setAvatarMode('preset');
                                                    }}
                                                    className={`relative w-12 h-12 border-2 bg-ny-bg p-1 overflow-hidden transition-all ${selectedAvatar === avatarUrl && avatarMode === 'preset'
                                                        ? 'border-ny-yellow shadow-[2px_2px_0px_0px_#facc15]'
                                                        : 'border-ny-border opacity-60 hover:opacity-100'
                                                        }`}
                                                >
                                                    <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full text-xs text-ny-muted file:mr-4 file:py-2 file:px-4 file:border file:border-black file:text-xs file:font-bold file:bg-ny-yellow file:text-black hover:file:cursor-pointer"
                                            />
                                            {avatarPreview && (
                                                <div className="mt-2 w-16 h-16 border-2 border-black overflow-hidden bg-ny-bg">
                                                    <img src={avatarPreview} alt="Aperçu" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bio (Facultatif) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Bio (Optionnel)</label>
                                    <textarea
                                        rows={2}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Quelques mots pour te présenter..."
                                        className="w-full bg-ny-bg border-2 border-ny-border p-2 text-white text-xs focus:border-ny-yellow outline-none resize-none"
                                    />
                                </div>

                                {/* Hobbies (Facultatif) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Hobbies / Passions (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={hobbies}
                                        onChange={(e) => setHobbies(e.target.value)}
                                        placeholder="ex: Graff, Musique 90s, Skate..."
                                        className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-xs focus:border-ny-yellow outline-none"
                                    />
                                </div>

                                {/* Genre & Âge (Facultatif) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Genre (Optionnel)</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full bg-ny-bg border-2 border-ny-border px-2 py-2 text-white text-xs focus:border-ny-yellow outline-none"
                                        >
                                            <option value="">Non spécifié</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                            <option value="Non-binaire">Non-binaire</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Âge (Optionnel)</label>
                                        <input
                                            type="number"
                                            min="12"
                                            max="120"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="ex: 28"
                                            className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-xs focus:border-ny-yellow outline-none"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Identifiants Connexion */}
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
                    </form>
                </div>

                <div className="pt-4 border-t border-ny-border mt-4">
                    <Button
                        form="auth-form"
                        type="submit"
                        variant="yellow"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Chargement...' : isSignUp ? "Créer mon Compte" : 'Se connecter'}
                    </Button>

                    <div className="mt-3 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-ny-muted hover:text-ny-yellow underline"
                        >
                            {isSignUp ? "Déjà membre ? Connecte-toi" : "Pas encore de compte ? Inscris-toi ici"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}