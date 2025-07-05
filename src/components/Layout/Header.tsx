import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  currentUser: UserType;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SERO-EST</h1>
            <p className="text-sm text-slate-300">Gestion Topographique</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-slate-300" />
            <div className="text-right">
              <p className="font-medium">{currentUser.nom}</p>
              <p className="text-xs text-slate-300 capitalize">{currentUser.role}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}