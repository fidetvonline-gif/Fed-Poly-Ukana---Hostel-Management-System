import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { Users, Search, Filter, ShieldCheck, FileText } from 'lucide-react';

export const AdminStudentRegistryView: React.FC = () => {
  const students = store.getAllStudents();
  const hostels = store.getHostels();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  const filteredStudents = students.filter(({ user, profile, allocation }) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === 'All' || profile.gender === genderFilter;
    const matchesLevel = levelFilter === 'All' || profile.level === levelFilter;

    return matchesSearch && matchesGender && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" /> Student Accommodation Registry
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Centralized directory of registered students, room allocations, and payment clearance records
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, Reg No, or department..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male Students</option>
            <option value="Female">Female Students</option>
          </select>
        </div>

        <div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Academic Levels</option>
            <option value="ND I">ND I</option>
            <option value="ND II">ND II</option>
            <option value="HND I">HND I</option>
            <option value="HND II">HND II</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Department & Level</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Allocated Residence</th>
                <th className="py-3 px-4">Pass Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No student records matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(({ user, profile, allocation, payment }) => {
                  const hostel = allocation ? store.getHostelById(allocation.hostelId) : null;
                  const room = allocation ? store.getRoomById(allocation.roomId) : null;

                  return (
                    <tr key={profile.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{profile.registrationNumber}</div>
                        <div className="text-[10px] text-slate-400">{profile.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{profile.department}</div>
                        <div className="text-[11px] text-slate-500">{profile.programme} ({profile.level})</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{profile.gender}</td>
                      <td className="py-3 px-4">
                        <Badge status={payment ? payment.status : 'Pending'} />
                      </td>
                      <td className="py-3 px-4">
                        {allocation && hostel && room ? (
                          <div>
                            <span className="font-bold text-slate-900 block">{hostel.name}</span>
                            <span className="text-[11px] text-emerald-800 font-mono font-medium">
                              Room {room.roomNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unallocated</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-amber-800 font-bold">
                        {allocation ? allocation.allocationCode : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
