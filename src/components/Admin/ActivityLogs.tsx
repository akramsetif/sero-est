import React, { useMemo } from 'react';
import { Activity, Clock, User, FileText } from 'lucide-react';
import { ActionLog } from '../../types';

interface ActivityLogsProps {
  logs: ActionLog[];
}

export default function ActivityLogs({ logs }: ActivityLogsProps) {
  const sortedLogs = useMemo(() => {
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs]);

  const getActionIcon = (action: string) => {
    if (action.includes('utilisateur')) return User;
    if (action.includes('projet')) return FileText;
    return Activity;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Suppression')) return 'text-red-600 bg-red-100';
    if (action.includes('Ajout')) return 'text-green-600 bg-green-100';
    if (action.includes('Modification')) return 'text-blue-600 bg-blue-100';
    return 'text-slate-600 bg-slate-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Journal d'activité</h1>
        <p className="text-slate-600">Historique des actions administratives</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        {sortedLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune activité enregistrée</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sortedLogs.map(log => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      <ActionIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-900">
                          {log.action}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mt-1">
                        Par <span className="font-medium">{log.userName}</span>
                      </p>
                      
                      {log.details && (
                        <p className="text-sm text-slate-500 mt-2">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}