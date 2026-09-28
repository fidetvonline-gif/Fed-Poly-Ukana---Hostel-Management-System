import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { MaintenanceStatus } from '../../types';
import { Wrench, CheckCircle2, MessageSquare } from 'lucide-react';

export const AdminMaintenanceView: React.FC = () => {
  const currentAdmin = store.getCurrentUser();
  const adminName = currentAdmin?.user.name || 'Dr. E. U. Bassey';

  const requests = store.getMaintenanceRequests();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<MaintenanceStatus>('In Progress');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId) return;

    store.updateMaintenanceStatus(selectedTicketId, newStatus, notes, adminName);
    setMessage(`Ticket updated to ${newStatus}. Student notified.`);
    setSelectedTicketId(null);
    setNotes('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" /> Maintenance Dispatch Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Works & Physical Planning Department — Assign technicians and track repair complaint resolution
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Ticket List */}
      <div className="space-y-4">
        {requests.map((m) => {
          const student = store.getAllStudents().find((s) => s.profile.id === m.studentId);
          const hostel = store.getHostelById(m.hostelId);
          const room = store.getRoomById(m.roomId);

          return (
            <div
              key={m.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{m.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-xs">
                    {m.category}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs font-semibold text-rose-700">Priority: {m.priority}</span>
                </div>
                <Badge status={m.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block font-medium">Location</span>
                  <span className="font-bold text-slate-900">
                    {hostel?.name} — Room {room?.roomNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Reporting Resident</span>
                  <span className="font-bold text-slate-900">
                    {student?.user.name} ({student?.profile.registrationNumber})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{m.description}</p>

              {m.adminNotes && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-950 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px]">Dispatch Notes:</strong>
                    <span>{m.adminNotes}</span>
                  </div>
                </div>
              )}

              {selectedTicketId === m.id ? (
                <form onSubmit={handleUpdate} className="p-3 bg-slate-100 rounded-lg border border-slate-300 space-y-3 text-xs">
                  <span className="font-bold text-slate-800 block">Update Ticket Status & Dispatch Note</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">New Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as MaintenanceStatus)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Assigned">Assigned to Technician</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Technician / Works Note</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Assigned to Lead Electrician Mr. Okon..."
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicketId(null)}
                      className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-emerald-900 text-white text-xs font-bold rounded hover:bg-emerald-800"
                    >
                      Save Ticket Update
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    Reported: {new Date(m.reportedAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTicketId(m.id);
                      setNewStatus(m.status);
                      setNotes(m.adminNotes || '');
                    }}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    Update Ticket Status
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
