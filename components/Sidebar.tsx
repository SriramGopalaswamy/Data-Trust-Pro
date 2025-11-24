import React from 'react';
import { LayoutDashboard, FileText, Users, ShieldAlert, Database, BookOpen } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'consents', label: 'Consent Manager', icon: FileText, roles: ['ADMIN', 'AUDITOR'] },
    { id: 'capture', label: 'Live Capture Demo', icon: Users, roles: ['ADMIN'] },
    { id: 'dsr', label: 'DSR Workflow', icon: ShieldAlert, roles: ['ADMIN'] },
    { id: 'schema', label: 'System Design', icon: Database, roles: ['ADMIN'] },
    { id: 'compliance', label: 'Compliance Map', icon: BookOpen, roles: ['ADMIN', 'AUDITOR'] },
  ];

  // Filter items based on current role
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-10">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
            <h1 className="font-bold text-white tracking-tight">DataTrust <span className="text-indigo-400">Pro</span></h1>
        </div>
        <p className="text-xs text-slate-500 mt-2">DPDP Compliance Engine</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded p-3">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">System Status</div>
            <div className="flex items-center justify-between text-xs">
                <span>Encryption</span>
                <span className="text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
                <span>Audit Log</span>
                <span className="text-green-400">Immutable</span>
            </div>
             {role === 'AUDITOR' && (
                <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-amber-500 font-mono">
                    Mode: READ-ONLY
                </div>
            )}
        </div>
      </div>
    </div>
  );
};