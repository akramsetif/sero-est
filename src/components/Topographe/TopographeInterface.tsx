import React, { useState } from 'react';
import { FileText, FolderOpen, ArrowLeft } from 'lucide-react';
import DailySurveyForm from './DailySurveyForm';
import ProjectsList from './ProjectsList';
import ProjectDetail from './ProjectDetail';
import RecentReports from './RecentReports';
import { Projet, Phase, Station, Rapport } from '../../types';

interface TopographeInterfaceProps {
  projets: Projet[];
  phases: Phase[];
  stations: Station[];
  rapports: Rapport[];
  onSubmit: (rapport: Rapport) => void;
  userName: string;
  userId: string;
}

type ViewType = 'main' | 'daily-form' | 'projects' | 'project-detail';

export default function TopographeInterface({
  projets,
  phases,
  stations,
  rapports,
  onSubmit,
  userName,
  userId
}: TopographeInterfaceProps) {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);

  const handleProjectSelect = (projet: Projet) => {
    setSelectedProject(projet);
    setCurrentView('project-detail');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedProject(null);
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
  };

  // Project detail view
  if (currentView === 'project-detail' && selectedProject) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToProjects}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux projets</span>
        </button>
        <ProjectDetail projet={selectedProject} />
      </div>
    );
  }

  // Projects list view
  if (currentView === 'projects') {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToMain}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </button>
        <ProjectsList projets={projets} onProjectSelect={handleProjectSelect} />
      </div>
    );
  }

  // Daily form view
  if (currentView === 'daily-form') {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToMain}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </button>
        <DailySurveyForm
          projets={projets}
          phases={phases}
          stations={stations}
          onSubmit={onSubmit}
          userName={userName}
          userId={userId}
        />
      </div>
    );
  }

  // Main view (home)
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Bienvenue, {userName}
        </h1>
        <p className="text-xl text-slate-600">
          Choisissez une action pour commencer
        </p>
      </div>

      {/* Main navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div 
          onClick={() => setCurrentView('daily-form')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl group-hover:bg-opacity-30 transition-all duration-300">
              <FileText className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Saisie journalière</h2>
              <p className="text-blue-100 text-lg">Enregistrer votre rapport quotidien</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('projects')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl group-hover:bg-opacity-30 transition-all duration-300">
              <FolderOpen className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Projets</h2>
              <p className="text-green-100 text-lg">Consulter les projets et documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Mes rapports</p>
              <p className="text-3xl font-bold text-slate-900">
                {rapports.filter(r => r.userId === userId).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Projets actifs</p>
              <p className="text-3xl font-bold text-slate-900">
                {projets.filter(p => p.statut === 'actif').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ce mois</p>
              <p className="text-3xl font-bold text-slate-900">
                {rapports.filter(r => 
                  r.userId === userId && 
                  new Date(r.date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent reports */}
      <div className="max-w-4xl mx-auto">
        <RecentReports rapports={rapports} userId={userId} />
      </div>
    </div>
  );
}