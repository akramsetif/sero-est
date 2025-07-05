import { Rapport } from '../types';

export const exportToExcel = (rapports: Rapport[], filename?: string) => {
  const data = rapports.map(rapport => ({
    'Date': new Date(rapport.date).toLocaleDateString('fr-FR'),
    'Topographe': rapport.userName,
    'Projet': rapport.projetNom,
    'Phase': rapport.phaseNom === 'Autre' ? rapport.phaseAutre || 'Autre' : rapport.phaseNom,
    'Type Structure': rapport.typeStructure === 'pile' ? 'Pile' : 'Culée',
    'N° Structure': rapport.numeroStructure,
    'Tâches': rapport.taches.join(', '),
    'Station': rapport.stationNom,
    'Remarques': rapport.remarques
  }));

  const csvContent = [
    Object.keys(data[0] || {}).join(','),
    ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `SERO-EST_Rapports_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (rapports: Rapport[], filename?: string) => {
  // Simple PDF export using window.print for now
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SERO-EST - Rapports Topographiques</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1e293b; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .header { text-align: center; margin-bottom: 20px; }
        .date { color: #64748b; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SERO-EST - Rapports Topographiques</h1>
        <p class="date">Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Topographe</th>
            <th>Projet</th>
            <th>Phase</th>
            <th>Type</th>
            <th>N° Struct.</th>
            <th>Tâches</th>
            <th>Station</th>
            <th>Remarques</th>
          </tr>
        </thead>
        <tbody>
          ${rapports.map(rapport => `
            <tr>
              <td>${new Date(rapport.date).toLocaleDateString('fr-FR')}</td>
              <td>${rapport.userName}</td>
              <td>${rapport.projetNom}</td>
              <td>${rapport.phaseNom === 'Autre' ? rapport.phaseAutre || 'Autre' : rapport.phaseNom}</td>
              <td>${rapport.typeStructure === 'pile' ? 'Pile' : 'Culée'}</td>
              <td>${rapport.numeroStructure}</td>
              <td>${rapport.taches.join(', ')}</td>
              <td>${rapport.stationNom}</td>
              <td>${rapport.remarques}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};