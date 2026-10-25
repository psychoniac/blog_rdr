import { MessageSquare, Calendar, User } from 'lucide-react';

export default function ArticleCard({ post, onClick }) {
    return (
        <article
            onClick={onClick}
            className="bg-ny-card border-2 border-ny-border rounded-none p-5 shadow-brut-yellow hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
        >
            <div>
                {/* Catégorie / Badge */}
                <div className="flex justify-between items-center mb-3">
                    <span className="bg-ny-yellow text-black text-xs font-bold px-2.5 py-1 border border-black uppercase tracking-wide">
                        {post.category || 'Témoignage'}
                    </span>
                    <span className="text-xs text-ny-muted flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </span>
                </div>

                {/* Titre */}
                <h3 className="font-display text-2xl tracking-wide group-hover:text-ny-yellow transition-colors mb-2">
                    {post.title}
                </h3>

                {/* Extrait du contenu */}
                <p className="text-gray-300 text-sm line-clamp-3 mb-4 font-sans">
                    {post.content}
                </p>
            </div>

            {/* Auteur & Pied de carte */}
            <div className="pt-4 border-t border-ny-border flex items-center justify-between text-xs text-ny-muted">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                    <User size={14} className="text-ny-red" />
                    {post.profiles?.username || 'Anonyme'}
                </span>
                <span className="flex items-center gap-1 text-ny-yellow font-bold">
                    <MessageSquare size={14} /> Commenter
                </span>
            </div>
        </article>
    );
}