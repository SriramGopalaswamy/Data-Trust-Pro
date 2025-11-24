import React from 'react';
import { ConsentRecord, ConsentHistoryLog } from '../types';
import { MOCK_CONSENT_HISTORY } from '../constants';
import { formatDate } from '../utils/crypto';
import { ArrowLeft, Clock, ShieldCheck, User, Server, Hash, Activity } from 'lucide-react';

interface ConsentHistoryProps {
  consent: ConsentRecord;
  onBack: () => void;
}

export const ConsentHistory: React.FC<ConsentHistoryProps> = ({ consent, onBack }) => {
  // Filter history for this specific consent record
  const history = MOCK_CONSENT_HISTORY.filter(h => h.consentId === consent.id).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h2 className="text-lg font-bold text-slate-900">Consent Audit Trail</h2>
                <p className="text-xs text-slate-500 font-mono">Record ID: {consent.id}</p>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-bold text-slate-900">{consent.principalName}</div>
            <div className="text-xs text-indigo-600 font-medium">{consent.purposeName}</div>
        </div>
      </div>

      <div className="p-8 bg-slate-50/50 min-h-[500px]">
        {history.length === 0 ? (
            <div className="text-center text-slate-500 py-12 flex flex-col items-center">
                <Activity size={48} className="text-slate-300 mb-4" />
                <p>No audit history found for this record.</p>
            </div>
        ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
                {history.map((log) => (
                    <div key={log.id} className="relative pl-8">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            log.action === 'GRANTED' ? 'bg-green-500' :
                            log.action === 'WITHDRAWN' ? 'bg-red-500' :
                            'bg-indigo-500'
                        }`}></div>

                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b border-slate-100">
                                <div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                                        log.action === 'GRANTED' ? 'bg-green-50 text-green-700' :
                                        log.action === 'WITHDRAWN' ? 'bg-red-50 text-red-700' :
                                        'bg-indigo-50 text-indigo-700'
                                    }`}>
                                        {log.action === 'GRANTED' && <ShieldCheck size={12}/>}
                                        {log.action}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500 gap-1 mt-2 sm:mt-0">
                                    <Clock size={14} />
                                    <span className="font-mono">{formatDate(log.timestamp)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {log.actor === 'PRINCIPAL' ? <User size={14} className="text-slate-400"/> : <Server size={14} className="text-slate-400"/>}
                                        <span className="text-xs font-semibold text-slate-700 uppercase">Actor</span>
                                    </div>
                                    <p className="text-sm text-slate-900">{log.actor}</p>
                                    {log.metadata.ip && (
                                        <p className="text-xs text-slate-500 mt-1">IP: {log.metadata.ip}</p>
                                    )}
                                </div>

                                <div>
                                     <div className="flex items-center gap-2 mb-2">
                                        <Activity size={14} className="text-slate-400"/>
                                        <span className="text-xs font-semibold text-slate-700 uppercase">Context</span>
                                    </div>
                                    <p className="text-sm text-slate-900">
                                        {log.reason || (log.action === 'GRANTED' ? 'Initial consent capture via ' + consent.channel : 'System update')}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 p-4 rounded-b-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Hash size={12} className="text-amber-500"/>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Immutable Hash Chain</span>
                                </div>
                                <div className="font-mono text-[10px] text-slate-600 break-all">
                                    {log.previousHash && <span className="text-slate-400">prev: {log.previousHash.substring(0, 16)}... → </span>}
                                    <span className="text-indigo-600 font-medium">{log.newHash}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};