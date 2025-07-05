export interface User {
  id: string;
  nom: string;
  motDePasse: string;
  role: 'topographe' | 'admin' | 'responsable';
  actif: boolean;
  dateCreation: string;
}

export interface Projet {
  id: string;
  nom: string;
  description?: string;
  descriptionComplete?: string;
  dateDebut: string;
  dateFin?: string;
  statut: 'actif' | 'termine' | 'suspendu';
  liens: {
    miseEnPlan?: FichierDrive[];
    fichesControle?: FichierDrive[];
    stations?: string;
  };
}

export interface FichierDrive {
  id: string;
  nom: string;
  lien: string;
  type: 'fiche' | 'plan' | 'station';
}

export interface Phase {
  id: string;
  nom: string;
  type: 'standard' | 'autre';
}

export interface Station {
  id: string;
  nom: string;
  modele: string;
  numero: string;
  statut: 'disponible' | 'en_utilisation' | 'maintenance';
}

export interface Rapport {
  id: string;
  userId: string;
  userName: string;
  date: string;
  projetId: string;
  projetNom: string;
  phaseId: string;
  phaseNom: string;
  phaseAutre?: string;
  typeStructure: 'pile' | 'culee';
  numeroStructure: string;
  taches: string[];
  stationId: string;
  stationNom: string;
  remarques: string;
  statut: 'enregistree' | 'imprimee' | 'envoyee_bcs' | 'recue_bcs';
  dateCreation: string;
}

export interface DashboardStats {
  totalRapports: number;
  rapportsAujourdhui: number;
  projetsActifs: number;
  utilisateursActifs: number;
}

export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}