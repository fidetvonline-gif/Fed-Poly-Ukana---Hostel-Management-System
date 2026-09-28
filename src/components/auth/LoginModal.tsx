import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { store } from '../../services/store';
import { ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess,
}) => {
  const [identifier, setIdentifier] = useState('akpan.john@student.fedpolyukana.edu.ng');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = store.login(identifier);
    if (!res.success) {
      setError(res.message || 'Login failed. Please check your credentials.');
      return;
    }

    onSuccess();
    onClose();
  };

  const handlePresetSelect = (presetId: string) => {
    if (presetId === 'student1') {
      setIdentifier('akpan.john@student.fedpolyukana.edu.ng');
    } else if (presetId === 'student2') {
      setIdentifier('udoh.blessing@student.fedpolyukana.edu.ng');
    } else if (presetId === 'admin1') {
      setIdentifier('admin@fedpolyukana.edu.ng');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Federal Polytechnic Ukana — Portal Sign In"
      subtitle="Access student accommodation services & hostel administration console"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Preset Selector for quick testing */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 block mb-1.5">
            Quick Fill Demo Credentials:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handlePresetSelect('student1')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 hover:border-emerald-600 transition-colors flex items-center gap-1 font-medium"
            >
              <UserCheck className="w-3 h-3 text-emerald-600" /> Akpan (ND II Student)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('student2')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 hover:border-emerald-600 transition-colors flex items-center gap-1 font-medium"
            >
              <UserCheck className="w-3 h-3 text-emerald-600" /> Udoh (ND I Student)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('admin1')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 hover:border-amber-600 transition-colors flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" /> Dr. Bassey (Admin)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Student Reg No. or Institutional Email
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="e.g. 2025/ND/CS/014 or user@fedpolyukana.edu.ng"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            Sign In to Portal
          </button>
        </div>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          New student seeking accommodation?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="font-bold text-emerald-800 hover:underline"
          >
            Create Student Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
