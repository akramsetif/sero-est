import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('sero-est-current-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (nom: string, motDePasse: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nom', nom.trim())
        .eq('mot_de_passe', motDePasse)
        .eq('actif', true)
        .single();

      if (error || !data) {
        return { user: null, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
      }

      const userData: User = {
        id: data.id,
        nom: data.nom,
        motDePasse: data.mot_de_passe,
        role: data.role,
        actif: data.actif,
        dateCreation: data.date_creation
      };

      setUser(userData);
      localStorage.setItem('sero-est-current-user', JSON.stringify(userData));

      // Log the login action
      await supabase.from('action_logs').insert({
        user_id: userData.id,
        user_name: userData.nom,
        action: 'Connexion utilisateur',
        details: `Connexion réussie avec le rôle ${userData.role}`
      });

      return { user: userData, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    if (user) {
      // Log the logout action
      await supabase.from('action_logs').insert({
        user_id: user.id,
        user_name: user.nom,
        action: 'Déconnexion utilisateur',
        details: 'Déconnexion de l\'application'
      });
    }

    setUser(null);
    localStorage.removeItem('sero-est-current-user');
  };

  return {
    user,
    loading,
    login,
    logout
  };
}