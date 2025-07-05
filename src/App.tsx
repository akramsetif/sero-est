import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import TopographeInterface from './components/Topographe/TopographeInterface';
import Dashboard from './components/Admin/Dashboard';
import AdminTabs from './components/Admin/AdminTabs';
import ReportsManagement from './components/Admin/ReportsManagement';
import UserManagement from './components/Admin/UserManagement';
import ProjectManagement from './components/Admin/ProjectManagement';
import Settings from './components/Admin/Settings';
import ActivityLogs from './components/Admin/ActivityLogs';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { User, Projet, Phase, Station, Rapport, ActionLog } from './types';
import { useAuth } from './hooks/useAuth';
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getProjets,
  addProjet,
  updateProjet,
  deleteProjet,
  getPhases,
  updatePhases,
  getStations,
  updateStations,
  getRapports,
  addRapport,
  updateRapportStatus,
  getActionLogs,
  addActionLog
} from './services/database';

function App() {
  const { user: currentUser, loading: authLoading, login, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'users' | 'projects' | 'settings' | 'logs'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, projetsData, phasesData, stationsData, rapportsData, logsData] = await Promise.all([
        getUsers(),
        getProjets(),
        getPhases(),
        getStations(),
        getRapports(),
        getActionLogs()
      ]);

      setUsers(usersData);
      setProjets(projetsData);
      setPhases(phasesData);
      setStations(stationsData);
      setRapports(rapportsData);
      setActionLogs(logsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (nom: string, motDePasse: string) => {
    const { user, error } = await login(nom, motDePasse);
    if (error) {
      throw new Error(error);
    }
    return user;
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmitReport = async (rapport: Rapport) => {
    try {
      await addRapport(rapport);
      const updatedRapports = await getRapports();
      setRapports(updatedRapports);
      
      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Création de rapport',
          details: `Rapport créé pour le projet ${rapport.projetNom}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  };

  const handleUpdateRapportStatus = async (id: string, statut: Rapport['statut']) => {
    try {
      await updateRapportStatus(id, statut);
      const updatedRapports = await getRapports();
      setRapports(updatedRapports);

      if (currentUser) {
        const rapport = rapports.find(r => r.id === id);
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Modification statut rapport',
          details: `Statut changé vers "${statut}" pour le rapport ${rapport?.projetNom || 'inconnu'}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error updating rapport status:', error);
      throw error;
    }
  };

  // Admin functions
  const handleAddUser = async (userData: Omit<User, 'id' | 'dateCreation'>) => {
    try {
      await addUser(userData);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Ajout utilisateur',
          details: `Nouvel utilisateur créé: ${userData.nom} (${userData.role})`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      await updateUser(id, userData);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);

      if (currentUser) {
        const user = users.find(u => u.id === id);
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Modification utilisateur',
          details: `Utilisateur modifié: ${user?.nom || 'inconnu'}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      await deleteUser(id);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Suppression utilisateur',
          details: `Utilisateur supprimé: ${user?.nom || 'inconnu'}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const handleAddProject = async (projectData: Omit<Projet, 'id'>) => {
    try {
      await addProjet(projectData);
      const updatedProjets = await getProjets();
      setProjets(updatedProjets);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Ajout projet',
          details: `Nouveau projet créé: ${projectData.nom}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (id: string, projectData: Partial<Projet>) => {
    try {
      await updateProjet(id, projectData);
      const updatedProjets = await getProjets();
      setProjets(updatedProjets);

      if (currentUser) {
        const projet = projets.find(p => p.id === id);
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Modification projet',
          details: `Projet modifié: ${projet?.nom || 'inconnu'}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const projet = projets.find(p => p.id === id);
      await deleteProjet(id);
      const updatedProjets = await getProjets();
      setProjets(updatedProjets);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Suppression projet',
          details: `Projet supprimé: ${projet?.nom || 'inconnu'}`
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const handleUpdateStations = async (updatedStations: Station[]) => {
    try {
      await updateStations(updatedStations);
      setStations(updatedStations);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Modification stations',
          details: 'Configuration des stations mise à jour'
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error updating stations:', error);
      throw error;
    }
  };

  const handleUpdatePhases = async (updatedPhases: Phase[]) => {
    try {
      await updatePhases(updatedPhases);
      setPhases(updatedPhases);

      if (currentUser) {
        await addActionLog({
          userId: currentUser.id,
          userName: currentUser.nom,
          action: 'Modification phases',
          details: 'Configuration des phases mise à jour'
        });
        const updatedLogs = await getActionLogs();
        setActionLogs(updatedLogs);
      }
    } catch (error) {
      console.error('Error updating phases:', error);
      throw error;
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const isMainAdmin = currentUser.role === 'admin' && currentUser.nom.toLowerCase() === 'akram';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {currentUser.role === 'topographe' ? (
          <TopographeInterface
            projets={projets}
            phases={phases}
            stations={stations}
            rapports={rapports}
            onSubmit={handleSubmitReport}
            userName={currentUser.nom}
            userId={currentUser.id}
          />
        ) : (
          <div>
            <AdminTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              isMainAdmin={isMainAdmin}
            />
            <div className="mt-6">
              {activeTab === 'dashboard' && (
                <Dashboard rapports={rapports} projets={projets} users={users} />
              )}
              {activeTab === 'reports' && (
                <ReportsManagement 
                  rapports={rapports} 
                  projets={projets} 
                  users={users}
                  onUpdateRapportStatus={handleUpdateRapportStatus}
                />
              )}
              {activeTab === 'users' && isMainAdmin && (
                <UserManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  currentUserId={currentUser.id}
                />
              )}
              {activeTab === 'projects' && isMainAdmin && (
                <ProjectManagement
                  projets={projets}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              )}
              {activeTab === 'settings' && isMainAdmin && (
                <Settings
                  stations={stations}
                  phases={phases}
                  onUpdateStations={handleUpdateStations}
                  onUpdatePhases={handleUpdatePhases}
                />
              )}
              {activeTab === 'logs' && isMainAdmin && (
                <ActivityLogs logs={actionLogs} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;