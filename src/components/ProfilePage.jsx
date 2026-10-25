import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import CreateArticleModal from './CreateArticleModal'; // <-- Import de la modale
import {
    User, PlusCircle, Edit3, FileText, Save, Trash2, ArrowLeft, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function ProfilePage({ user, onBack, onPostUpdated }) {
    const [profile, setProfile] = useState({ username: '', bio: '', avatar_url: '' });
    const [userPosts, setUserPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('my-posts'); // 'my-posts' | 'edit-profile'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // <-- État Modale

    // Édition profil
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) loadUserData();
    }, [user]);

    const loadUserData = async () => {
        // Récupérer le profil
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
            setUsername(profileData.username || '');
            setBio(profileData.bio || '');
            setAvatarPreview(profileData.avatar_url || '');
        }

        // Récupérer les articles (publiés et brouillons)
        const { data: postsData } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });

        if (postsData) setUserPosts(postsData);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setMessage(null);

        try {
            let uploadedAvatarUrl = profile.avatar_url;
            if (avatarFile) {
                uploadedAvatarUrl = await uploadImage(avatarFile, 'avatars');
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    username,
                    bio,
                    avatar_url: uploadedAvatarUrl,
                })
                .eq('id', user.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profil mis à jour !' });
            loadUserData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur : ' + err.message });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm("Voulez-vous supprimer cet article ?")) return;
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) {
            loadUserData();
            if (onPostUpdated) onPostUpdated();
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            {/* Bouton Retour */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-ny-card border-2 border-black px-4 py-2 text-xs font-bold uppercase text-ny-yellow shadow-brut-black mb-6 hover:-translate-x-0.5 transition-all"
            >
                <ArrowLeft size={16} /> Retour au Fil d'actualité
            </button>

            {/* En-tête Profil */}
            <div className="bg-ny-card border-2 border-black p-6 shadow-brut-yellow mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 border-2 border-black overflow-hidden bg-ny-bg flex items-center justify-center shadow-brut-black">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt={username} className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-ny-muted" />
                        )}
                    </div>

                    <div className="text-center sm:text-left">
                        <h1 className="font-display text-3xl uppercase tracking-wide text-white mb-1">
                            {profile.username || 'Membre'}
                        </h1>
                        <p className="text-xs text-ny-muted font-mono mb-2">{user?.email}</p>
                        <p className="text-sm text-gray-300 italic">{profile.bio || "Pas encore de bio rédigée..."}</p>
                    </div>
                </div>

                {/* --- BOUTON POUR OUVRIR LA MODALE DE CRÉATION --- */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-ny-yellow text-black font-bold px-5 py-3 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase"
                >
                    <PlusCircle size={20} /> Écrire un nouvel article
                </button>
            </div>

            {/* Notification feedback */}
            {message && (
                <div className={`p-4 border-2 border-black mb-6 flex items-center gap-3 text-xs font-bold ${message.type === 'success' ? 'bg-ny-green/20 text-ny-green border-ny-green' : 'bg-ny-red/20 text-ny-red border-ny-red'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Onglets */}
            <div className="flex border-b-2 border-black mb-6 gap-2">
                <button
                    onClick={() => setActiveTab('my-posts')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t-2 border-x-2 border-black transition-all ${activeTab === 'my-posts' ? 'bg-ny-yellow text-black -mb-0.5' : 'bg-ny-card text-ny-muted hover:text-white'
                        }`}
                >
                    <FileText size={16} /> Mes Articles ({userPosts.length})
                </button>
                <button
                    onClick={() => setActiveTab('edit-profile')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t-2 border-x-2 border-black transition-all ${activeTab === 'edit-profile' ? 'bg-ny-yellow text-black -mb-0.5' : 'bg-ny-card text-ny-muted hover:text-white'
                        }`}
                >
                    <User size={16} /> Modifier le Profil
                </button>
            </div>

            {/* ONGLET 1 : Liste des Articles */}
            {activeTab === 'my-posts' && (
                <div className="space-y-4">
                    {userPosts.length === 0 ? (
                        <div className="bg-ny-card border-2 border-dashed border-ny-border p-8 text-center text-xs text-ny-muted">
                            Tu n'as encore rédigé aucun article ni brouillon. Clique sur "Écrire un nouvel article" pour débuter !
                        </div>
                    ) : (
                        userPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-ny-card border-2 border-black p-4 shadow-brut-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    {post.image_url && (
                                        <img src={post.image_url} alt="" className="w-16 h-16 object-cover border border-black" />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 border border-black uppercase ${post.status === 'draft' ? 'bg-gray-600 text-white' : 'bg-ny-yellow text-black'
                                                }`}>
                                                {post.status === 'draft' ? 'Brouillon' : 'Publié'}
                                            </span>
                                            <span className="text-[10px] text-ny-muted">
                                                {new Date(post.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-xl text-white">{post.title}</h3>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="p-2 bg-ny-red/20 text-ny-red border border-ny-red hover:bg-ny-red hover:text-white transition-all text-xs font-bold"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ONGLET 2 : Édition du profil */}
            {activeTab === 'edit-profile' && (
                <form onSubmit={handleSaveProfile} className="bg-ny-card border-2 border-black p-6 shadow-brut-black space-y-4">
                    <h2 className="font-display text-2xl text-ny-yellow mb-4">Informations Personnelles</h2>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Photo de profil / Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setAvatarFile(file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="w-full text-xs text-ny-muted file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-xs file:font-bold file:bg-ny-yellow file:text-black hover:file:cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Pseudonyme</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Bio / Présentation</label>
                        <textarea
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Quelques mots sur toi..."
                            className="w-full bg-ny-bg border-2 border-ny-border p-3 text-white text-sm focus:border-ny-yellow outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="w-full bg-ny-yellow text-black font-bold py-3 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs uppercase flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={16} /> {savingProfile ? 'Enregistrement...' : 'Mettre à jour le profil'}
                    </button>
                </form>
            )}

            {/* MODALE DE CRÉATION D'ARTICLE */}
            <CreateArticleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                user={user}
                onPostCreated={() => {
                    loadUserData();
                    if (onPostUpdated) onPostUpdated();
                }}
            />

        </div>
    );
}