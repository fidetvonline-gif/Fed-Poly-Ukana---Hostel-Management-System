import React, { useState } from 'react';
import { Database, ShieldCheck, ExternalLink, Trash2, X } from 'lucide-react';
import { isSupabaseConfigured, saveSupabaseConfig, clearSupabaseConfig } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setTestResult({ success: false, message: 'Please provide both Supabase URL and Anon Key.' });
      return;
    }
    saveSupabaseConfig(url.trim(), key.trim());
  };

  const handleTestConnection = async () => {
    if (!url.trim() || !key.trim()) {
      setTestResult({ success: false, message: 'Enter URL and Key first to test.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      // Test fetching from Supabase endpoint
      const res = await fetch(`${url.trim()}/rest/v1/`, {
        headers: {
          apikey: key.trim(),
          Authorization: `Bearer ${key.trim()}`
        }
      });
      if (res.ok || res.status === 200 || res.status === 404) {
        setTestResult({ success: true, message: 'Successfully connected to Supabase project endpoint!' });
      } else {
        setTestResult({ success: false, message: `Connection test returned status ${res.status}. Check credentials.` });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Connection failed: ${err.message || 'Network error'}` });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    clearSupabaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Supabase Database Connection</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="text-xs text-slate-600 leading-relaxed">
            Connect your Federal Polytechnic Ukana Hostel portal to a live Supabase PostgreSQL database for persistent student records, room allocations, payments, and maintenance tickets across sessions.
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-medium text-slate-700">Current Connection Status:</span>
            <span className={`px-2.5 py-1 rounded-full font-semibold ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isSupabaseConfigured ? 'Connected (Live)' : 'Using Local Simulation'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>

              {isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Disconnect
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                Save & Connect
              </button>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium justify-center"
            >
              Get your Supabase API credentials from Supabase Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
