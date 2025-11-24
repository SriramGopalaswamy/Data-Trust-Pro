import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileCheck, AlertTriangle, Clock } from 'lucide-react';

const DATA_CONSENT_SOURCE = [
  { name: 'Web Form', value: 4000 },
  { name: 'Mobile App', value: 3000 },
  { name: 'IVR/Phone', value: 1000 },
  { name: 'Offline', value: 500 },
];

const DATA_TREND = [
  { name: 'Mon', granted: 40, withdrawn: 2 },
  { name: 'Tue', granted: 30, withdrawn: 1 },
  { name: 'Wed', granted: 20, withdrawn: 3 },
  { name: 'Thu', granted: 27, withdrawn: 2 },
  { name: 'Fri', granted: 18, withdrawn: 1 },
  { name: 'Sat', granted: 23, withdrawn: 4 },
  { name: 'Sun', granted: 34, withdrawn: 1 },
];

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#64748b'];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Total Consents" 
                value="8,492" 
                sub="+12% from last month" 
                icon={FileCheck} 
                color="bg-indigo-600" 
            />
             <StatCard 
                title="Data Principals" 
                value="6,201" 
                sub="Unique identities" 
                icon={Users} 
                color="bg-blue-500" 
            />
             <StatCard 
                title="Open DSRs" 
                value="14" 
                sub="3 approaching SLA breach" 
                icon={Clock} 
                color="bg-amber-500" 
            />
             <StatCard 
                title="Stale Records" 
                value="127" 
                sub="Due for retention purge" 
                icon={AlertTriangle} 
                color="bg-rose-500" 
            />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Consent Activity (7 Days)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_TREND}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}}/>
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                                itemStyle={{color: '#fff'}}
                                cursor={{fill: '#f1f5f9'}}
                            />
                            <Bar dataKey="granted" name="Granted" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20}/>
                            <Bar dataKey="withdrawn" name="Withdrawn" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Capture Channels</h3>
                <div className="h-64 w-full flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={DATA_CONSENT_SOURCE}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {DATA_CONSENT_SOURCE.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 pr-8">
                        {DATA_CONSENT_SOURCE.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                                <span>{entry.name}</span>
                                <span className="font-bold">{((entry.value / 8500) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Compliance Alert */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start space-x-3">
            <Info size={20} className="text-indigo-600 mt-0.5" />
            <div>
                <h4 className="text-sm font-bold text-indigo-900">Compliance Health Check</h4>
                <p className="text-xs text-indigo-700 mt-1">
                    Data retention audit completed automatically. 127 records identified for deletion based on 'Purpose Limitation'. 
                    <button className="ml-2 underline hover:text-indigo-900">Run Purge Job</button>
                </p>
            </div>
        </div>
    </div>
  );
};

// Helper for the alert icon
import { Info } from 'lucide-react';