import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { User, Phone, Mail, GraduationCap, Building, Calendar, ShieldCheck, Check } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return <div className="p-8 text-center text-slate-600">Profile data unavailable.</div>;
  }

  const { user, profile } = current;
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [nextOfKinName, setNextOfKinName] = useState(profile.nextOfKinName || '');
  const [nextOfKinPhone, setNextOfKinPhone] = useState(profile.nextOfKinPhone || '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateStudentProfile(profile.id, {
      phone,
      nextOfKinName,
      nextOfKinPhone,
    });
    setSuccessMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const allocation = store.getStudentAllocation(profile.id);
  const hostel = allocation ? store.getHostelById(allocation.hostelId) : null;
  const room = allocation ? store.getRoomById(allocation.roomId) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-900 text-amber-300 text-xl font-bold flex items-center justify-center shadow-md shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <Badge status="Active Student" />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Reg No: {profile.registrationNumber}</p>
            <p className="text-xs text-emerald-800 font-medium mt-1">{profile.department} — {profile.school}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Contact Info'}
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Details (Read Only) */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-800" /> Academic & Institutional Information
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Institution</span>
              <span className="font-semibold text-slate-900">Federal Polytechnic Ukana</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">School / Faculty</span>
              <span className="font-semibold text-slate-900">{profile.school}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Department</span>
              <span className="font-semibold text-slate-900">{profile.department}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block font-medium">Programme</span>
                <span className="font-semibold text-slate-900">{profile.programme}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Level</span>
                <span className="font-semibold text-slate-900">{profile.level}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Gender</span>
              <span className="font-semibold text-slate-900">{profile.gender}</span>
            </div>
          </div>
        </div>

        {/* Contact & Emergency Profile */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-800" /> Personal & Emergency Contacts
          </h2>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Next of Kin Name</label>
                <input
                  type="text"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  placeholder="Parent or Guardian Name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Next of Kin Phone</label>
                <input
                  type="text"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  placeholder="Parent/Guardian Phone"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Save Profile Changes
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Institutional Email</span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Phone Number</span>
                <span className="font-semibold text-slate-900">{profile.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Date of Birth</span>
                <span className="font-semibold text-slate-900">{profile.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Next of Kin</span>
                <span className="font-semibold text-slate-900">
                  {profile.nextOfKinName || 'Not specified'} {profile.nextOfKinPhone ? `(${profile.nextOfKinPhone})` : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hostel Record Card */}
        <div className="md:col-span-2 p-6 bg-slate-900 text-white rounded-xl shadow-2xs space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" /> Current Hostel Residence Record
            </h2>
            <Badge status={allocation ? 'Active Allocation' : 'No Allocation'} />
          </div>

          {allocation && hostel && room ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div>
                <span className="text-slate-400 block">Hostel Hall</span>
                <span className="font-bold text-white">{hostel.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Block & Room</span>
                <span className="font-bold text-white">{room.block} — {room.roomNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Allocation Code</span>
                <span className="font-mono text-amber-300 font-bold">{allocation.allocationCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date Allocated</span>
                <span className="text-white">{new Date(allocation.allocatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 pt-1">
              You are currently not allocated to any hostel bed space for this session. Use the application menu to apply.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
