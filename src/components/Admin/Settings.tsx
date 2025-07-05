import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Download, Upload, Edit2, Trash2, Plus } from 'lucide-react';
import { Station, Phase } from '../../types';

interface SettingsProps {
  stations: Station[];
  phases: Phase[];
  onUpdateStations: (stations: Station[]) => void;
  onUpdatePhases: (phases: Phase[]) => void;
}

export default function Settings({ 
  stations, 
  phases, 
  onUpdateStations, 
  onUpdatePhases 
}: SettingsProps) {
  const [activeSection, setActiveSection] = useState<'stations' | 'phases' | 'backup'>('stations');
  
  // Station management
  const [stationForm, setStationForm] = useState({ nom: '', modele: '', numero: '', statut: 'disponible' as Station['statut'] });
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  
  // Phase management  
  const [phaseForm, setPhaseForm] = useState({ nom: '', type: 'standard' as Phase['type'] });
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);

  // Station handlers
  const handleAddStation = async () => {
    try {
      const newStation: Station = {
        id: Date.now().toString(),
        ...stationForm
      };
      await onUpdateStations([...stations, newStation]);
      setStationForm({ nom: '', modele: '', numero: '', statut: 'disponible' });
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setStationForm({
      nom: station.nom,
      modele: station.modele,
      numero: station.numero,
      statut: station.statut
    });
  };

  const handleUpdateStation = async () => {
    if (editingStation) {
      try {
        const updatedStations = stations.map(s => 
          s.id === editingStation.id ? { ...editingStation, ...stationForm } : s
        );
        await onUpdateStations(updatedStations);
        setEditingStation(null);
        setStationForm({ nom: '', modele: '', numero: '', statut: 'disponible' });
      } catch (error) {
        console.error('Error updating station:', error);
      }
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      try {
        await onUpdateStations(stations.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting station:', error);
      }
    }
  };

  // Phase handlers
  const handleAddPhase = async () => {
    if (phaseForm.nom && !phases.find(p => p.nom === phaseForm.nom)) {
      try {
        const newPhase: Phase = {
          id: Date.now().toString(),
          ...phaseForm
        };
        await onUpdatePhases([...phases, newPhase]);
        setPhaseForm({ nom: '', type: 'standard' });
      } catch (error) {
        console.error('Error adding phase:', error);
      }
    }
  };

  const handleEditPhase = (phase: Phase) => {
    setEditingPhase(phase);
    setPhaseForm({
      nom: phase.nom,
      type: phase.type
    });
  };

  const handleUpdatePhase = async () => {
    if (editingPhase) {
      try {
        const updatedPhases = phases.map(p => 
          p.id === editingPhase.id ? { ...editingPhase, ...phaseForm } : p
        );
        await onUpdatePhases(updatedPhases);
        setEditingPhase(null);
        setPhaseForm({ nom: '', type: 'standard' });
      } catch (error) {
        console.error('Error updating phase:', error);
      }
    }
  };

  const handleDeletePhase = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette phase ?')) {
      try {
        await onUpdatePhases(phases.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting phase:', error);
      }
    }
  };

  const handleCancelPhaseEdit = () => {
    setEditingPhase(null);
    setPhaseForm({ nom: '', type: 'standard' });
  };

  const exportData = () => {
    const data = {
      stations,
      phases,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sero-est-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.stations) await onUpdateStations(data.stations);
          if (data.phases) await onUpdatePhases(data.phases);
          alert('Données importées avec succès');
        } catch (error) {
          alert('Erreur lors de l\'importation des données');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Paramètres</h1>
        <p className="text-slate-600">Configuration et gestion des ressources</p>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b">
          {[
            { id: 'stations', label: 'Stations Totales', icon: SettingsIcon },
            { id: 'phases', label: 'Phases', icon: Database },
            { id: 'backup', label: 'Sauvegarde', icon: Download }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                activeSection === section.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <section.icon className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Stations Management */}
          {activeSection === 'stations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {editingStation ? 'Modifier la station' : 'Ajouter une station'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nom (ex: TS 12)"
                    value={stationForm.nom}
                    onChange={(e) => setStationForm(prev => ({ ...prev, nom: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Modèle"
                    value={stationForm.modele}
                    onChange={(e) => setStationForm(prev => ({ ...prev, modele: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Numéro série"
                    value={stationForm.numero}
                    onChange={(e) => setStationForm(prev => ({ ...prev, numero: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={stationForm.statut}
                    onChange={(e) => setStationForm(prev => ({ ...prev, statut: e.target.value as Station['statut'] }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_utilisation">En utilisation</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={editingStation ? handleUpdateStation : handleAddStation}
                    disabled={!stationForm.nom || !stationForm.modele}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    {editingStation ? 'Modifier' : 'Ajouter'}
                  </button>
                  {editingStation && (
                    <button
                      onClick={() => {
                        setEditingStation(null);
                        setStationForm({ nom: '', modele: '', numero: '', statut: 'disponible' });
                      }}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-slate-800">Stations existantes</h4>
                {stations.map(station => (
                  <div key={station.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium">{station.nom}</span>
                      <span className="text-slate-600 ml-2">- {station.modele}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        station.statut === 'disponible' ? 'bg-green-100 text-green-800' :
                        station.statut === 'en_utilisation' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {station.statut === 'disponible' ? 'Disponible' :
                         station.statut === 'en_utilisation' ? 'En utilisation' :
                         'Maintenance'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditStation(station)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStation(station.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phases Management */}
          {activeSection === 'phases' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {editingPhase ? 'Modifier la phase' : 'Ajouter une nouvelle phase'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nom de la phase"
                    value={phaseForm.nom}
                    onChange={(e) => setPhaseForm(prev => ({ ...prev, nom: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={phaseForm.type}
                    onChange={(e) => setPhaseForm(prev => ({ ...prev, type: e.target.value as Phase['type'] }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="autre">Autre</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={editingPhase ? handleUpdatePhase : handleAddPhase}
                      disabled={!phaseForm.nom}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{editingPhase ? 'Modifier' : 'Ajouter'}</span>
                    </button>
                    {editingPhase && (
                      <button
                        onClick={handleCancelPhaseEdit}
                        className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-800">Phases disponibles ({phases.length})</h4>
                </div>
                
                {phases.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune phase configurée</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {phases.map((phase, index) => (
                      <div key={phase.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            #{index + 1}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">{phase.nom}</span>
                            <span className={`ml-3 px-2 py-1 text-xs rounded ${
                              phase.type === 'standard' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {phase.type === 'standard' ? 'Standard' : 'Autre'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPhase(phase)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePhase(phase.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">Actions rapides</h5>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      if (confirm('Voulez-vous supprimer TOUTES les phases ?')) {
                        await onUpdatePhases([]);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Supprimer toutes les phases
                  </button>
                  <button
                    onClick={async () => {
                      const phasesParDefaut: Phase[] = [
                        { id: '1', nom: 'Fond feuille de la semelle', type: 'standard' },
                        { id: '2', nom: 'BP de la semelle', type: 'standard' },
                        { id: '3', nom: 'Coffrage de la semelle', type: 'standard' },
                        { id: '4', nom: 'Coffrage les fûts', type: 'standard' },
                        { id: '5', nom: 'Coffrage chevettre et dés d\'appui', type: 'standard' },
                        { id: '6', nom: 'Les appareils d\'appui', type: 'standard' },
                        { id: '7', nom: 'Coffrage poutre couronnement', type: 'standard' },
                        { id: '8', nom: 'Autre', type: 'autre' }
                      ];
                      await onUpdatePhases(phasesParDefaut);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Restaurer phases par défaut
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup Management */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Sauvegarde et restauration</h3>
                <p className="text-slate-600 mb-6">
                  Exportez ou importez la configuration des stations et phases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">Exporter les données</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Téléchargez un fichier de sauvegarde contenant toutes vos configurations.
                  </p>
                  <button
                    onClick={exportData}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                  </button>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">Importer les données</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Restaurez vos configurations à partir d'un fichier de sauvegarde.
                  </p>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 cursor-pointer inline-flex">
                    <Upload className="h-4 w-4" />
                    <span>Importer</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}