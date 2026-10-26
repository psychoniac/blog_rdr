import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import AuthModal from './components/AuthModal';
import CreateModal from './components/CreateModal';
import ArticleModal from './components/ArticleModal'; // Import du nouveau composant
import { ShieldAlert, Radio } from 'lucide-react';
import ProfilePage from './components/ProfilePage';
import GalleryPage from './components/GalleryPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Article ouvert
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('feed');
  const [userProfile, setUserProfile] = useState(null);

  // États des modales
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (username, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (!error) setPosts(data || []);
    setLoading(false);
  };

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const handleOpenArticle = (post) => {
    setSelectedPost(post);
    setIsArticleOpen(true);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);


  return (
    <div className="min-h-screen bg-ny-bg bg-grid-pattern pb-12">

      <Header
        user={user}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreate={() => setCurrentView('profile')}
        onOpenProfile={() => setCurrentView('profile')}
        onSignOut={() => {
          supabase.auth.signOut();
          setUserProfile(null);
          setCurrentView('feed');
        }}
      />

      {currentView === 'profile' ? (
        <ProfilePage
          user={user}
          onBack={() => setCurrentView('feed')}
          onPostUpdated={fetchPosts}
        />
      ) : (
        /* Fil d'actualité principal */
        <main className="max-w-6xl mx-auto px-4 mt-8">
          {/* Cartes d'articles */}
        </main>
      )}
      <div className="bg-ny-yellow text-black border-b-2 border-black py-2 px-4 text-center text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-inner">
        <ShieldAlert size={16} />
        <span>Espace de réduction des risques & entraide • Matériel stérile, tests de substances & écoute bienveillante</span>
        <Radio size={16} className="animate-pulse text-ny-red" />
      </div>

      {/* Galery */}
      {currentView === 'gallery' ? (
        <GalleryPage user={user} />
      ) : (
        <span>
          Pas de photo pour le moment
        </span>
      )
      }
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h2 className="font-display text-4xl tracking-wide uppercase">Derniers Témoignages & Posts</h2>
          <p className="text-ny-muted text-sm">Le fil d'actualité de la rue, sans filtre et solidaire.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-ny-muted font-display text-xl animate-pulse">
            Chargement des ondes souterraines...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onClick={() => handleOpenArticle(post)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        user={user}
        onPostCreated={fetchPosts}
      />
      <ArticleModal
        post={selectedPost}
        isOpen={isArticleOpen}
        onClose={() => setIsArticleOpen(false)}
        user={user}
        onOpenAuth={() => {
          setIsArticleOpen(false);
          setIsAuthOpen(true);
        }}
      />

    </div>
  );
}