import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, ArrowLeft, ExternalLink } from 'lucide-react';

export default function GalleryPage({ user, onBack, onOpenArticle }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, image_url, created_at, category')
            .eq('author_id', user.id)
            .not('image_url', 'is', null)
            .order('created_at', { ascending: false });

        if (!error) {
            setImages(data || []);
        }
        setLoading(false);
    };
    useEffect(() => {
        if (user) fetchUserImages();
    }, [user]);


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Bouton Retour */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-ny-card border-2 border-black px-4 py-2 text-xs font-bold uppercase text-ny-yellow shadow-brut-black mb-6 hover:-translate-x-0.5 transition-all"
            >
                <ArrowLeft size={16} /> Retour au Fil d'actualité
            </button>

            {/* En-tête Galerie */}
            <div className="mb-8 border-b-2 border-ny-border pb-4">
                <h1 className="font-display text-4xl text-ny-yellow uppercase tracking-wide flex items-center gap-3">
                    <ImageIcon size={32} /> Galerie Mes Illustrations
                </h1>
                <p className="text-sm text-ny-muted mt-1">
                    Toutes les photos et visuels intégrés dans tes articles.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-ny-muted font-display text-xl animate-pulse">
                    Chargement de la galerie...
                </div>
            ) : images.length === 0 ? (
                <div className="bg-ny-card border-2 border-dashed border-ny-border p-8 text-center text-xs text-ny-muted">
                    Tu n'as encore publié aucune illustration dans tes articles.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((item) => (
                        <div
                            key={item.id}
                            className="bg-ny-card border-2 border-black overflow-hidden shadow-brut-black group flex flex-col justify-between"
                        >
                            <div className="relative h-48 overflow-hidden bg-ny-bg">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-105"
                                />
                                <span className="absolute top-2 left-2 bg-ny-yellow text-black text-[10px] font-bold px-2 py-0.5 border border-black uppercase">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-3">
                                <h3 className="font-display text-lg text-white truncate mb-2">{item.title}</h3>
                                <span className="text-[10px] text-ny-muted block mb-3">
                                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                </span>

                                <a
                                    href={item.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1 w-full bg-ny-bg border border-ny-border py-1 text-[10px] text-ny-yellow font-bold uppercase hover:border-ny-yellow"
                                >
                                    <ExternalLink size={12} /> Voir en plein écran
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}