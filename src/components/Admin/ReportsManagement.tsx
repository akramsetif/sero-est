import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, Calendar, CheckCircle, Clock, Send, RotateCcw } from 'lucide-react';
import { Rapport, Projet, User } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/export';

interface ReportsManagementProps {
  rapports: Rapport[];
  projets: Projet[];
  users: User[];
  onUpdateRapportStatus: (id: string, statut: Rapport['statut']) => void;
}

export default function ReportsManagement({ 
  rapports, 
  projets, 
  users, 
  onUpdateRapportStatus 
}: ReportsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredReports = useMemo(() => {
    return rapports.filter(rapport => {
      const matchesSearch = 
        rapport.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rapport.projetNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rapport.phaseNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rapport.remarques.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProject = !selectedProject || rapport.projetId === selectedProject;
      const matchesUser = !selectedUser || rapport.userId === selectedUser;
      const matchesStatus = !selectedStatus || rapport.statut === selectedStatus;
      
      const reportDate = new Date(rapport.date);
      const matchesDateFrom = !dateFrom || reportDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || reportDate <= new Date(dateTo);

      return matchesSearch && matchesProject && matchesUser && matchesStatus && matchesDateFrom && matchesDateTo;
    }).sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  }, [rapports, searchTerm, selectedProject, selectedUser, selectedStatus, dateFrom, dateTo]);

  const handleExport = (format: 'excel' | 'pdf') => {
    const filename = `SERO-EST_Rapports_${format === 'excel' ? 'csv' : 'pdf'}`;
    
    if (format === 'excel') {
      exportToExcel(filteredReports, filename);
    } else {
      exportToPDF(filteredReports, filename);
    }
  };

  const getStatusIcon = (statut: Rapport['statut']) => {
    switch (statut) {
      case 'enregistree': return Clock;
      case 'imprimee': return CheckCircle;
      case 'envoyee_bcs': return Send;
      case 'recue_bcs': return RotateCcw;
      default: return Clock;
    }
  };

  const getStatusColor = (statut: Rapport['statut']) => {
    switch (statut) {
      case 'enregistree': return 'bg-slate-100 text-slate-800';
      case 'imprimee': return 'bg-blue-100 text-blue-800';
      case 'envoyee_bcs': return 'bg-orange-100 text-orange-800';
      case 'recue_bcs': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (statut: Rapport['statut']) => {
    switch (statut) {
      case 'enregistree': return 'Enregistrée';
      case 'imprimee': return 'Imprimée';
      case 'envoyee_bcs': return 'Envoyée BCS';
      case 'recue_bcs': return 'Reçue BCS';
      default: return statut;
    }
  };

  const topographes = users.filter(u => u.role === 'topographe');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des rapports</h1>
          <p className="text-slate-600">{filteredReports.length} rapport(s) trouvé(s)</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-800">Filtres</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Projet
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les projets</option>
              {projets.map(projet => (
                <option key={projet.id} value={projet.id}>{projet.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Topographe
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les topographes</option>
              {topographes.map(user => (
                <option key={user.id} value={user.id}>{user.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="enregistree">Enregistrée</option>
              <option value="imprimee">Imprimée</option>
              <option value="envoyee_bcs">Envoyée BCS</option>
              <option value="recue_bcs">Reçue BCS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date début
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date fin
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Topographe</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Projet</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Phase</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Structure</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(rapport => {
                const StatusIcon = getStatusIcon(rapport.statut);
                return (
                  <tr key={rapport.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {new Date(rapport.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">{rapport.userName}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{rapport.projetNom}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {rapport.phaseNom === 'Autre' ? rapport.phaseAutre || 'Autre' : rapport.phaseNom}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {rapport.typeStructure === 'pile' ? 'Pile' : 'Culée'} {rapport.numeroStructure}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(rapport.statut)}`}>
                          {getStatusLabel(rapport.statut)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <select
                        value={rapport.statut}
                        onChange={(e) => onUpdateRapportStatus(rapport.id, e.target.value as Rapport['statut'])}
                        className="text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="enregistree">Enregistrée</option>
                        <option value="imprimee">Imprimée</option>
                        <option value="envoyee_bcs">Envoyée BCS</option>
                        <option value="recue_bcs">Reçue BCS</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun rapport trouvé avec ces critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}