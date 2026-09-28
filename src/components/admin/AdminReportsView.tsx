import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { BarChart3, Printer, Download, Search, FileText } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<
    'student' | 'occupancy' | 'payments' | 'maintenance' | 'allocations'
  >('occupancy');

  const students = store.getAllStudents();
  const hostels = store.getHostels();
  const payments = store.getPayments();
  const maintenance = store.getMaintenanceRequests();
  const allocations = store.getAllocations();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800" /> Administrative Reporting & Intelligence
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Export institutional summaries for Academic Board, Student Affairs, and Bursary Audits
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF Report
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setReportType('occupancy')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'occupancy'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          1. Hostel Occupancy Summary
        </button>
        <button
          onClick={() => setReportType('student')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'student'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          2. Student Allocation Report
        </button>
        <button
          onClick={() => setReportType('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'payments'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          3. Remita Payment Verification
        </button>
        <button
          onClick={() => setReportType('maintenance')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'maintenance'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          4. Maintenance Desk Summary
        </button>
      </div>

      {/* Report Content Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 print:border-none print:shadow-none">
        {/* Printable Report Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              FEDERAL POLYTECHNIC UKANA — DIRECTORATE OF STUDENT AFFAIRS
            </h2>
            <p className="text-xs text-emerald-800 font-semibold">
              Official Hostel Accommodation Audit Report (2025/2026 Academic Session)
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            Date Generated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Report 1: Occupancy Matrix */}
        {reportType === 'occupancy' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hostel Hall Capacity & Utilization Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-4">Hostel Hall</th>
                    <th className="py-2.5 px-4">Gender Group</th>
                    <th className="py-2.5 px-4">Total Rooms</th>
                    <th className="py-2.5 px-4">Bed Capacity</th>
                    <th className="py-2.5 px-4">Occupied Spaces</th>
                    <th className="py-2.5 px-4">Available Spaces</th>
                    <th className="py-2.5 px-4">Occupancy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hostels.map((h) => {
                    const rooms = store.getRooms(h.id);
                    let cap = 0;
                    let occ = 0;
                    rooms.forEach((r) => {
                      cap += r.capacity;
                      occ += r.occupiedSpaces;
                    });
                    const free = cap - occ;
                    const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;

                    return (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{h.name}</td>
                        <td className="py-2.5 px-4 text-slate-700">{h.gender}</td>
                        <td className="py-2.5 px-4 text-slate-700">{rooms.length}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{cap}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{occ}</td>
                        <td className="py-2.5 px-4 font-bold text-emerald-800">{free} free</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report 2: Student Allocations */}
        {reportType === 'student' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Student Residence Master Allocation List ({allocations.length} Active Records)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-4">Pass Code</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Reg Number</th>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Hostel & Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(({ user, profile, allocation }) => {
                    if (!allocation) return null;
                    const h = store.getHostelById(allocation.hostelId);
                    const r = store.getRoomById(allocation.roomId);

                    return (
                      <tr key={profile.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-amber-800">{allocation.allocationCode}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{user.name}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-700">{profile.registrationNumber}</td>
                        <td className="py-2.5 px-4 text-slate-700">{profile.department}</td>
                        <td className="py-2.5 px-4 text-slate-700">{profile.level}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {h?.name} — Room {r?.roomNumber}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report 3: Remita Payments */}
        {reportType === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Remita TSA Payment Clearance Ledger ({payments.length} Transactions)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Remita RRR Ref</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Submission Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => {
                    const st = store.getAllStudents().find((s) => s.profile.id === p.studentId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{st?.user.name || 'Student'}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{p.paymentReference}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 tabular-nums">₦{p.amount.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-slate-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                        <td className="py-2.5 px-4"><Badge status={p.status} /></td>
                        <td className="py-2.5 px-4 text-slate-600">{p.verifiedByAdminName || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report 4: Maintenance */}
        {reportType === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Works Department Repair Complaint Log ({maintenance.length} Tickets)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-4">Ticket</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4">Issue Description</th>
                    <th className="py-2.5 px-4">Reported Date</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maintenance.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{m.ticketNumber}</td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">{m.category}</td>
                      <td className="py-2.5 px-4 text-slate-700">{m.priority}</td>
                      <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate">{m.description}</td>
                      <td className="py-2.5 px-4 text-slate-500">{new Date(m.reportedAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-4"><Badge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
