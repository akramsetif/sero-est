export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nom: string;
          mot_de_passe: string;
          role: 'topographe' | 'admin' | 'responsable';
          actif: boolean;
          date_creation: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          mot_de_passe: string;
          role: 'topographe' | 'admin' | 'responsable';
          actif?: boolean;
          date_creation?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          mot_de_passe?: string;
          role?: 'topographe' | 'admin' | 'responsable';
          actif?: boolean;
          date_creation?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projets: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          description_complete: string | null;
          date_debut: string;
          date_fin: string | null;
          statut: 'actif' | 'termine' | 'suspendu';
          liens_stations: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          description?: string | null;
          description_complete?: string | null;
          date_debut: string;
          date_fin?: string | null;
          statut?: 'actif' | 'termine' | 'suspendu';
          liens_stations?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          description?: string | null;
          description_complete?: string | null;
          date_debut?: string;
          date_fin?: string | null;
          statut?: 'actif' | 'termine' | 'suspendu';
          liens_stations?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fichiers_drive: {
        Row: {
          id: string;
          projet_id: string | null;
          nom: string;
          lien: string;
          type: 'fiche' | 'plan' | 'station';
          created_at: string;
        };
        Insert: {
          id?: string;
          projet_id?: string | null;
          nom: string;
          lien: string;
          type: 'fiche' | 'plan' | 'station';
          created_at?: string;
        };
        Update: {
          id?: string;
          projet_id?: string | null;
          nom?: string;
          lien?: string;
          type?: 'fiche' | 'plan' | 'station';
          created_at?: string;
        };
      };
      phases: {
        Row: {
          id: string;
          nom: string;
          type: 'standard' | 'autre';
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          type?: 'standard' | 'autre';
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          type?: 'standard' | 'autre';
          created_at?: string;
        };
      };
      stations: {
        Row: {
          id: string;
          nom: string;
          modele: string;
          numero: string;
          statut: 'disponible' | 'en_utilisation' | 'maintenance';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          modele: string;
          numero: string;
          statut?: 'disponible' | 'en_utilisation' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          modele?: string;
          numero?: string;
          statut?: 'disponible' | 'en_utilisation' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
      };
      rapports: {
        Row: {
          id: string;
          user_id: string | null;
          user_name: string;
          date: string;
          projet_id: string | null;
          projet_nom: string;
          phase_id: string | null;
          phase_nom: string;
          phase_autre: string | null;
          type_structure: 'pile' | 'culee';
          numero_structure: string;
          taches: string[];
          station_id: string | null;
          station_nom: string;
          remarques: string;
          statut: 'enregistree' | 'imprimee' | 'envoyee_bcs' | 'recue_bcs';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_name: string;
          date: string;
          projet_id?: string | null;
          projet_nom: string;
          phase_id?: string | null;
          phase_nom: string;
          phase_autre?: string | null;
          type_structure: 'pile' | 'culee';
          numero_structure: string;
          taches?: string[];
          station_id?: string | null;
          station_nom: string;
          remarques?: string;
          statut?: 'enregistree' | 'imprimee' | 'envoyee_bcs' | 'recue_bcs';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_name?: string;
          date?: string;
          projet_id?: string | null;
          projet_nom?: string;
          phase_id?: string | null;
          phase_nom?: string;
          phase_autre?: string | null;
          type_structure?: 'pile' | 'culee';
          numero_structure?: string;
          taches?: string[];
          station_id?: string | null;
          station_nom?: string;
          remarques?: string;
          statut?: 'enregistree' | 'imprimee' | 'envoyee_bcs' | 'recue_bcs';
          created_at?: string;
          updated_at?: string;
        };
      };
      action_logs: {
        Row: {
          id: string;
          user_id: string | null;
          user_name: string;
          action: string;
          details: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_name: string;
          action: string;
          details?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_name?: string;
          action?: string;
          details?: string | null;
          timestamp?: string;
        };
      };
    };
  };
}