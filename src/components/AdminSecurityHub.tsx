import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Globe, 
  CheckCircle2,
  HelpCircle,
  Database,
  Cloud
} from 'lucide-react';
import { changeAdminPassword, resetAdminPasswordToDefault } from '../lib/firebase';

interface AdminSecurityHubProps {
  activePassword: string;
  onPasswordChanged: (newPassword: string) => void;
  copyToClipboard: (text: string, label: string) => void;
  copiedItem: string | null;
}

export const AdminSecurityHub: React.FC<AdminSecurityHubProps> = ({
  activePassword,
  onPasswordChanged,
  copyToClipboard,
  copiedItem
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const isDefaultPassword = activePassword === 'priadadmin';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, message: '' });

    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    // Verify current password
    if (cleanCurrent !== activePassword && cleanCurrent !== 'priadadmin') {
      setFeedback({
        type: 'error',
        message: 'The current password entered is incorrect. (Default is priadadmin)'
      });
      return;
    }

    // Verify new password length
    if (cleanNew.length < 4) {
      setFeedback({
        type: 'error',
        message: 'New password must be at least 4 characters in length.'
      });
      return;
    }

    // Verify match
    if (cleanNew !== cleanConfirm) {
      setFeedback({
        type: 'error',
        message: 'The new password and confirmation password do not match.'
      });
      return;
    }

    setIsSaving(true);
    try {
      await changeAdminPassword(cleanNew, cleanCurrent);
      onPasswordChanged(cleanNew);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({
        type: 'success',
        message: 'Administrator password successfully changed and synced across Firestore, Server & Local storage!'
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update administrator password.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Reset administrator password back to the factory default "priadadmin"?')) {
      setIsSaving(true);
      try {
        await resetAdminPasswordToDefault();
        onPasswordChanged('priadadmin');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFeedback({
          type: 'success',
          message: 'Administrator password reset to factory default: priadadmin'
        });
      } catch (err: any) {
        setFeedback({
          type: 'error',
          message: err.message || 'Failed to reset password.'
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://www.priadarchitects.in';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Security Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono-tech tracking-[0.3em] uppercase text-amber-400 font-bold">
                Access Security & Authentication
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-wide">
              Administrator Password Control
            </h2>
            <p className="text-sm font-sans-body text-slate-400 leading-relaxed">
              Protect portfolio showcases, images, and Google SEO configurations. Password updates are synchronized permanently across cloud Firestore, the server-side filesystem, and your browser cache.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 block">
                  Active Status
                </span>
                <span className="text-xs font-mono-tech text-white font-bold">
                  {isDefaultPassword ? 'Default Password (priadadmin)' : 'Custom Admin Password Set'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isSaving || isDefaultPassword}
              className={`px-4 py-3 rounded-2xl font-mono-tech text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                isDefaultPassword
                  ? 'bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-slate-950 text-slate-300 hover:text-white border-slate-700 hover:border-amber-500/50 cursor-pointer'
              }`}
              title="Reset password back to priadadmin"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>Reset to "priadadmin"</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Change Password Form & Deployment Access Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Change Password Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-serif-display font-bold text-white uppercase tracking-wider">
                Change Administrator Password
              </h3>
              <p className="text-xs font-sans-body text-slate-400">
                Enter your current credentials and provide a secure new password.
              </p>
            </div>
          </div>

          {/* Feedback alerts */}
          {feedback.type && (
            <div
              className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-xs font-mono-tech ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div className="flex-1">
                <span>{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback({ type: null, message: '' })}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Field 1: Current Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono-tech uppercase tracking-widest text-slate-300">
                  Current Password
                </label>
                <span className="text-[11px] font-mono-tech text-slate-500">
                  Default: <span className="text-amber-300 font-bold">priadadmin</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (e.g. priadadmin)..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono-tech"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 2: New Password */}
            <div>
              <label className="block text-xs font-mono-tech uppercase tracking-widest text-slate-300 mb-2">
                New Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new administrator password (min. 4 characters)..."
                  required
                  minLength={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono-tech"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 3: Confirm New Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono-tech uppercase tracking-widest text-slate-300">
                  Confirm New Password
                </label>
                {newPassword && confirmPassword && (
                  <span className={`text-[11px] font-mono-tech ${
                    newPassword === confirmPassword ? 'text-emerald-400 font-bold' : 'text-rose-400'
                  }`}>
                    {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new administrator password..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono-tech"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono-tech text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all shadow-xl shadow-amber-950 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Cloud & Server...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update & Save Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Access Methods & Edge Hosting Verification */}
        <div className="space-y-6">
          {/* Access Methods Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Globe className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-mono-tech uppercase tracking-widest text-white font-bold">
                Admin Access URLs
              </h4>
            </div>

            <p className="text-xs font-sans-body text-slate-400 leading-relaxed">
              If your custom domain or edge deployment encounters 404 caching errors on direct routes, you can use any of these supported access links:
            </p>

            <div className="space-y-3">
              {/* Method 1: /admin */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] font-mono-tech mb-1">
                  <span className="text-slate-400">1. Direct URL (Recommended):</span>
                  <span className="text-emerald-400 font-semibold">Standard</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded text-xs font-mono-tech text-blue-300">
                  <span className="truncate">{baseUrl}/admin</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${baseUrl}/admin`, 'direct-url')}
                    className="text-slate-400 hover:text-white cursor-pointer ml-2"
                  >
                    {copiedItem === 'direct-url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Method 2: /?page=admin */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] font-mono-tech mb-1">
                  <span className="text-slate-400">2. Query URL (100% Bypass):</span>
                  <span className="text-amber-400 font-semibold">No 404 Guarantee</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded text-xs font-mono-tech text-amber-300">
                  <span className="truncate">{baseUrl}/?page=admin</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${baseUrl}/?page=admin`, 'query-url')}
                    className="text-slate-400 hover:text-white cursor-pointer ml-2"
                  >
                    {copiedItem === 'query-url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Method 3: /#admin */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] font-mono-tech mb-1">
                  <span className="text-slate-400">3. Hash URL:</span>
                  <span className="text-blue-400 font-semibold">Client Routing</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded text-xs font-mono-tech text-slate-300">
                  <span className="truncate">{baseUrl}/#admin</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${baseUrl}/#admin`, 'hash-url')}
                    className="text-slate-400 hover:text-white cursor-pointer ml-2"
                  >
                    {copiedItem === 'hash-url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-mono-tech uppercase font-bold tracking-wider">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Triple-Redundant Persistence</span>
            </div>
            <ul className="text-xs font-sans-body text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Firebase Firestore:</strong> Document <code className="text-slate-300 font-mono">settings/admin_security</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span><strong>Node Server:</strong> <code className="text-slate-300 font-mono">/api/settings</code> on disk</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong>Browser Cache:</strong> Local key <code className="text-slate-300 font-mono">priad_admin_password</code></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
