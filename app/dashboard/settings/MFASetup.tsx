'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle, AlertTriangle, Shield, Copy } from 'lucide-react';

export default function MFASetup() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  
  const [enrollmentStep, setEnrollmentStep] = useState<'idle' | 'qr' | 'verify'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Check if already enrolled
  useEffect(() => {
    async function checkMFA() {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        console.error('Error fetching factors:', error);
        setLoading(false);
        return;
      }
      const totpFactor = data.totp.find(f => f.status === 'verified');
      if (totpFactor) {
        setEnrolled(true);
        setFactorId(totpFactor.id);
      }
      setLoading(false);
    }
    checkMFA();
  }, [supabase]);

  // 2. Start Enrollment
  const startEnrollment = async () => {
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrollmentStep('qr');
    setLoading(false);
  };

  // 3. Verify Code
  const verifyEnrollment = async () => {
    if (!factorId) return;
    setLoading(true);
    setError('');
    
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setError(challenge.error.message);
      setLoading(false);
      return;
    }
    
    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: verifyCode
    });
    
    if (verify.error) {
      setError('Invalid code. Please try again.');
      setLoading(false);
      return;
    }
    
    setEnrolled(true);
    setEnrollmentStep('idle');
    setSuccess('Two-Factor Authentication enabled successfully!');
    setLoading(false);
  };

  // 4. Unenroll
  const unenroll = async () => {
    if (!factorId) return;
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    setEnrolled(false);
    setFactorId(null);
    setSuccess('Two-Factor Authentication disabled.');
    setLoading(false);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md transition-all">
      <h2 className="text-headline-sm text-on-surface">Security Baseline</h2>
      
      <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
        <div className="flex items-center gap-md">
          <Shield size={20} className={enrolled ? "text-primary" : "text-primary-fixed-dim"} />
          <div>
            <span className="text-label-md text-on-surface font-bold">Two-Factor Authentication</span>
            <p className="text-body-md text-on-surface-variant">
              {loading && !enrolled && !enrollmentStep ? 'Checking...' : (enrolled ? 'Configured and active' : 'Not configured')}
            </p>
          </div>
        </div>
        
        {!enrolled && enrollmentStep === 'idle' && (
          <button 
            onClick={startEnrollment}
            disabled={loading}
            className="px-md py-xs border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center gap-xs disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Configure'}
          </button>
        )}
        
        {enrolled && (
          <button 
            onClick={unenroll}
            disabled={loading}
            className="px-md py-xs border border-error/30 text-error rounded-lg text-label-md hover:bg-error/10 transition-colors flex items-center gap-xs disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Disable'}
          </button>
        )}
      </div>

      {success && (
        <p className="text-primary text-label-sm flex items-center gap-xs mt-sm px-sm">
          <CheckCircle size={14} /> {success}
        </p>
      )}

      {error && (
        <p className="text-error text-label-sm flex items-center gap-xs mt-sm px-sm">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {enrollmentStep === 'qr' && (
        <div className="mt-md p-md border border-outline-variant/20 rounded-lg animate-fade-in bg-surface">
          <h3 className="text-label-lg font-bold text-on-surface mb-sm">Scan QR Code</h3>
          <p className="text-body-sm text-on-surface-variant mb-md">
            Scan this QR code with an authenticator app like Google Authenticator or Authy.
          </p>
          
          <div className="flex flex-col md:flex-row gap-lg items-center">
            <div 
              className="bg-white p-2 rounded-lg [&>svg]:w-32 [&>svg]:h-32"
              dangerouslySetInnerHTML={{ __html: qrCode }} 
            />
            
            <div className="space-y-md flex-1 w-full">
              <div>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold">Manual Entry Secret</span>
                <div className="flex items-center gap-xs bg-surface-container-high p-xs rounded font-mono text-sm text-on-surface mt-1">
                  <span className="truncate max-w-[150px]">{secret}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(secret)}
                    className="p-1 hover:bg-surface-variant rounded text-on-surface-variant ml-auto"
                    title="Copy secret"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-label-sm font-bold mb-xs">Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-surface-container-high border border-outline-variant/30 px-sm py-sm text-on-surface text-center tracking-[0.5em] text-title-md rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              
              <div className="flex gap-sm">
                <button 
                  onClick={() => { setEnrollmentStep('idle'); setError(''); }}
                  className="flex-1 py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={verifyEnrollment}
                  disabled={verifyCode.length !== 6 || loading}
                  className="flex-1 py-sm bg-primary-container text-on-primary-container rounded-lg font-bold text-label-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-sm"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
