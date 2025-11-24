import React, { useState } from 'react';
import { MOCK_CONSENTS } from '../constants';
import { ConsentStatus } from '../types';
import { formatDate } from '../utils/crypto';
import { Eye, Download, Trash2 } from 'lucide-react';

export const ConsentManager: React.FC = () => {
  const [consents, setConsents] = useState(MOCK_CONSENTS);

  const handleWithdraw = (id: string) => {
    if (!window.confirm('Are you sure? This will trigger the immediate cessation workflow.')) return;
    setConsents(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: ConsentStatus.WITHDRAWN, retentionDate: new Date().toISOString() } 
        : c
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-slate-900">Consent Repository</h2>
            <p className="text-xs text-slate-500">Master ledger of all principal consents</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 flex items-center gap-2">
                <Download size={16} /> Export CSV
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Record ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Principal</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Captured At</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {consents.map(consent => (
                    <tr key={consent.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-600">{consent.id}</td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{consent.principalName}</div>
                            <div className="text-xs text-slate-500">{consent.principalId}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                            {consent.purposeName}
                            <span className="block text-[10px] text-slate-400 mt-0.5">{consent.version}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">{formatDate(consent.timestamp)}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 text-[10px] font-medium bg-slate-100 text-slate-600 rounded uppercase">
                                {consent.channel}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${
                                consent.status === ConsentStatus.ACTIVE 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {consent.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button className="text-slate-400 hover:text-indigo-600" title="View Proof Artifact">
                                    <Eye size={16} />
                                </button>
                                {consent.status === ConsentStatus.ACTIVE && (
                                    <button 
                                        onClick={() => handleWithdraw(consent.id)}
                                        className="text-slate-400 hover:text-red-600" 
                                        title="Revoke Consent (Section 6(4))"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};