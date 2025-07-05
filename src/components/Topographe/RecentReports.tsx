import React from 'react';
import { Clock, MapPin, FileText, Download } from 'lucide-react';
import { Rapport } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/export';

interface RecentReportsProps {
  rapports: Rapport[];
  userId: string;
}

export default function RecentReports({ rapports, userId }: RecentReportsProps) {
  const userReports = rapports
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  const handleExportMyReports = (format: 'excel' | 'pdf') => {
    const myReports = rapports.filter(r => r.userId === userId);
    const filename = `Mes_Rapports_${format === 'excel' ? 'csv' : 'pdf'}`;
    
    if (format === 'excel') {
      exportToExcel(myReports, filename);
    } else {
      exportToPDF(myReports, filename);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mes derniers rapports</h2>
          <p className="text-slate-600">Vos 5 dernières saisies</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleExportMyReports('excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExportMyReports('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {userReports.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun rapport enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userReports.map(rapport => (
            <div key={rapport.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {new Date(rapport.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 mb-1">{rapport.projetNom}</h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{rapport.phaseNom === 'Autre' ? rapport.phaseAutre : rapport.phaseNom}</span>
                    </div>
                    <span>{rapport.typeStructure === 'pile' ? 'Pile' : 'Culée'} {rapport.numeroStructure}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {rapport.taches.map(tache => (
                        <span key={tache} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {tache}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-slate-500">
                  {rapport.stationNom}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}