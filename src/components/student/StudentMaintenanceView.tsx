import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { MaintenanceCategory, MaintenancePriority } from '../../types';
import { Wrench, Plus, CheckCircle2, AlertCircle, Clock, MessageSquare } from 'lucide-react';

export const StudentMaintenanceView: React.FC = () => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return <div className="p-8 text-center text-slate-600">Student session required.</div>;
  }

  const { profile } = current;
  const allocation = store.getStudentAllocation(profile.id);
  const requests = store.getStudentMaintenanceRequests(profile.id);

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<MaintenanceCategory>('Plumbing');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [description, setDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allocation) {
      setError('You must have an active room allocation to file hostel maintenance complaints.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a detailed description of the maintenance issue.');
      return;
    }

    store.submitMaintenanceRequest({
      studentProfileId: profile.id,
      hostelId: allocation.hostelId,
      roomId: allocation.roomId,
      category,
      priority,
      description: description.trim(),
    });

    setSubmittedMessage('Maintenance complaint filed successfully! Works Dept notified.');
    setDescription('');
    setShowForm(false);
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" /> Hostel Maintenance Complaints Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Report plumbing, electrical, furniture, or structural repairs directly to the Works Department
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Request' : 'New Maintenance Ticket'}
        </button>
      </div>

      {submittedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Submit New Hostel Maintenance Ticket
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Electrical">Electrical (Fan, Lights, Sockets)</option>
                <option value="Plumbing">Plumbing (Taps, Toilet, Drainage)</option>
                <option value="Furniture">Furniture (Bed frame, Desk, Wardrobe)</option>
                <option value="Water">Water Supply</option>
                <option value="Cleaning">Sanitation / Cleaning</option>
                <option value="Security">Doors & Window Lock Security</option>
                <option value="Structural">Structural / Wall Repairs</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Low">Low — Minor inconvenience</option>
                <option value="Medium">Medium — Standard repair needed</option>
                <option value="High">High — Urgent room disruption</option>
                <option value="Urgent">Urgent — Safety or flooding emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description of Problem *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact room location details and nature of the defect..."
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
          >
            File Ticket with Works & Physical Planning
          </button>
        </form>
      )}

      {/* Existing Tickets List */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>My Reported Complaints ({requests.length})</span>
        </h2>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No maintenance complaints reported yet.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((m) => (
              <div
                key={m.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{m.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 font-medium text-slate-700">
                      {m.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-slate-500">Priority: {m.priority}</span>
                  </div>
                  <Badge status={m.status} />
                </div>

                <p className="text-slate-700 leading-relaxed">{m.description}</p>

                {m.adminNotes && (
                  <div className="p-2.5 bg-sky-50/80 border border-sky-200 rounded-lg text-sky-950 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px]">Works Dept Response:</strong>
                      <span>{m.adminNotes}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Reported: {new Date(m.reportedAt).toLocaleString()}</span>
                  {m.resolvedAt && (
                    <span className="text-emerald-800 font-semibold">
                      Resolved: {new Date(m.resolvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
