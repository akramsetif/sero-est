import React, { useMemo } from 'react';
import { Users, FileText, FolderOpen, Calendar } from 'lucide-react';
import { Rapport, Projet, User, DashboardStats } from '../../types';

interface DashboardProps {
  rapports: Rapport[];
  projets: Projet[];
  users: User[];
}

export default function Dashboard({ rapports, projets, users }: DashboardProps) {
  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toDateString();
    const rapportsAujourdhui = rapports.filter(r => new Date(r.date).toDateString() === today);
    const projetsActifs = projets.filter(p => p.statut === 'actif');
    const utilisateursActifs = users.filter(u => u.actif && u.role === 'topographe');

    return {
      totalRapports: rapports.length,
      rapportsAujourdhui: rapportsAujourdhui.length,
      projetsActifs: projetsActifs.length,
      utilisateursActifs: utilisateursActifs.length
    };
  }, [rapports, projets, users]);

  const recentReports = useMemo(() => {
    return rapports
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 5);
  }, [rapports]);

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Tableau de bord</h1>
        <p className="text-slate-600">Vue d'ensemble de l'activité topographique</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total rapports"
          value={stats.totalRapports}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard
          title="Rapports aujourd'hui"
          value={stats.rapportsAujourdhui}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Projets actifs"
          value={stats.projetsActifs}
          icon={FolderOpen}
          color="bg-orange-500"
        />
        <StatCard
          title="Topographes actifs"
          value={stats.utilisateursActifs}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Derniers rapports</h2>
        
        {recentReports.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun rapport disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Topographe</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Projet</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Phase</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Structure</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map(rapport => (
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