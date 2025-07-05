import React from 'react';
import { ExternalLink, FileText, Map, Radio, Calendar, MapPin } from 'lucide-react';
import { Projet } from '../../types';

interface ProjectDetailProps {
  projet: Projet;
}

export default function ProjectDetail({ projet }: ProjectDetailProps) {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{projet.nom}</h1>
        <div className="flex items-center space-x-6 text-blue-100">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Début: {new Date(projet.dateDebut).toLocaleDateString('fr-FR')}</span>
          </div>
          {projet.dateFin && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Fin: {new Date(projet.dateFin).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Complete description */}
      {projet.descriptionComplete && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Description du projet</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {projet.descriptionComplete}
            </p>
          </div>
        </div>
      )}

      {/* Document links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plans */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Map className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Plans</h3>
          </div>
          
          {projet.liens.miseEnPlan && projet.liens.miseEnPlan.length > 0 ? (
            <div className="space-y-2">
              {projet.liens.miseEnPlan.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleLinkClick(plan.lien)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-between text-sm"
                >
                  <span className="truncate">{plan.nom}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">Plans non disponibles</p>
            </div>
          )}
        </div>

        {/* Control sheets */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Fiches de contrôle</h3>
          </div>
          
          {projet.liens.fichesControle && projet.liens.fichesControle.length > 0 ? (
            <div className="space-y-2">
              {projet.liens.fichesControle.map(fiche => (
                <button
                  key={fiche.id}
                  onClick={() => handleLinkClick(fiche.lien)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-between text-sm"
                >
                  <span className="truncate">{fiche.nom}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">Fiches non disponibles</p>
            </div>
          )}
        </div>

        {/* Stations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Radio className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Stations</h3>
          </div>
          
          {projet.liens.stations ? (
            <button
              onClick={() => handleLinkClick(projet.liens.stations!)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Voir les stations</span>
            </button>
          ) : (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">Documents stations non disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Informations du projet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Statut</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              projet.statut === 'actif' ? 'bg-green-100 text-green-800' :
              projet.statut === 'termine' ? 'bg-slate-100 text-slate-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {projet.statut === 'actif' ? 'Actif' :
               projet.statut === 'termine' ? 'Terminé' : 'Suspendu'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Plans disponibles</label>
            <p className="text-slate-800">{projet.liens.miseEnPlan?.length || 0} plan(s)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Fiches disponibles</label>
            <p className="text-slate-800">{projet.liens.fichesControle?.length || 0} fiche(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
}