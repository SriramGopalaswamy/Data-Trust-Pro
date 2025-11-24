import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { ConsentManager } from './views/ConsentManager';
import { ConsentDemo } from './views/ConsentDemo';
import { ArchitectureView } from './components/ArchitectureView';
import { ComplianceMap } from './components/ComplianceMap';
import { DSRManager } from './views/DSRManager';
import { UserRole } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');

  // Effect to redirect if current tab is unauthorized when role changes
  useEffect(() => {
    if (userRole === 'AUDITOR') {
        const allowedTabs = ['consents', 'compliance'];
        if (!allowedTabs.includes(activeTab)) {
            setActiveTab('consents');
        }
    }
  }, [userRole, activeTab]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUserRole(e.target.value as UserRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                    {activeTab === 'dsr' ? 'DSR Management' : activeTab.replace('-', ' ')}
                </h2>
                <p className="text-sm text-slate-500">DPDP Act 2023 Compliance Module</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Role View:</span>
                    <select 
                        value={userRole} 
                        onChange={handleRoleChange}
                        className="text-sm font-bold text-indigo-600 bg-transparent outline-none cursor-pointer"
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="AUDITOR">Auditor</option>
                    </select>
                </div>
                
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                            {userRole === 'ADMIN' ? 'Admin User' : 'Compliance Auditor'}
                        </div>
                        <div className="text-xs text-slate-500">
                            {userRole === 'ADMIN' ? 'Data Protection Office' : 'External Audit Firm'}
                        </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                        userRole === 'ADMIN' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}>
                        {userRole === 'ADMIN' ? 'AD' : 'AU'}
                    </div>
                </div>
            </div>
        </header>

        <div className="animate-fade-in">
            {activeTab === 'dashboard' && userRole === 'ADMIN' && <Dashboard />}
            {activeTab === 'consents' && <ConsentManager role={userRole} />}
            {activeTab === 'capture' && userRole === 'ADMIN' && <ConsentDemo />}
            {activeTab === 'schema' && userRole === 'ADMIN' && <ArchitectureView />}
            {activeTab === 'compliance' && <ComplianceMap />}
            {activeTab === 'dsr' && userRole === 'ADMIN' && <DSRManager />}
        </div>
      </main>
    </div>
  );
}

export default App;