import { supabase } from '../lib/supabase';
import { User, Projet, Phase, Station, Rapport, ActionLog, FichierDrive } from '../types';

// Users
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('nom');

  if (error) throw error;

  return data.map(user => ({
    id: user.id,
    nom: user.nom,
    motDePasse: user.mot_de_passe,
    role: user.role,
    actif: user.actif,
    dateCreation: user.date_creation
  }));
};

export const addUser = async (userData: Omit<User, 'id' | 'dateCreation'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      nom: userData.nom,
      mot_de_passe: userData.motDePasse,
      role: userData.role,
      actif: userData.actif
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nom: data.nom,
    motDePasse: data.mot_de_passe,
    role: data.role,
    actif: data.actif,
    dateCreation: data.date_creation
  };
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({
      nom: userData.nom,
      mot_de_passe: userData.motDePasse,
      role: userData.role,
      actif: userData.actif
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Projets
export const getProjets = async (): Promise<Projet[]> => {
  const { data: projetsData, error: projetsError } = await supabase
    .from('projets')
    .select('*')
    .order('nom');

  if (projetsError) throw projetsError;

  const { data: fichiersData, error: fichiersError } = await supabase
    .from('fichiers_drive')
    .select('*');

  if (fichiersError) throw fichiersError;

  return projetsData.map(projet => {
    const fichiers = fichiersData.filter(f => f.projet_id === projet.id);
    const miseEnPlan = fichiers.filter(f => f.type === 'plan').map(f => ({
      id: f.id,
      nom: f.nom,
      lien: f.lien,
      type: f.type as 'plan'
    }));
    const fichesControle = fichiers.filter(f => f.type === 'fiche').map(f => ({
      id: f.id,
      nom: f.nom,
      lien: f.lien,
      type: f.type as 'fiche'
    }));

    return {
      id: projet.id,
      nom: projet.nom,
      description: projet.description || undefined,
      descriptionComplete: projet.description_complete || undefined,
      dateDebut: projet.date_debut,
      dateFin: projet.date_fin || undefined,
      statut: projet.statut,
      liens: {
        miseEnPlan,
        fichesControle,
        stations: projet.liens_stations || undefined
      }
    };
  });
};

export const addProjet = async (projetData: Omit<Projet, 'id'>): Promise<Projet> => {
  const { data, error } = await supabase
    .from('projets')
    .insert({
      nom: projetData.nom,
      description: projetData.description,
      description_complete: projetData.descriptionComplete,
      date_debut: projetData.dateDebut,
      date_fin: projetData.dateFin,
      statut: projetData.statut,
      liens_stations: projetData.liens.stations
    })
    .select()
    .single();

  if (error) throw error;

  // Add fichiers
  if (projetData.liens.miseEnPlan?.length) {
    const planInserts = projetData.liens.miseEnPlan.map(plan => ({
      projet_id: data.id,
      nom: plan.nom,
      lien: plan.lien,
      type: 'plan' as const
    }));
    await supabase.from('fichiers_drive').insert(planInserts);
  }

  if (projetData.liens.fichesControle?.length) {
    const ficheInserts = projetData.liens.fichesControle.map(fiche => ({
      projet_id: data.id,
      nom: fiche.nom,
      lien: fiche.lien,
      type: 'fiche' as const
    }));
    await supabase.from('fichiers_drive').insert(ficheInserts);
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || undefined,
    descriptionComplete: data.description_complete || undefined,
    dateDebut: data.date_debut,
    dateFin: data.date_fin || undefined,
    statut: data.statut,
    liens: projetData.liens
  };
};

export const updateProjet = async (id: string, projetData: Partial<Projet>): Promise<void> => {
  const { error } = await supabase
    .from('projets')
    .update({
      nom: projetData.nom,
      description: projetData.description,
      description_complete: projetData.descriptionComplete,
      date_debut: projetData.dateDebut,
      date_fin: projetData.dateFin,
      statut: projetData.statut,
      liens_stations: projetData.liens?.stations
    })
    .eq('id', id);

  if (error) throw error;

  // Update fichiers
  if (projetData.liens) {
    // Delete existing fichiers
    await supabase.from('fichiers_drive').delete().eq('projet_id', id);

    // Add new fichiers
    const allFichiers = [
      ...(projetData.liens.miseEnPlan || []).map(f => ({ ...f, type: 'plan' as const })),
      ...(projetData.liens.fichesControle || []).map(f => ({ ...f, type: 'fiche' as const }))
    ];

    if (allFichiers.length > 0) {
      const fichierInserts = allFichiers.map(fichier => ({
        projet_id: id,
        nom: fichier.nom,
        lien: fichier.lien,
        type: fichier.type
      }));
      await supabase.from('fichiers_drive').insert(fichierInserts);
    }
  }
};

export const deleteProjet = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projets')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Phases
export const getPhases = async (): Promise<Phase[]> => {
  const { data, error } = await supabase
    .from('phases')
    .select('*')
    .order('nom');

  if (error) throw error;

  return data.map(phase => ({
    id: phase.id,
    nom: phase.nom,
    type: phase.type
  }));
};

export const updatePhases = async (phases: Phase[]): Promise<void> => {
  // Delete all existing phases
  await supabase.from('phases').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert new phases
  if (phases.length > 0) {
    const { error } = await supabase
      .from('phases')
      .insert(phases.map(phase => ({
        nom: phase.nom,
        type: phase.type
      })));

    if (error) throw error;
  }
};

// Stations
export const getStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('nom');

  if (error) throw error;

  return data.map(station => ({
    id: station.id,
    nom: station.nom,
    modele: station.modele,
    numero: station.numero,
    statut: station.statut
  }));
};

export const updateStations = async (stations: Station[]): Promise<void> => {
  // Delete all existing stations
  await supabase.from('stations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert new stations
  if (stations.length > 0) {
    const { error } = await supabase
      .from('stations')
      .insert(stations.map(station => ({
        nom: station.nom,
        modele: station.modele,
        numero: station.numero,
        statut: station.statut
      })));

    if (error) throw error;
  }
};

// Rapports
export const getRapports = async (): Promise<Rapport[]> => {
  const { data, error } = await supabase
    .from('rapports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(rapport => ({
    id: rapport.id,
    userId: rapport.user_id || '',
    userName: rapport.user_name,
    date: rapport.date,
    projetId: rapport.projet_id || '',
    projetNom: rapport.projet_nom,
    phaseId: rapport.phase_id || '',
    phaseNom: rapport.phase_nom,
    phaseAutre: rapport.phase_autre || undefined,
    typeStructure: rapport.type_structure,
    numeroStructure: rapport.numero_structure,
    taches: rapport.taches,
    stationId: rapport.station_id || '',
    stationNom: rapport.station_nom,
    remarques: rapport.remarques,
    statut: rapport.statut,
    dateCreation: rapport.created_at
  }));
};

export const addRapport = async (rapport: Rapport): Promise<void> => {
  const { error } = await supabase
    .from('rapports')
    .insert({
      user_id: rapport.userId,
      user_name: rapport.userName,
      date: rapport.date,
      projet_id: rapport.projetId,
      projet_nom: rapport.projetNom,
      phase_id: rapport.phaseId,
      phase_nom: rapport.phaseNom,
      phase_autre: rapport.phaseAutre,
      type_structure: rapport.typeStructure,
      numero_structure: rapport.numeroStructure,
      taches: rapport.taches,
      station_id: rapport.stationId,
      station_nom: rapport.stationNom,
      remarques: rapport.remarques,
      statut: rapport.statut
    });

  if (error) throw error;
};

export const updateRapportStatus = async (id: string, statut: Rapport['statut']): Promise<void> => {
  const { error } = await supabase
    .from('rapports')
    .update({ statut })
    .eq('id', id);

  if (error) throw error;
};

// Action Logs
export const getActionLogs = async (): Promise<ActionLog[]> => {
  const { data, error } = await supabase
    .from('action_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw error;

  return data.map(log => ({
    id: log.id,
    userId: log.user_id || '',
    userName: log.user_name,
    action: log.action,
    details: log.details || '',
    timestamp: log.timestamp
  }));
};

export const addActionLog = async (log: Omit<ActionLog, 'id' | 'timestamp'>): Promise<void> => {
  const { error } = await supabase
    .from('action_logs')
    .insert({
      user_id: log.userId,
      user_name: log.userName,
      action: log.action,
      details: log.details
    });

  if (error) throw error;
};