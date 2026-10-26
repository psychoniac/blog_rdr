import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Send, User, Calendar, MessageSquare, Tag } from 'lucide-react';

export default function ArticleModal({ post, isOpen, onClose, user, onOpenAuth }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Charger les commentaires
    const fetchComments = async () => {
        if (!post) return;
        setLoadingComments(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
        *,
        profiles:author_id (username, avatar_url)
      `)
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

        if (!error) {
            setComments(data || []);
        }
        setLoadingComments(false);
    };

    useEffect(() => {
        if (isOpen && post) {
            fetchComments();

            // Écoute en temps réel des nouveaux commentaires sur cet article
            const channel = supabase
                .channel(`comments-post-${post.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'comments',
                        filter: `post_id=eq.${post.id}`,
                    },
                    async (payload) => {
                        // Récupérer le profil de l'auteur du nouveau commentaire
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('username, avatar_url')
                            .eq('id', payload.new.author_id)
                            .single();

                        const fullComment = {
                            ...payload.new,
                            profiles: profile
                        };

                        setComments((prev) => [...prev, fullComment]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [isOpen, post]);

    if (!isOpen || !post) return null;

    // Soumettre un commentaire
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmitting(true);
        const { error } = await supabase.from('comments').insert([
            {
                post_id: post.id,
                author_id: user.id,
                content: newComment.trim(),
            },
        ]);

        setSubmitting(false);

        if (error) {
            alert("Erreur lors de l'envoi du commentaire : " + error.message);
        } else {
            setNewComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-ny-card border-2 border-black shadow-[8px_8px_0px_0px_#facc15] w-full max-w-2xl my-8 p-6 relative max-h-[90vh] flex flex-col justify-between">

                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black text-ny-yellow hover:bg-ny-yellow hover:text-black p-1 border border-black transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto pr-2">
                    {/* Header de l'article */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-ny-yellow text-black font-bold text-xs px-2.5 py-1 border border-black uppercase flex items-center gap-1">
                            <Tag size={12} />
                            {post.category || 'Témoignage'}
                        </span>
                        <span className="text-xs text-ny-muted flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl text-white mb-3">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-2 pb-4 mb-6 border-b-2 border-ny-border text-xs text-ny-muted">
                        <User size={16} className="text-ny-red" />
                        <span className="font-bold text-white">{post.profiles?.username || 'Anonyme'}</span>
                    </div>

                    {/* Image de l'article (si présente) */}
                    {post.image_url && (
                        <div className="mb-6 border-2 border-black overflow-hidden shadow-brut-black">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-64 object-cover filter contrast-105 grayscale hover:grayscale-0 transition-all"
                            />
                        </div>
                    )}

                    {/* Contenu de l'article */}
                    <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans mb-8">
                        {post.content}
                    </div>

                    {/* Section Commentaires */}
                    <div className="pt-6 border-t-2 border-ny-border">
                        <h3 className="font-display text-2xl text-ny-yellow mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Commentaires ({comments.length})
                        </h3>

                        {/* Liste des commentaires */}
                        <div className="space-y-3 mb-6">
                            {loadingComments ? (
                                <p className="text-xs text-ny-muted animate-pulse">Chargement de la discussion...</p>
                            ) : comments.length === 0 ? (
                                <p className="text-xs text-ny-muted italic bg-ny-bg p-3 border border-ny-border">
                                    Aucun commentaire pour l'instant. Sois le premier à répondre !
                                </p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-ny-bg p-3 border border-ny-border text-xs">
                                        {/* Exemple dans la liste des commentaires de ArticleModal.jsx */}
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-ny-yellow flex items-center gap-2">
                                                {comment.profiles?.avatar_url ? (
                                                    <img src={comment.profiles.avatar_url} alt="" className="w-5 h-5 object-cover border border-black" />
                                                ) : (
                                                    <User size={12} />
                                                )}
                                                {comment.profiles?.username || 'Membre'}
                                            </span>
                                            <span className="text-[10px] text-ny-muted">
                                                {new Date(comment.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 font-sans">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Formulaire d'ajout de commentaire */}
                        {user ? (
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Exprime-toi / Donne ton avis..."
                                    className="flex-1 bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-xs focus:border-ny-yellow outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="bg-ny-yellow text-black font-bold px-4 py-2 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs uppercase flex items-center gap-1"
                                >
                                    <Send size={14} />
                                    {submitting ? '...' : 'Poster'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-ny-bg p-3 border border-ny-border text-center text-xs">
                                <p className="text-ny-muted mb-2">Connecte-toi pour participer à la discussion.</p>
                                <button
                                    onClick={onOpenAuth}
                                    className="bg-ny-red text-white font-bold px-3 py-1 text-xs border border-black uppercase"
                                >
                                    Se connecter
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}