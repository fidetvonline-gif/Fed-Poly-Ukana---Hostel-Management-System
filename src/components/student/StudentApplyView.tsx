import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { Building, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface StudentApplyViewProps {
  onNavigate: (view: string) => void;
}

export const StudentApplyView: React.FC<StudentApplyViewProps> = ({ onNavigate }) => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return <div className="p-8 text-center text-slate-600">Student session required.</div>;
  }

  const { profile } = current;
  const hostels = store.getHostels().filter((h) => h.gender === profile.gender);
  const existingApp = store.getStudentApplication(profile.id);
  const allocation = store.getStudentAllocation(profile.id);

  const [selectedHostelId, setSelectedHostelId] = useState(
    existingApp?.preferredHostelId || (hostels[0]?.id || '')
  );
  const [specialRequest, setSpecialRequest] = useState(existingApp?.specialRequest || '');
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!declared) {
      setError('Please accept the hostel rules & regulations declaration to proceed.');
      return;
    }

    store.submitApplication(profile.id, selectedHostelId, specialRequest);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" /> Hostel Accommodation Application
          </h1>
          <Badge status={allocation ? 'Allocated' : existingApp ? existingApp.status : 'New Application'} />
        </div>
        <p className="text-xs text-slate-600">
          2025/2026 Academic Session — Federal Polytechnic Ukana Student Housing Portal.
        </p>
      </div>

      {submitted || (existingApp && existingApp.status === 'Allocated') ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Application Recorded!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              Your hostel application has been logged. The Directorate of Student Affairs will process room allocations based on payment clearance and room capacity.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => onNavigate('student-payment')}
              className="px-4 py-2 bg-amber-400 text-emerald-950 text-xs font-bold rounded-lg hover:bg-amber-300"
            >
              Verify Payment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Profile Overview */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Applicant Verification
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-slate-500 block">Reg Number</span>
                <span className="font-mono font-semibold text-slate-900">{profile.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender Group</span>
                <span className="font-semibold text-slate-900">{profile.gender} Hostels Only</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department</span>
                <span className="font-semibold text-slate-900">{profile.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Level</span>
                <span className="font-semibold text-slate-900">{profile.level}</span>
              </div>
            </div>
          </div>

          {/* Hostel Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select Preferred Accommodation Hall ({profile.gender} Hostels)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hostels.map((hostel) => (
                <label
                  key={hostel.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedHostelId === hostel.id
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="preferredHostel"
                        value={hostel.id}
                        checked={selectedHostelId === hostel.id}
                        onChange={(e) => setSelectedHostelId(e.target.value)}
                        className="text-emerald-800 focus:ring-emerald-700"
                      />
                      <span className="text-xs font-bold text-slate-900">{hostel.name}</span>
                    </div>
                    <Badge status={hostel.status} />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">{hostel.description}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Capacity: {hostel.totalCapacity} Students</span>
                    <span className="font-bold text-emerald-800">₦{hostel.feePerSession.toLocaleString()} / Session</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Special Accommodation Requests */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Special Accommodation / Health / Accessibility Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="e.g. Mild asthmatic condition requiring lower bunk or ground floor placement."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          {/* Institutional Rules Declaration */}
          <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" /> Federal Polytechnic Ukana Hostel Rules Declaration
            </div>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              By submitting this accommodation application, I agree to comply with all Polytechnic residential rules, maintain room cleanliness, refrain from unauthorized subletting, and pay the prescribed fee.
            </p>
            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={declared}
                onChange={(e) => setDeclared(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-emerald-700"
              />
              <span className="font-semibold text-slate-900 text-xs">
                I hereby declare that all provided academic information is accurate and agree to all rules.
              </span>
            </label>
          </div>

          {/* Action Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            Submit Hostel Application
          </button>
        </form>
      )}
    </div>
  );
};
