
import { supabase } from './supabase';

export async function uploadImage(file, folder = 'posts') {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('blog-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("Erreur lors de l'upload:", error.message);
    throw error;
  }

  // Récupérer l'URL publique
  const { data: publicUrlData } = supabase.storage
    .from('blog-media')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}