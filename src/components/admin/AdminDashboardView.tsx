import React from 'react';
import { store } from '../../services/store';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  Users,
  Building,
  Key,
  CreditCard,
  Wrench,
  FileText,
  PieChart,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const stats = store.getStats();
  const hostels = store.getHostels();
  const pendingApps = store.getApplications().filter((a) => a.status === 'Pending');
  const pendingPayments = store.getPayments().filter((p) => p.status === 'Submitted');
  const openMaintenance = store.getMaintenanceRequests().filter((m) => m.status !== 'Resolved' && m.status !== 'Closed');

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Federal Polytechnic Ukana — Administrative Command
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Hostel Management Console
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time occupancy monitoring, room allocation engine, payment clearance & maintenance dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('admin-allocations')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" /> Room Allocation Engine
          </button>
          <button
            onClick={() => onNavigate('admin-reports')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Generate Reports
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          subtext="Registered in Portal"
          accentColor="slate"
          icon={<Users className="w-5 h-5 text-slate-600" />}
        />
        <StatCard
          label="Bed Spaces Capacity"
          value={stats.totalBedSpaces}
          subtext={`${stats.occupiedBedSpaces} Occupied (${stats.occupancyPercentage}%)`}
          accentColor="emerald"
          icon={<Building className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Available Spaces"
          value={stats.availableBedSpaces}
          subtext="Ready for Allocation"
          accentColor="sky"
          icon={<Key className="w-5 h-5 text-sky-600" />}
        />
        <StatCard
          label="Pending Clearance"
          value={stats.pendingApplications + stats.pendingPayments}
          subtext={`${stats.pendingApplications} Apps / ${stats.pendingPayments} Payments`}
          accentColor="amber"
          icon={<CreditCard className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Hostel Occupancy Monitoring Cards */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-800" />
            Real-Time Hostel Hall Occupancy Monitoring
          </h2>
          <button
            onClick={() => onNavigate('admin-hostels')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Manage Hostels Matrix <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hostels.map((hostel) => {
            const hostelRooms = store.getRooms(hostel.id);
            let totalCap = 0;
            let occCap = 0;
            hostelRooms.forEach((r) => {
              totalCap += r.capacity;
              occCap += r.occupiedSpaces;
            });
            const availCap = totalCap - occCap;
            const percentage = totalCap > 0 ? Math.round((occCap / totalCap) * 100) : 0;

            return (
              <div
                key={hostel.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{hostel.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{hostel.gender} Hall</span>
                  </div>
                  <Badge status={hostel.status} />
                </div>

                {/* Occupancy Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>Occupancy: {percentage}%</span>
                    <span>{occCap} / {totalCap} Spaces</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percentage >= 90
                          ? 'bg-rose-600'
                          : percentage >= 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/80">
                  <span>Available: <strong>{availCap} Beds</strong></span>
                  <span>Rooms: {hostel.numberOfRooms}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Desk Grid: Pending Apps, Payments, Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desk 1: Pending Applications */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-800" /> Pending Applications ({pendingApps.length})
            </span>
            <button
              onClick={() => onNavigate('admin-applications')}
              className="text-[11px] font-bold text-emerald-800 hover:underline"
            >
              Review All
            </button>
          </div>

          <div className="space-y-2">
            {pendingApps.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No pending applications.</p>
            ) : (
              pendingApps.slice(0, 3).map((app) => {
                const student = store.getAllStudents().find((s) => s.profile.id === app.studentId);
                const hostel = store.getHostelById(app.preferredHostelId);
                return (
                  <div key={app.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{student?.user.name || 'Student'}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{student?.profile.registrationNumber}</div>
                    <div className="text-[11px] text-emerald-800 font-medium mt-1">
                      Pref: {hostel?.name || 'Any'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desk 2: Pending Payment Verification */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" /> Payment Verification ({pendingPayments.length})
            </span>
            <button
              onClick={() => onNavigate('admin-payments')}
              className="text-[11px] font-bold text-emerald-800 hover:underline"
            >
              Verify All
            </button>
          </div>

          <div className="space-y-2">
            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">All payments verified.</p>
            ) : (
              pendingPayments.slice(0, 3).map((pay) => {
                const student = store.getAllStudents().find((s) => s.profile.id === pay.studentId);
                return (
                  <div key={pay.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{student?.user.name || 'Student'}</span>
                      <span className="font-bold text-slate-900 tabular-nums">₦{pay.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">Ref: {pay.paymentReference}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desk 3: Maintenance Complaints */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-sky-600" /> Maintenance Tickets ({openMaintenance.length})
            </span>
            <button
              onClick={() => onNavigate('admin-maintenance')}
              className="text-[11px] font-bold text-emerald-800 hover:underline"
            >
              Dispatch Desk
            </button>
          </div>

          <div className="space-y-2">
            {openMaintenance.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No open maintenance complaints.</p>
            ) : (
              openMaintenance.slice(0, 3).map((m) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{m.ticketNumber}</span>
                    <Badge status={m.status} />
                  </div>
                  <p className="text-slate-600 line-clamp-1">{m.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
