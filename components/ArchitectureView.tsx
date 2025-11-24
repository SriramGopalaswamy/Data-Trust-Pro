import React, { useState } from 'react';
import { Server, Database, Shield, Globe, Lock, ArrowRight, Code } from 'lucide-react';
import { DDL_ARTIFACT, API_SPEC_ARTIFACT } from '../constants';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ddl' | 'api' | 'diagram'>('diagram');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">System Architecture & Design</h2>
        
        <div className="flex space-x-4 border-b border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('diagram')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'diagram' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            High-Level Design
          </button>
          <button 
            onClick={() => setActiveTab('ddl')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ddl' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Database Schema (DDL)
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'api' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            API Specification
          </button>
        </div>

        {activeTab === 'diagram' && (
          <div className="space-y-8">
            {/* Flow Diagram Visual */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-4 w-full justify-center">
                {/* Source */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
                    <Globe className="text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Data Principal</span>
                </div>

                <ArrowRight className="text-slate-300" />

                {/* API Gateway */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-24 h-24 bg-indigo-50 border-2 border-indigo-200 rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <Server className="text-indigo-600 mb-1" />
                    <span className="text-[10px] text-indigo-800 font-bold">API Gateway</span>
                    <span className="text-[9px] text-slate-500">Rate Limit / WAF</span>
                  </div>
                </div>

                <ArrowRight className="text-slate-300" />

                {/* Core Service */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-32 h-32 bg-white border-2 border-slate-300 rounded-lg flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <Shield className="text-green-600 mb-2" size={28} />
                    <span className="text-xs font-bold text-slate-800">Consent Service</span>
                    <span className="text-[9px] text-slate-500 mt-1 px-2 text-center">Hash Proof Generation</span>
                  </div>
                </div>

                <ArrowRight className="text-slate-300" />

                {/* Storage Layer */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Database className="text-slate-400" size={16} />
                    <div className="px-3 py-2 bg-slate-800 text-slate-100 rounded text-xs w-32 text-center">PostgreSQL (Encrypted)</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="text-slate-400" size={16} />
                    <div className="px-3 py-2 bg-slate-800 text-slate-100 rounded text-xs w-32 text-center">Immutable Log</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="text-slate-400" size={16} />
                    <div className="px-3 py-2 bg-slate-800 text-slate-100 rounded text-xs w-32 text-center">S3 Artifacts (WORM)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-bold text-amber-800 text-sm mb-2 flex items-center"><Lock size={14} className="mr-2"/> Security Architecture</h3>
                    <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                        <li><strong>VPC Isolation:</strong> DB in private subnet, no public IP.</li>
                        <li><strong>Encryption:</strong> AES-256 for DB columns (names, contacts).</li>
                        <li><strong>KMS:</strong> Master keys rotated monthly.</li>
                        <li><strong>WORM Storage:</strong> Consent artifacts stored in "Write-Once-Read-Many" S3 buckets.</li>
                    </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-800 text-sm mb-2 flex items-center"><Database size={14} className="mr-2"/> Data Partitioning</h3>
                    <ul className="list-disc list-inside text-xs text-blue-900 space-y-1">
                        <li><strong>Partition Key:</strong> Date (Month/Year).</li>
                        <li><strong>Archival:</strong> Auto-move expired consents (> 7 years) to cold storage.</li>
                        <li><strong>Read Replicas:</strong> Separate read path for Analytics/Reporting.</li>
                    </ul>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'ddl' && (
          <div className="relative group">
            <pre className="bg-slate-900 text-slate-50 p-6 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
              {DDL_ARTIFACT}
            </pre>
          </div>
        )}

        {activeTab === 'api' && (
            <div className="relative group">
            <pre className="bg-slate-900 text-emerald-400 p-6 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
              {API_SPEC_ARTIFACT}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};