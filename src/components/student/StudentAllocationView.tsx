import React from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { Key, Building, Printer, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StudentAllocationView: React.FC = () => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return <div className="p-8 text-center text-slate-600">Student session required.</div>;
  }

  const { user, profile } = current;
  const allocation = store.getStudentAllocation(profile.id);
  const hostel = allocation ? store.getHostelById(allocation.hostelId) : null;
  const room = allocation ? store.getRoomById(allocation.roomId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-800" /> Digital Hostel Accommodation Pass
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Official Residence & Key Collection Slip — Federal Polytechnic Ukana
          </p>
        </div>

        {allocation && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Accommodation Pass
          </button>
        )}
      </div>

      {allocation && hostel && room ? (
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md overflow-hidden print:border-none print:shadow-none">
          {/* Slip Top Banner */}
          <div className="bg-emerald-900 text-white p-6 border-b border-amber-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden shrink-0">
                <img
                  src="https://fedpolyukana.edu.ng/wp-content/uploads/2026/07/Logo-150x150-removebg-preview.png"
                  alt="Fed Poly Ukana Crest"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight uppercase">FEDERAL POLYTECHNIC UKANA</h2>
                <p className="text-xs text-amber-300 font-semibold uppercase">Directorate of Student Affairs</p>
                <p className="text-[10px] text-emerald-200">Official Student Accommodation Slip</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Pass Code</span>
              <span className="text-sm font-mono font-bold text-white bg-emerald-950 px-2 py-1 rounded border border-emerald-700">
                {allocation.allocationCode}
              </span>
            </div>
          </div>

          {/* Slip Body */}
          <div className="p-6 space-y-6">
            {/* Resident Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Resident Full Name</span>
                <span className="text-sm font-bold text-slate-900">{user.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Registration Number</span>
                <span className="text-sm font-mono font-bold text-slate-900">{profile.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Department & School</span>
                <span className="font-semibold text-slate-900">{profile.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Level & Session</span>
                <span className="font-semibold text-slate-900">{profile.level} (2025/2026 Session)</span>
              </div>
            </div>

            {/* Room Allocation Matrix Box */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-400" /> Allocated Residence Location
                </span>
                <Badge status="VERIFIED ALLOCATION" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Hostel Hall</span>
                  <span className="text-base font-bold text-white">{hostel.name}</span>
                  <span className="text-[11px] text-emerald-300 block mt-0.5">{hostel.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Block & Room Number</span>
                  <span className="text-base font-bold text-white font-mono">{room.block} — {room.roomNumber}</span>
                  <span className="text-[11px] text-emerald-300 block mt-0.5">Floor: {room.floor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Bed Space Assignment</span>
                  <span className="text-base font-bold text-amber-300 font-mono">Bed Space 01 / 04</span>
                  <span className="text-[11px] text-emerald-300 block mt-0.5">Ensuite Facilities</span>
                </div>
              </div>
            </div>

            {/* Signatures & Verification Note */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Allocated By</span>
                <span className="font-bold text-slate-800">{allocation.allocatedByAdminName}</span>
                <span className="text-[10px] text-slate-400 block">{new Date(allocation.allocatedAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase block">Hall Warden Stamp</span>
                <div className="inline-flex items-center gap-1 text-emerald-800 font-bold border border-emerald-300 bg-emerald-50 px-3 py-1 rounded-lg mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Official DSA Clearance
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Active Allocation Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not currently have an active hostel bed space assignment. Please complete your hostel application and payment submission.
          </p>
        </div>
      )}
    </div>
  );
};
