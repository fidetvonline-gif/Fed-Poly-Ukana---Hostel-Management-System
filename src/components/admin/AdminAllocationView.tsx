import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { Key, Building, Layers, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdminAllocationView: React.FC = () => {
  const currentAdmin = store.getCurrentUser();
  const adminName = currentAdmin?.user.name || 'Dr. E. U. Bassey';

  const students = store.getAllStudents();
  const unallocatedStudents = students.filter((s) => !s.allocation);

  const [selectedStudentId, setSelectedStudentId] = useState(unallocatedStudents[0]?.profile.id || '');
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selected student profile
  const targetStudent = students.find((s) => s.profile.id === selectedStudentId);

  // Compatible hostels based on gender
  const compatibleHostels = store.getHostels().filter((h) => {
    if (!targetStudent) return true;
    return h.gender === targetStudent.profile.gender;
  });

  // Compatible rooms in selected hostel
  const availableRooms = store.getRooms(selectedHostelId).filter((r) => r.status !== 'Full' && r.status !== 'Closed');

  // Available bedspaces in selected room
  const availableBeds = store.getBedSpaces(selectedRoomId).filter((b) => b.status === 'Available');

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedStudentId || !selectedHostelId || !selectedRoomId || !selectedBedId) {
      setError('Please select a student, hostel, room, and bed space.');
      return;
    }

    const res = store.allocateStudent({
      studentProfileId: selectedStudentId,
      hostelId: selectedHostelId,
      roomId: selectedRoomId,
      bedSpaceId: selectedBedId,
      adminName,
    });

    if (!res.success) {
      setError(res.message || 'Allocation failed.');
      return;
    }

    setMessage(`Success! Student allocated code: ${res.allocation?.allocationCode}`);
    setSelectedStudentId('');
    setSelectedHostelId('');
    setSelectedRoomId('');
    setSelectedBedId('');
  };

  const allocations = store.getAllocations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-800" /> Automated Room Allocation Engine
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Assign students to hostels, rooms, and bed spaces with duplicate & gender collision enforcement
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Allocation Form */}
      <form onSubmit={handleAllocate} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" /> Match Unallocated Student to Residence Space
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Step 1: Select Student */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">1. Select Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setSelectedHostelId('');
                setSelectedRoomId('');
                setSelectedBedId('');
              }}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="">-- Choose Unallocated Student --</option>
              {unallocatedStudents.map(({ user, profile }) => (
                <option key={profile.id} value={profile.id}>
                  {user.name} ({profile.registrationNumber} - {profile.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Hostel */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">2. Select Hostel Hall *</label>
            <select
              value={selectedHostelId}
              onChange={(e) => {
                setSelectedHostelId(e.target.value);
                setSelectedRoomId('');
                setSelectedBedId('');
              }}
              disabled={!selectedStudentId}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium disabled:bg-slate-100"
            >
              <option value="">-- Choose Hostel --</option>
              {compatibleHostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Select Room */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">3. Select Room *</label>
            <select
              value={selectedRoomId}
              onChange={(e) => {
                setSelectedRoomId(e.target.value);
                setSelectedBedId('');
              }}
              disabled={!selectedHostelId}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium disabled:bg-slate-100"
            >
              <option value="">-- Choose Available Room --</option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} ({r.capacity - r.occupiedSpaces} spaces free)
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Select Bed Space */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">4. Select Bed Space *</label>
            <select
              value={selectedBedId}
              onChange={(e) => setSelectedBedId(e.target.value)}
              disabled={!selectedRoomId}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium disabled:bg-slate-100"
            >
              <option value="">-- Choose Bed Space --</option>
              {availableBeds.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bedNumber} (Vacant)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          Confirm & Issue Official Allocation Pass
        </button>
      </form>

      {/* Allocation Log History */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Active Room Allocations Directory ({allocations.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Pass Code</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4">Allocated Residence</th>
                <th className="py-2.5 px-4">Allocated By</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocations.map((alloc) => {
                const student = store.getAllStudents().find((s) => s.profile.id === alloc.studentId);
                const hostel = store.getHostelById(alloc.hostelId);
                const room = store.getRoomById(alloc.roomId);

                return (
                  <tr key={alloc.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-800">{alloc.allocationCode}</td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{student?.user.name || 'Student'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{student?.profile.registrationNumber}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-800">{hostel?.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Room {room?.roomNumber}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">{alloc.allocatedByAdminName}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px]">{new Date(alloc.allocatedAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-4">
                      <Badge status={alloc.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
