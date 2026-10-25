import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Send } from 'lucide-react';

export default function CreateModal({ isOpen, onClose, user, onPostCreated }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Témoignage');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { error } = await supabase.from('posts').insert([
            {
                title,
                slug: `${slug}-${Date.now()}`,
                content,
                category,
                author_id: user.id
            }
        ]);

        setLoading(false);

        if (error) {
            alert("Erreur lors de la publication : " + error.message);
        } else {
            onPostCreated();
            onClose();
            setTitle('');
            setContent('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-ny-card border-2 border-black shadow-[8px_8px_0px_0px_#ef4444] w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="font-display text-3xl mb-1 text-ny-red">Rédiger un Article</h2>
                <p className="text-xs text-ny-muted mb-6">Partage ton témoignage, tes conseils RDR ou tes réflexions.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Titre de l'article</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ex: Mon parcours, astuces RDR..."
                            className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-red outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Catégorie</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-red outline-none"
                        >
                            <option value="Témoignage">Témoignage</option>
                            <option value="Réduction des Risques">Réduction des Risques</option>
                            <option value="Entraide & Soutien">Entraide & Soutien</option>
                            <option value="Culture & Underground">Culture & Underground</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Contenu</label>
                        <textarea
                            required
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Écris ton message ici..."
                            className="w-full bg-ny-bg border-2 border-ny-border px-3 py-2 text-white text-sm focus:border-ny-red outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ny-red text-white font-bold py-3 border-2 border-black shadow-brut-red hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase text-sm flex items-center justify-center gap-2"
                    >
                        <Send size={16} /> {loading ? 'Publication...' : 'Publier sur le Blog'}
                    </button>
                </form>

            </div>
        </div>
    );
}