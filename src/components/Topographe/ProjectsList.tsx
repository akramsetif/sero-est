import React from 'react';
import { FolderOpen, Calendar, Eye, MapPin } from 'lucide-react';
import { Projet } from '../../types';

interface ProjectsListProps {
  projets: Projet[];
  onProjectSelect: (projet: Projet) => void;
}

export default function ProjectsList({ projets, onProjectSelect }: ProjectsListProps) {
  const projetsActifs = projets.filter(p => p.statut === 'actif');

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800 border-green-200';
      case 'termine': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'suspendu': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'termine': return 'Terminé';
      case 'suspendu': return 'Suspendu';
      default: return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Projets</h1>
        <p className="text-slate-600">{projetsActifs.length} projet(s) actif(s)</p>
      </div>

      {projetsActifs.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun projet actif</h3>
          <p className="text-slate-600">Les projets apparaîtront ici une fois créés par l'administrateur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetsActifs.map(projet => (
            <div
              key={projet.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FolderOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                        {projet.nom}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(projet.statut)}`}>
                        {getStatusLabel(projet.statut)}
                      </span>
                    </div>
                  </div>
                </div>

                {projet.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {projet.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(projet.dateDebut).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {projet.dateFin && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{new Date(projet.dateFin).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onProjectSelect(projet)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Eye className="h-4 w-4" />
                  <span>Voir le projet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}