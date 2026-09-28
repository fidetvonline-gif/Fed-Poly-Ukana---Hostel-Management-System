import React from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import {
  Building,
  CreditCard,
  Wrench,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

interface StudentDashboardViewProps {
  onNavigate: (view: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return (
      <div className="p-8 text-center text-slate-600">
        Student session not found. Please log in or register.
      </div>
    );
  }

  const { user, profile } = current;
  const application = store.getStudentApplication(profile.id);
  const allocation = store.getStudentAllocation(profile.id);
  const payment = store.getStudentPayment(profile.id);
  const maintenance = store.getStudentMaintenanceRequests(profile.id);
  const announcements = store.getAnnouncements();

  let allocatedHostel = null;
  let allocatedRoom = null;
  let allocatedBed = null;

  if (allocation) {
    allocatedHostel = store.getHostelById(allocation.hostelId);
    allocatedRoom = store.getRoomById(allocation.roomId);
    const beds = store.getBedSpaces(allocation.roomId);
    allocatedBed = beds.find((b) => b.id === allocation.bedSpaceId);
  }

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl shadow-sm border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Federal Polytechnic Ukana — Student Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200 mt-1">
            <span>Reg No: <strong className="text-white font-mono">{profile.registrationNumber}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Dept: <strong className="text-white">{profile.department}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Level: <strong className="text-white">{profile.level}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('student-profile')}
            className="px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg border border-emerald-600 transition-colors"
          >
            View Profile
          </button>
          {!allocation && (
            <button
              onClick={() => onNavigate('student-apply')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              Apply For Hostel <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Accommodation Allocation */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-700" /> Accommodation
            </span>
            <Badge status={allocation ? 'Allocated' : application ? application.status : 'Not Applied'} />
          </div>

          {allocation && allocatedHostel && allocatedRoom ? (
            <div className="space-y-1">
              <div className="text-base font-bold text-slate-900">{allocatedHostel.name}</div>
              <div className="text-xs text-slate-600 flex items-center gap-2 font-mono">
                <span>Room: {allocatedRoom.roomNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Space: {allocatedBed?.bedNumber || 'Bed 01'}</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-mono font-medium pt-1">
                Ref: {allocation.allocationCode}
              </div>
            </div>
          ) : application ? (
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-800">Application Submitted</div>
              <p className="text-xs text-slate-500">
                Your application is currently under administrative review for hostel placement.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-800">No Active Allocation</div>
              <p className="text-xs text-slate-500">
                You have not submitted a hostel application for the 2025/2026 academic session.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigate(allocation ? 'student-allocation' : 'student-apply')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              {allocation ? 'View Digital Pass' : 'Start Application'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Payment Status */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" /> Payment Status
            </span>
            <Badge status={payment ? payment.status : 'Pending'} />
          </div>

          {payment ? (
            <div className="space-y-1">
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                ₦{payment.amount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Ref: {payment.paymentReference}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {new Date(payment.paymentDate).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-lg font-bold text-slate-900 tabular-nums">₦30,000.00</div>
              <p className="text-xs text-slate-500">
                Hostel fee pending. Pay via Remita TSA portal & submit receipt reference.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigate('student-payment')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              Manage Payment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Maintenance Complaints */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-sky-600" /> Maintenance
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {maintenance.length} Filed
            </span>
          </div>

          {maintenance.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                <span>Latest Ticket: {maintenance[0].ticketNumber}</span>
                <Badge status={maintenance[0].status} />
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {maintenance[0].description}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-800">No Open Tickets</div>
              <p className="text-xs text-slate-500">
                Report electrical, plumbing, or room repairs directly to the hostel works desk.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigate('student-maintenance')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              Report / View Issues <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Application Timeline + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application & Allocation Progress */}
        <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-800" />
            Accommodation Workflow Tracker
          </h2>

          <div className="space-y-4">
            {/* Step 1: Registration */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">1. Student Registration</div>
                <div className="text-xs text-slate-500">Profile verified: {profile.registrationNumber} ({profile.department})</div>
              </div>
            </div>

            {/* Step 2: Application */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                application ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
              }`}>
                {application ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : '2'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">2. Hostel Application Submission</div>
                <div className="text-xs text-slate-500">
                  {application
                    ? `Submitted on ${new Date(application.submittedAt).toLocaleDateString()} (Status: ${application.status})`
                    : 'Pending application form submission.'}
                </div>
              </div>
            </div>

            {/* Step 3: Payment Verification */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                payment && payment.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : payment ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
              }`}>
                {payment && payment.status === 'Verified' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : payment ? (
                  <Clock className="w-4 h-4 text-amber-600" />
                ) : (
                  '3'
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">3. Accommodation Fee Verification</div>
                <div className="text-xs text-slate-500">
                  {payment
                    ? `Payment Ref: ${payment.paymentReference} (Status: ${payment.status})`
                    : 'Awaiting Remita TSA receipt reference upload.'}
                </div>
              </div>
            </div>

            {/* Step 4: Room Allocation */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                allocation ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
              }`}>
                {allocation ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : '4'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">4. Room & Bed Space Assignment</div>
                <div className="text-xs text-slate-500">
                  {allocation
                    ? `Allocated to ${allocatedHostel?.name}, Room ${allocatedRoom?.roomNumber}, ${allocatedBed?.bedNumber}`
                    : 'Pending final room matching by Hostel Administration.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Widget */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            Hostel Broadcasts
          </h2>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                  {ann.priority === 'Urgent' && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                      URGENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3">{ann.content}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{ann.author}</span>
                  <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
