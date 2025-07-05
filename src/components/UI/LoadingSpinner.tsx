import React from 'react';
import { Construction } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Construction className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">SERO-EST</h1>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-slate-300 mt-2">Chargement...</p>
      </div>
    </div>
  );
}