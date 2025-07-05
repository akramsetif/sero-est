import React, { useState } from 'react';
import { Calendar, MapPin, FileText, PenTool as Tool, MessageSquare, Send } from 'lucide-react';
import { Projet, Phase, Station, Rapport } from '../../types';
import { exportToPDF } from '../../utils/export';

interface DailySurveyFormProps {
  projets: Projet[];
  phases: Phase[];
  stations: Station[];
  onSubmit: (rapport: Rapport) => void;
  userName: string;
  userId: string;
}

const TACHES_OPTIONS = [
  'Relevé',
  'Implantation',
  'Contrôle',
  'Réception',
  'Bornage',
  'Autre'
];

export default function DailySurveyForm({ 
  projets, 
  phases, 
  stations, 
  onSubmit, 
  userName, 
  userId 
}: DailySurveyFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    projetId: '',
    phaseId: '',
    phaseAutre: '',
    typeStructure: 'pile' as 'pile' | 'culee',
    numeroStructure: '',
    taches: [] as string[],
    stationId: '',
    remarques: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projet = projets.find(p => p.id === formData.projetId);
      const phase = phases.find(p => p.id === formData.phaseId);
      const station = stations.find(s => s.id === formData.stationId);

      if (!projet || !phase || !station) {
        throw new Error('Données manquantes');
      }

      const rapport: Rapport = {
        id: Date.now().toString(),
        userId,
        userName,
        date: formData.date,
        projetId: formData.projetId,
        projetNom: projet.nom,
        phaseId: formData.phaseId,
        phaseNom: phase.nom,
        phaseAutre: formData.phaseAutre,
        typeStructure: formData.typeStructure,
        numeroStructure: formData.numeroStructure,
        taches: formData.taches,
        stationId: formData.stationId,
        stationNom: station.nom,
        remarques: formData.remarques,
        statut: 'enregistree',
        dateCreation: new Date().toISOString()
      };

      await onSubmit(rapport);

      // Generate automatic report
      const filename = `Rapport_${userName}_${formData.date}`;
      exportToPDF([rapport], filename);

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        projetId: '',
        phaseId: '',
        phaseAutre: '',
        typeStructure: 'pile',
        numeroStructure: '',
        taches: [],
        stationId: '',
        remarques: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Erreur lors de la soumission du rapport');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTacheChange = (tache: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        taches: [...prev.taches, tache]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        taches: prev.taches.filter(t => t !== tache)
      }));
    }
  };

  const selectedPhase = phases.find(p => p.id === formData.phaseId);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Saisie Journalière</h2>
        <p className="text-slate-600">Remplissez votre rapport d'activité quotidien</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Projet
            </label>
            <select
              value={formData.projetId}
              onChange={(e) => setFormData(prev => ({ ...prev, projetId: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            >
              <option value="">Sélectionner un projet</option>
              {projets.filter(p => p.statut === 'actif').map(projet => (
                <option key={projet.id} value={projet.id}>{projet.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phase
            </label>
            <select
              value={formData.phaseId}
              onChange={(e) => setFormData(prev => ({ ...prev, phaseId: e.target.value, phaseAutre: '' }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            >
              <option value="">Sélectionner une phase</option>
              {phases.map(phase => (
                <option key={phase.id} value={phase.id}>{phase.nom}</option>
              ))}
            </select>
          </div>

          {selectedPhase?.type === 'autre' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Préciser la phase
              </label>
              <input
                type="text"
                value={formData.phaseAutre}
                onChange={(e) => setFormData(prev => ({ ...prev, phaseAutre: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Décrivez la phase..."
                required
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-2" />
              Type de structure
            </label>
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, typeStructure: 'pile' }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.typeStructure === 'pile' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Pile
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, typeStructure: 'culee' }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.typeStructure === 'culee' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Culée
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Numéro de structure
            </label>
            <input
              type="text"
              value={formData.numeroStructure}
              onChange={(e) => setFormData(prev => ({ ...prev, numeroStructure: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Ex: P01, C02..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Tool className="inline h-4 w-4 mr-2" />
            Station utilisée
          </label>
          <select
            value={formData.stationId}
            onChange={(e) => setFormData(prev => ({ ...prev, stationId: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="">Sélectionner une station</option>
            {stations.filter(s => s.statut === 'disponible').map(station => (
              <option key={station.id} value={station.id}>
                {station.nom} - {station.modele}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tâches réalisées
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TACHES_OPTIONS.map(tache => (
              <label key={tache} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.taches.includes(tache)}
                  onChange={(e) => handleTacheChange(tache, e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{tache}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-2" />
            Remarques
          </label>
          <textarea
            value={formData.remarques}
            onChange={(e) => setFormData(prev => ({ ...prev, remarques: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            rows={4}
            placeholder="Observations, difficultés rencontrées, notes particulières..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Send className="h-5 w-5" />
          <span>{isSubmitting ? 'Soumission...' : 'Soumettre le rapport'}</span>
        </button>
      </form>
    </div>
  );
}