import React, { useState, useEffect } from 'react';
import { generateSHA256 } from '../utils/crypto';
import { ShieldCheck, Info, CheckCircle } from 'lucide-react';

export const ConsentDemo: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consents, setConsents] = useState({ marketing: false, analytics: false });
  const [meta, setMeta] = useState<any>(null);
  const [proof, setProof] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Simulate collecting Metadata on mount
  useEffect(() => {
    const collectMeta = async () => {
      const res = await fetch('https://api.ipify.org?format=json').catch(() => ({ json: () => ({ ip: '127.0.0.1' }) }));
      const ipData = await res.json();
      
      setMeta({
        ip: ipData.ip,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'direct'
      });
    };
    collectMeta();
  }, []);

  const handleConsentChange = (key: 'marketing' | 'analytics') => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the Artifact
    const artifact = {
      principal: formData,
      consents_granted: consents,
      notice_version: "v2.4_2023_10_01", // The displayed version
      metadata: { ...meta, capture_time: new Date().toISOString() },
      channel: "WEB_FORM"
    };

    // Generate Hash (Proof)
    const jsonString = JSON.stringify(artifact);
    const hash = await generateSHA256(jsonString);

    setProof({
      raw: artifact,
      hash: hash
    });
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: User Facing Form */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-indigo-200" /> 
            Secure Sign-up
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Example of DPDP-compliant capture flow</p>
        </div>
        
        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                   Privacy Notice <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">v2.4</span>
                </h3>
                <div className="text-xs text-slate-500 h-24 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200 mb-4">
                  <p><strong>1. Purpose:</strong> We collect your name and email to send you our weekly newsletter (Purpose A) and product updates.</p>
                  <p className="mt-2"><strong>2. Data Processing:</strong> Your data is stored in India. We do not sell your data.</p>
                  <p className="mt-2"><strong>3. Your Rights:</strong> You may withdraw consent at any time via the unsubscribe link or our DSR portal.</p>
                  <p className="mt-2"><strong>4. Grievance Officer:</strong> Contact privacy@datatrust.com.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      checked={consents.marketing}
                      onChange={() => handleConsentChange('marketing')}
                    />
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">I agree to receive marketing newsletters.</span>
                      <p className="text-slate-500 text-xs mt-0.5">Optional. Valid for 12 months.</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      checked={consents.analytics}
                      onChange={() => handleConsentChange('analytics')}
                    />
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">I agree to usage analytics.</span>
                      <p className="text-slate-500 text-xs mt-0.5">Helps us improve. Anonymized after 6 months.</p>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!consents.marketing && !consents.analytics}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Confirm & Grant Consent
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Consent Recorded</h3>
              <p className="text-slate-600 mt-2 text-sm">A verifiable proof artifact has been generated.</p>
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-indigo-600 font-medium text-sm hover:underline"
              >
                Reset Demo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Backend Simulation / Code View */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-300">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
             <Info size={16} /> System Internals
          </h3>
          
          <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Detected Metadata (Auto-captured)</label>
                <pre className="mt-2 text-[10px] font-mono bg-black/50 p-3 rounded text-emerald-400 overflow-x-auto">
                    {JSON.stringify(meta, null, 2) || 'Waiting for initialization...'}
                </pre>
            </div>

            {step === 2 && proof && (
                <>
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Generated Artifact (JSON)</label>
                        <pre className="mt-2 text-[10px] font-mono bg-black/50 p-3 rounded text-blue-300 overflow-x-auto h-48 scrollbar-hide">
                            {JSON.stringify(proof.raw, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Immutable Proof Hash (SHA-256)</label>
                        <div className="mt-2 text-[10px] font-mono bg-slate-800 p-3 rounded text-amber-400 break-all border border-slate-700">
                            {proof.hash}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                            *This hash is stored in the DB and can be written to a blockchain ledger for non-repudiation.
                        </p>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};