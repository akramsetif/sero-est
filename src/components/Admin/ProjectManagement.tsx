import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Calendar, ExternalLink, Link, Map } from 'lucide-react';
import { Projet, FichierDrive } from '../../types';

interface ProjectManagementProps {
  projets: Projet[];
  onAddProject: (projet: Omit<Projet, 'id'>) => void;
  onUpdateProject: (id: string, projet: Partial<Projet>) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectManagement({ 
  projets, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}: ProjectManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Projet | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    descriptionComplete: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    statut: 'actif' as 'actif' | 'termine' | 'suspendu',
    liens: {
      miseEnPlan: [] as FichierDrive[],
      fichesControle: [] as FichierDrive[],
      stations: ''
    }
  });

  const [newPlan, setNewPlan] = useState({ nom: '', lien: '' });
  const [newFiche, setNewFiche] = useState({ nom: '', lien: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        await onUpdateProject(editingProject.id, formData);
        setEditingProject(null);
      } else {
        await onAddProject(formData);
        setShowAddForm(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      descriptionComplete: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      statut: 'actif',
      liens: {
        miseEnPlan: [],
        fichesControle: [],
        stations: ''
      }
    });
    setNewPlan({ nom: '', lien: '' });
    setNewFiche({ nom: '', lien: '' });
  };

  const handleEdit = (projet: Projet) => {
    setEditingProject(projet);
    setFormData({
      nom: projet.nom,
      description: projet.description || '',
      descriptionComplete: projet.descriptionComplete || '',
      dateDebut: projet.dateDebut,
      dateFin: projet.dateFin || '',
      statut: projet.statut,
      liens: {
        miseEnPlan: projet.liens.miseEnPlan || [],
        fichesControle: projet.liens.fichesControle || [],
        stations: projet.liens.stations || ''
      }
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProject(null);
    resetForm();
  };

  const addPlan = () => {
    if (newPlan.nom && newPlan.lien) {
      const plan: FichierDrive = {
        id: Date.now().toString(),
        nom: newPlan.nom,
        lien: newPlan.lien,
        type: 'plan'
      };
      setFormData(prev => ({
        ...prev,
        liens: {
          ...prev.liens,
          miseEnPlan: [...prev.liens.miseEnPlan, plan]
        }
      }));
      setNewPlan({ nom: '', lien: '' });
    }
  };

  const removePlan = (id: string) => {
    setFormData(prev => ({
      ...prev,
      liens: {
        ...prev.liens,
        miseEnPlan: prev.liens.miseEnPlan.filter(p => p.id !== id)
      }
    }));
  };

  const addFiche = () => {
    if (newFiche.nom && newFiche.lien) {
      const fiche: FichierDrive = {
        id: Date.now().toString(),
        nom: newFiche.nom,
        lien: newFiche.lien,
        type: 'fiche'
      };
      setFormData(prev => ({
        ...prev,
        liens: {
          ...prev.liens,
          fichesControle: [...prev.liens.fichesControle, fiche]
        }
      }));
      setNewFiche({ nom: '', lien: '' });
    }
  };

  const removeFiche = (id: string) => {
    setFormData(prev => ({
      ...prev,
      liens: {
        ...prev.liens,
        fichesControle: prev.liens.fichesControle.filter(f => f.id !== id)
      }
    }));
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'termine': return 'bg-slate-100 text-slate-800';
      case 'suspendu': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des projets</h1>
          <p className="text-slate-600">{projets.length} projet(s) enregistré(s)</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du projet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as 'actif' | 'termine' | 'suspendu' }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="actif">Actif</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description courte
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Description résumée du projet..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description complète
              </label>
              <textarea
                value={formData.descriptionComplete}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionComplete: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Description détaillée du projet..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Document Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-800">Liens vers les documents</h3>
              
              {/* Plans */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Map className="inline h-4 w-4 mr-1" />
                  Plans de mise en plan
                </label>
                
                <div className="space-y-2 mb-3">
                  {formData.liens.miseEnPlan.map(plan => (
                    <div key={plan.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Map className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{plan.nom}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={plan.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => removePlan(plan.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newPlan.nom}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, nom: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du plan"
                  />
                  <input
                    type="url"
                    value={newPlan.lien}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, lien: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lien Google Drive"
                  />
                  <button
                    type="button"
                    onClick={addPlan}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Control Sheets */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Link className="inline h-4 w-4 mr-1" />
                  Fiches de contrôle
                </label>
                
                <div className="space-y-2 mb-3">
                  {formData.liens.fichesControle.map(fiche => (
                    <div key={fiche.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Link className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{fiche.nom}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={fiche.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => removeFiche(fiche.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFiche.nom}
                    onChange={(e) => setNewFiche(prev => ({ ...prev, nom: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de la fiche"
                  />
                  <input
                    type="url"
                    value={newFiche.lien}
                    onChange={(e) => setNewFiche(prev => ({ ...prev, lien: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lien Google Drive"
                  />
                  <button
                    type="button"
                    onClick={addFiche}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Station Documents */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Link className="inline h-4 w-4 mr-1" />
                  Documents stations
                </label>
                <input
                  type="url"
                  value={formData.liens.stations}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    liens: { ...prev.liens, stations: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {editingProject ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {projets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun projet créé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Projet</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Plans</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Fiches</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Date début</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projets.map(projet => (
                  <tr key={projet.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{projet.nom}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                      {projet.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(projet.statut)}`}>
                        {getStatusLabel(projet.statut)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {projet.liens.miseEnPlan?.length || 0} plan(s)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {projet.liens.fichesControle?.length || 0} fiche(s)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(projet.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(projet)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(projet.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}