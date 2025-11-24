
import React, { useState, useEffect } from 'react';
import { generateSHA256, generateFileHash } from '../utils/crypto';
import { ShieldCheck, Info, CheckCircle, ArrowRight, ArrowLeft, Upload, Smartphone, MessageSquare, AlertCircle } from 'lucide-react';

export const ConsentDemo: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consents, setConsents] = useState({ marketing: false, analytics: false });
  const [artifacts, setArtifacts] = useState<{marketing?: {name: string, hash: string}, analytics?: {name: string, hash: string}}>({});
  const [meta, setMeta] = useState<any>(null);
  const [proof, setProof] = useState<{raw: any, hash: string} | null>(null);
  const [step, setStep] = useState(1); // 1: Identity, 2: Consent, 3: Evidence, 4: Proof
  const [withdrawalProof, setWithdrawalProof] = useState<{timestamp: string, hash: string} | null>(null);

  // SMS Verification State
  const [marketingMethod, setMarketingMethod] = useState<'UPLOAD' | 'SMS'>('UPLOAD');
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<'IDLE' | 'SENT' | 'VERIFIED'>('IDLE');

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

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFileUpload = async (key: 'marketing' | 'analytics', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const hash = await generateFileHash(file);
        setArtifacts(prev => ({
            ...prev,
            [key]: { name: file.name, hash: hash }
        }));
    }
  };

  const toggleMarketingMethod = (method: 'UPLOAD' | 'SMS') => {
      setMarketingMethod(method);
      // Clear existing marketing artifact to enforce new proof
      setArtifacts(prev => {
          const next = { ...prev };
          delete next.marketing;
          return next;
      });
      setOtpState('IDLE');
      setOtp('');
  };

  const handleSendOtp = () => {
      setOtpState('SENT');
      // Simulate SMS delay
      setTimeout(() => {
          alert(`[DEMO] SMS Verification Code for ${formData.phone}: 482910`);
      }, 600);
  };

  const handleVerifyOtp = async () => {
      if (otp === '482910') {
          const timestamp = new Date().toISOString();
          const verificationLog = `SMS_VERIFIED|${formData.phone}|${timestamp}|SUCCESS`;
          const hash = await generateSHA256(verificationLog);
          
          setArtifacts(prev => ({
              ...prev,
              marketing: { name: `SMS_LOG_${timestamp}.txt`, hash: hash }
          }));
          setOtpState('VERIFIED');
      } else {
          alert('Invalid code. Please use 482910');
      }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the Artifact
    const artifact = {
      principal: formData,
      consents_granted: consents,
      evidence: artifacts,
      notice_version: "v2.4_2023_10_01", // The displayed version
      metadata: { ...meta, capture_time: new Date().toISOString() },
      channel: marketingMethod === 'SMS' && consents.marketing ? "WEB_SMS_VERIFIED" : "WEB_FORM"
    };

    // Generate Hash (Proof)
    const jsonString = JSON.stringify(artifact);
    const hash = await generateSHA256(jsonString);

    setProof({
      raw: artifact,
      hash: hash
    });
    setStep(4);
  };

  const handleWithdrawDemo = async () => {
      if (!proof) return;
      
      const timestamp = new Date().toISOString();
      // Section 6(4) requirement: immediate effect, proof of withdrawal
      const withdrawalRecord = {
          original_consent_hash: proof.hash,
          principal_id: formData.email,
          action: "WITHDRAW",
          timestamp: timestamp,
          reason: "User requested via demo portal"
      };
      
      const hash = await generateSHA256(JSON.stringify(withdrawalRecord));
      setWithdrawalProof({
          timestamp,
          hash
      });
  };

  const isEvidenceComplete = () => {
      if (consents.marketing && !artifacts.marketing) return false;
      if (consents.analytics && !artifacts.analytics) return false;
      return true;
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: User Facing Form */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-indigo-200" /> 
            Secure Sign-up
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Example of DPDP-compliant capture flow</p>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-100">
            <div className={`flex-1 p-3 text-center text-xs font-bold ${step >= 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>1. Identity</div>
            <div className={`flex-1 p-3 text-center text-xs font-bold ${step >= 2 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>2. Consent</div>
            <div className={`flex-1 p-3 text-center text-xs font-bold ${step >= 3 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>3. Evidence</div>
            <div className={`flex-1 p-3 text-center text-xs font-bold ${step >= 4 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>4. Proof</div>
        </div>
        
        <div className="p-8 flex-1">
          {step === 1 && (
            <form onSubmit={handleIdentitySubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    autoComplete="name"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Anjali Singh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    autoComplete="email"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="anjali@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    autoComplete="tel"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
             <form onSubmit={handleConsentSubmit} className="space-y-6">
               
               <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Verifying Identity For</h4>
                  <div className="text-sm text-slate-900 font-medium">{formData.name}</div>
                  <div className="text-xs text-slate-500">{formData.email} • {formData.phone}</div>
               </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                   Privacy Notice <span className="ml-2 text-[10px] font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">v2.4</span>
                </h3>
                <div className="text-xs text-slate-500 h-32 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                  <p><strong>1. Purpose:</strong> We collect your name, email, and phone to provide service updates and, if consented, marketing offers.</p>
                  <p className="mt-2"><strong>2. Retention:</strong> Data is retained for 12 months unless withdrawn.</p>
                  <p className="mt-2"><strong>3. Rights:</strong> Access or withdraw consent via our portal.</p>
                  <p className="mt-2"><strong>4. Contact:</strong> DPO@datatrust.com for grievances.</p>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${consents.marketing ? 'bg-indigo-50 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      checked={consents.marketing}
                      onChange={() => handleConsentChange('marketing')}
                    />
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">Marketing Updates</span>
                      <p className="text-slate-500 text-xs mt-0.5">Receive offers via Email/SMS.</p>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${consents.analytics ? 'bg-indigo-50 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      checked={consents.analytics}
                      onChange={() => handleConsentChange('analytics')}
                    />
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">Product Analytics</span>
                      <p className="text-slate-500 text-xs mt-0.5">Allow usage tracking for improvements.</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button 
                        type="submit" 
                        disabled={!consents.marketing && !consents.analytics}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Next: Evidence <ArrowRight size={16} />
                    </button>
                </div>
            </form>
          )}

          {step === 3 && (
             <form onSubmit={handleFinalSubmit} className="space-y-6">
               <div className="bg-amber-50 p-4 rounded border border-amber-200 mb-6 flex gap-3">
                  <Info className="text-amber-600 flex-shrink-0" size={20} />
                  <div>
                      <h4 className="text-sm font-bold text-amber-800">Proof of Consent Required</h4>
                      <p className="text-xs text-amber-700 mt-1">
                          For compliance with DPDP Act, please upload supporting evidence or complete verification challenges.
                      </p>
                  </div>
               </div>

               <div className="space-y-6">
                   {consents.marketing && (
                       <div className="border border-slate-200 rounded-lg p-4">
                           <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-slate-900">Evidence for Marketing Updates</h4>
                                <div className="flex bg-slate-100 rounded p-1">
                                    <button 
                                        type="button"
                                        onClick={() => toggleMarketingMethod('UPLOAD')}
                                        className={`p-1.5 rounded transition-colors ${marketingMethod === 'UPLOAD' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        title="Upload File"
                                    >
                                        <Upload size={16} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => toggleMarketingMethod('SMS')}
                                        className={`p-1.5 rounded transition-colors ${marketingMethod === 'SMS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        title="SMS Verification"
                                    >
                                        <Smartphone size={16} />
                                    </button>
                                </div>
                           </div>

                           {marketingMethod === 'UPLOAD' ? (
                               <>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="file" 
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        onChange={(e) => handleFileUpload('marketing', e)}
                                    />
                                    {artifacts.marketing && <CheckCircle className="text-green-500" size={20} />}
                                </div>
                                {artifacts.marketing && <div className="text-[10px] text-slate-400 font-mono mt-1 break-all">Hash: {artifacts.marketing.hash.substring(0, 30)}...</div>}
                               </>
                           ) : (
                               <div className="bg-slate-50 p-3 rounded border border-slate-200">
                                   {otpState === 'IDLE' && (
                                       <div className="flex justify-between items-center">
                                           <span className="text-sm text-slate-600">Verify mobile number <strong>{formData.phone}</strong></span>
                                           <button 
                                                type="button"
                                                onClick={handleSendOtp}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 flex items-center gap-1"
                                            >
                                                <MessageSquare size={14} /> Send OTP
                                            </button>
                                       </div>
                                   )}
                                   {(otpState === 'SENT' || otpState === 'VERIFIED') && (
                                       <div className="space-y-3">
                                           <div className="flex items-center gap-2">
                                                <input 
                                                    type="text" 
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit code"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    disabled={otpState === 'VERIFIED'}
                                                    className="border border-slate-300 rounded px-2 py-1 text-sm w-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                                {otpState === 'SENT' && (
                                                    <button 
                                                        type="button"
                                                        onClick={handleVerifyOtp}
                                                        className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {otpState === 'VERIFIED' && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Verified</span>}
                                           </div>
                                           {otpState === 'VERIFIED' && artifacts.marketing && (
                                                <div className="text-[10px] text-slate-400 font-mono break-all">
                                                    Hash: {artifacts.marketing.hash.substring(0, 30)}...
                                                </div>
                                           )}
                                       </div>
                                   )}
                               </div>
                           )}
                           
                       </div>
                   )}

                   {consents.analytics && (
                       <div className="border border-slate-200 rounded-lg p-4">
                           <h4 className="font-medium text-slate-900 mb-2">Evidence for Product Analytics</h4>
                           <div className="flex items-center gap-3">
                               <input 
                                    type="file" 
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => handleFileUpload('analytics', e)}
                                />
                                {artifacts.analytics && <CheckCircle className="text-green-500" size={20} />}
                           </div>
                           {artifacts.analytics && <div className="text-[10px] text-slate-400 font-mono mt-1 break-all">Hash: {artifacts.analytics.hash.substring(0, 30)}...</div>}
                       </div>
                   )}
               </div>

                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="w-1/3 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button 
                        type="submit" 
                        disabled={!isEvidenceComplete()}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Finalize & Record
                    </button>
                </div>
             </form>
          )}
          
          {step === 4 && (
            <div className="text-center py-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${withdrawalProof ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                {withdrawalProof ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                  {withdrawalProof ? 'Consent Withdrawn' : 'Consent Recorded'}
              </h3>
              <p className="text-slate-600 mt-2 text-sm">
                  {withdrawalProof 
                    ? 'Processing has been stopped. Withdrawal proof generated.' 
                    : 'A verifiable proof artifact has been generated and stored.'}
              </p>
              
              {!withdrawalProof ? (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={handleWithdrawDemo}
                        className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-red-200"
                    >
                        Simulate Withdrawal (Section 6(4))
                    </button>
                  </div>
              ) : (
                   <div className="mt-6 text-left bg-slate-50 p-3 rounded border border-slate-200">
                       <div className="text-xs font-bold text-slate-500 uppercase mb-1">Withdrawal Log Hash</div>
                       <div className="font-mono text-[10px] text-slate-700 break-all">{withdrawalProof.hash}</div>
                       <div className="text-[10px] text-slate-400 mt-1">{withdrawalProof.timestamp}</div>
                   </div>
              )}

              <button 
                onClick={() => {
                    setStep(1); 
                    setFormData({name:'', email:'', phone:''}); 
                    setConsents({marketing:false, analytics:false});
                    setArtifacts({});
                    setProof(null);
                    setMarketingMethod('UPLOAD');
                    setOtpState('IDLE');
                    setOtp('');
                    setWithdrawalProof(null);
                }}
                className="mt-6 text-indigo-600 font-medium text-sm hover:underline block mx-auto"
              >
                Start New Capture
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
                <label className="text-xs font-semibold uppercase text-slate-500">Live Context</label>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div className="bg-black/30 p-2 rounded">Step: {step}/4</div>
                    <div className="bg-black/30 p-2 rounded">IP: {meta?.ip || '...'}</div>
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Input Stream</label>
                <pre className="mt-2 text-[10px] font-mono bg-black/50 p-3 rounded text-emerald-400 overflow-x-auto">
                    {JSON.stringify({ ...formData, ...consents, marketing_method: marketingMethod }, null, 2)}
                </pre>
            </div>

            {Object.keys(artifacts).length > 0 && (
                <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Evidence Hashes</label>
                    <div className="mt-2 space-y-1">
                        {Object.entries(artifacts).map(([k, v]) => {
                           const artifact = v as { name: string, hash: string } | undefined;
                           if (!artifact) return null;
                           return (
                            <div key={k} className="bg-black/30 p-2 rounded flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 uppercase">{k}</span>
                                <span className="text-[10px] font-mono text-amber-400">{artifact.hash.substring(0, 12)}...</span>
                            </div>
                        )})}
                    </div>
                </div>
            )}

            {step === 4 && proof && (
                <>
                    <div className="pt-4 border-t border-slate-800">
                        <label className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-amber-500"/> Final Artifact
                        </label>
                        <pre className="mt-2 text-[10px] font-mono bg-black/50 p-3 rounded text-blue-300 overflow-x-auto h-64 scrollbar-hide">
                            {JSON.stringify(proof.raw, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Proof Hash</label>
                        <div className="mt-2 text-[10px] font-mono bg-slate-800 p-3 rounded text-amber-400 break-all border border-slate-700">
                            {proof.hash}
                        </div>
                    </div>
                </>
            )}
            
            {withdrawalProof && (
                <div className="pt-4 border-t border-slate-800">
                     <label className="text-xs font-semibold uppercase text-red-500 flex items-center gap-2">
                            <AlertCircle size={12}/> Withdrawal Audit Log
                    </label>
                    <div className="mt-2 text-[10px] font-mono bg-slate-800 p-3 rounded text-red-400 break-all border border-slate-700">
                        {withdrawalProof.hash}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
