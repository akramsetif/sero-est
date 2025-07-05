import React from 'react';
import { BarChart3, Users, FolderOpen, Settings, FileText, Activity } from 'lucide-react';

type TabType = 'dashboard' | 'reports' | 'users' | 'projects' | 'settings' | 'logs';

interface AdminTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMainAdmin: boolean;
}

export default function AdminTabs({ activeTab, onTabChange, isMainAdmin }: AdminTabsProps) {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'reports' as TabType, label: 'Rapports', icon: FileText },
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users, adminOnly: true },
    { id: 'projects' as TabType, label: 'Projets', icon: FolderOpen, adminOnly: true },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Settings, adminOnly: true },
    { id: 'logs' as TabType, label: 'Journal', icon: Activity, adminOnly: true }
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isMainAdmin);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8 overflow-x-auto">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}