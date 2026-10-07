import React, { useState } from 'react';
import { Database, ShieldCheck, ExternalLink, Trash2, X, Copy, Check, FileCode, Sliders } from 'lucide-react';
import { isSupabaseConfigured, saveSupabaseConfig, clearSupabaseConfig } from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabaseService';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Supabase Database Connection</h3>
              <p className="text-[11px] text-emerald-200">Federal Polytechnic Ukana Hostel Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> Database SQL Schema
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 grow">
          {activeTab === 'config' ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="text-xs text-slate-600 leading-relaxed">
                Connect your Federal Polytechnic Ukana Hostel portal to a live Supabase PostgreSQL database for persistent student records, room allocations, payments, and maintenance tickets across sessions.
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-medium text-slate-700">Connection Status:</span>
                <span className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  {isSupabaseConfigured ? 'Connected (Live Supabase)' : 'Local Storage Mode'}
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
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>

                  {isSupabaseConfigured && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Disconnect
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    Save & Connect
                  </button>
                </div>
              </div>

              <div className="pt-1">
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
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">PostgreSQL Schema & Tables</h4>
                  <p className="text-[11px] text-slate-500">Run this script in your Supabase SQL Editor</p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 text-slate-100 p-4 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <span className="font-semibold block">How to run in Supabase:</span>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-emerald-800">
                  <li>Open your project at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-medium">supabase.com/dashboard</a></li>
                  <li>Click on <strong>SQL Editor</strong> in the left sidebar</li>
                  <li>Click <strong>New query</strong>, paste the copied SQL above, and click <strong>Run</strong></li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
