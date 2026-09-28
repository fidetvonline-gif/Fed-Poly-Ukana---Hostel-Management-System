import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { FileText, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

interface AdminApplicationsViewProps {
  onNavigate: (view: string) => void;
}

export const AdminApplicationsView: React.FC<AdminApplicationsViewProps> = ({ onNavigate }) => {
  const applications = store.getApplications();
  const [filterStatus, setFilterStatus] = useState('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = applications.filter((a) => {
    if (filterStatus === 'All') return true;
    return a.status === filterStatus;
  });

  const handleReview = (appId: string, status: 'Approved' | 'Rejected', reason?: string) => {
    store.reviewApplication(appId, status, reason);
    setFeedback(`Application ${status.toLowerCase()} successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" /> Accommodation Applications Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Review student preferences, medical declarations, and approve applications for room allocation
          </p>
        </div>

        <button
          onClick={() => onNavigate('admin-allocations')}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          Open Allocation Engine →
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Pending', 'Approved', 'Allocated', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Application Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs">
            No applications matching selected status filter.
          </div>
        ) : (
          filtered.map((app) => {
            const student = store.getAllStudents().find((s) => s.profile.id === app.studentId);
            const hostel = store.getHostelById(app.preferredHostelId);

            if (!student) return null;

            return (
              <div
                key={app.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{student.user.name}</span>
                      <span className="text-xs font-mono text-slate-500">({student.profile.registrationNumber})</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {student.profile.department} — Level {student.profile.level} ({student.profile.gender})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge status={app.status} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 block font-medium">Preferred Hostel Hall</span>
                    <span className="font-bold text-slate-900">{hostel?.name || 'Any Available'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Special Request / Health Notes</span>
                    <span className="text-slate-800 italic">
                      {app.specialRequest || 'None provided.'}
                    </span>
                  </div>
                </div>

                {app.status === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleReview(app.id, 'Rejected', 'Preferred hostel hall full.')}
                      className="px-3 py-1.5 text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleReview(app.id, 'Approved')}
                      className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Application
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
