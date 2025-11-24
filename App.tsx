import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { ConsentManager } from './views/ConsentManager';
import { ConsentDemo } from './views/ConsentDemo';
import { ArchitectureView } from './components/ArchitectureView';
import { ComplianceMap } from './components/ComplianceMap';
import { DSRManager } from './views/DSRManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                    {activeTab === 'dsr' ? 'DSR Management' : activeTab.replace('-', ' ')}
                </h2>
                <p className="text-sm text-slate-500">DPDP Act 2023 Compliance Module</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">Admin User</div>
                    <div className="text-xs text-slate-500">Data Protection Office</div>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-300">
                    AU
                </div>
            </div>
        </header>

        <div className="animate-fade-in">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'consents' && <ConsentManager />}
            {activeTab === 'capture' && <ConsentDemo />}
            {activeTab === 'schema' && <ArchitectureView />}
            {activeTab === 'compliance' && <ComplianceMap />}
            {activeTab === 'dsr' && <DSRManager />}
        </div>
      </main>
    </div>
  );
}

export default App;