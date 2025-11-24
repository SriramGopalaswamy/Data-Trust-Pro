import React from 'react';
import { MOCK_DSRS } from '../constants';
import { formatDate } from '../utils/crypto';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DSRRequest } from '../types';

export const DSRManager: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kanban Columns for Request Stages */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> New Requests
                </h3>
                {MOCK_DSRS.filter(d => d.status === 'NEW').map(dsr => (
                    <DSRCard key={dsr.id} dsr={dsr} />
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Processing
                </h3>
                {MOCK_DSRS.filter(d => d.status === 'PROCESSING').map(dsr => (
                    <DSRCard key={dsr.id} dsr={dsr} />
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed
                </h3>
                {/* Mock completed items */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center text-slate-500 text-sm py-8">
                    No recently completed requests.
                </div>
            </div>
        </div>
    </div>
  );
};

const DSRCard: React.FC<{ dsr: DSRRequest }> = ({ dsr }) => {
    const isUrgent = new Date(dsr.dueAt).getTime() - new Date().getTime() < 172800000; // 48 hours

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-500">{dsr.id}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                    dsr.type === 'ERASURE' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                    {dsr.type}
                </span>
            </div>
            <h4 className="font-medium text-slate-900">{dsr.principalName}</h4>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>Due: {formatDate(dsr.dueAt)}</span>
            </div>

            {isUrgent && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                    <AlertCircle size={14} />
                    <span className="font-bold">SLA Warning: Action Required</span>
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <button className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded font-medium hover:bg-indigo-700">
                    Process
                </button>
                <button className="flex-1 bg-white border border-slate-300 text-slate-700 text-xs py-1.5 rounded font-medium hover:bg-slate-50">
                    Reject
                </button>
            </div>
        </div>
    );
}