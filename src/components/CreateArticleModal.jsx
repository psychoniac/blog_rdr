import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { X, Save, Send, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function CreateArticleModal({ isOpen, onClose, user, onPostCreated }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Témoignage');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Gestion de la sélection d'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Soumission (brouillon ou publication)
    const handleSubmit = async (statusToSet) => {
        if (!title.trim() || !content.trim()) {
            setError("Le titre et le contenu sont obligatoires.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, 'posts');
            }

            const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

            const { error: insertError } = await supabase.from('posts').insert([
                {
                    title,
                    slug,
                    content,
                    category,
                    image_url: imageUrl,
                    status: statusToSet, // 'draft' ou 'published'
                    author_id: user.id,   // Lié à l'utilisateur connecté
                },
            ]);

            if (insertError) throw insertError;

            // Réinitialisation du formulaire
            setTitle('');
            setContent('');
            setCategory('Témoignage');
            setImageFile(null);
            setImagePreview('');

            onPostCreated(); // Rafraîchit la liste des articles
            onClose();       // Ferme la modale
        } catch (err) {
            setError("Erreur lors de la création : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-ny-card border-2 border-black shadow-[8px_8px_0px_0px_#facc15] w-full max-w-2xl p-6 relative my-8 max-h-[90vh] flex flex-col justify-between">

                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-ny-yellow transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="overflow-y-auto pr-1">
                    {/* Header Modale 90s */}
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={20} className="text-ny-yellow" />
                        <h2 className="font-display text-3xl uppercase text-white">Créer un Nouvel Article</h2>
                    </div>
                    <p className="text-xs text-ny-muted mb-6">
                        Rédige ton texte, ajoute une illustration et choisis d'enregistrer en brouillon ou d'exposer ton post.
                    </p>

                    {error && (
                        <div className="bg-ny-red/20 border-2 border-ny-red text-ny-red p-3 text-xs mb-4 font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Titre */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Titre de l'article</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ex: Mon expérience avec..."
                                className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                            />
                        </div>

                        {/* Catégorie */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Catégorie</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-yellow outline-none"
                            >
                                <option value="Témoignage">Témoignage</option>
                                <option value="Réduction des Risques">Réduction des Risques</option>
                                <option value="Entraide & Soutien">Entraide & Soutien</option>
                                <option value="Culture & Underground">Culture & Underground</option>
                            </select>
                        </div>

                        {/* Sélection Image */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Image / Photo d'illustration</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-xs text-ny-muted file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-xs file:font-bold file:bg-ny-yellow file:text-black hover:file:cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Prévisualisation Image */}
                        {imagePreview && (
                            <div className="relative w-full h-44 border-2 border-black overflow-hidden shadow-brut-black my-2">
                                <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Contenu */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Contenu de l'article</label>
                            <textarea
                                required
                                rows={7}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Rédige ton article ici..."
                                className="w-full bg-ny-bg border-2 border-ny-border p-3 text-white text-sm focus:border-ny-yellow outline-none resize-none font-sans"
                            />
                        </div>
                    </div>
                </div>

                {/* Boutons d'actions du bas */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t-2 border-ny-border">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSubmit('draft')}
                        className="flex-1 bg-ny-card border-2 border-black text-white font-bold py-3 shadow-brut-black hover:bg-ny-border transition-all text-xs uppercase flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Enregistrer comme brouillon
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSubmit('published')}
                        className="flex-1 bg-ny-yellow text-black font-bold py-3 border-2 border-black shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs uppercase flex items-center justify-center gap-2"
                    >
                        <Send size={16} /> {loading ? 'Envoi...' : "Publier l'article"}
                    </button>
                </div>

            </div>
        </div>
    );
}