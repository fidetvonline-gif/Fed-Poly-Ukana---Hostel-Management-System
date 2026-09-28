import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { Gender, HostelStatus } from '../../types';
import { Building, Plus, Layers, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminHostelsView: React.FC = () => {
  const hostels = store.getHostels();
  const [selectedHostelId, setSelectedHostelId] = useState(hostels[0]?.id || '');
  
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  // New Hostel Form State
  const [hostelName, setHostelName] = useState('');
  const [hostelCode, setHostelCode] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [location, setLocation] = useState('Main Campus Quadrangle');
  const [description, setDescription] = useState('');
  const [feePerSession, setFeePerSession] = useState(45000);

  // New Room Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [block, setBlock] = useState('Block A');
  const [floor, setFloor] = useState<'Ground' | '1st Floor' | '2nd Floor'>('Ground');
  const [capacity, setCapacity] = useState(4);

  const [message, setMessage] = useState<string | null>(null);

  const currentHostel = store.getHostelById(selectedHostelId);
  const rooms = store.getRooms(selectedHostelId);

  const handleCreateHostel = (e: React.FormEvent) => {
    e.preventDefault();
    const created = store.addHostel({
      name: hostelName,
      code: hostelCode,
      gender,
      location,
      description,
      numberOfBlocks: 1,
      numberOfRooms: 0,
      totalCapacity: 0,
      feePerSession,
      status: 'Active',
    });
    setSelectedHostelId(created.id);
    setShowAddHostel(false);
    setMessage(`Hostel "${created.name}" created successfully!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHostelId) return;

    store.addRoom({
      hostelId: selectedHostelId,
      roomNumber,
      block,
      floor,
      capacity: Number(capacity),
    });

    setShowAddRoom(false);
    setRoomNumber('');
    setMessage(`Room ${roomNumber} added to hostel!`);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-800" /> Hostel & Room Capacity Matrix
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure residential halls, floor blocks, room capacities, and automated occupancy space calculations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowAddHostel(!showAddHostel); setShowAddRoom(false); }}
            className="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Hostel Hall
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Add New Hostel Form */}
      {showAddHostel && (
        <form onSubmit={handleCreateHostel} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Register New Hostel Residential Hall
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hostel Hall Name *</label>
              <input
                type="text"
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                required
                placeholder="e.g. Male Hostel Block E"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hostel Code *</label>
              <input
                type="text"
                value={hostelCode}
                onChange={(e) => setHostelCode(e.target.value)}
                required
                placeholder="e.g. M-HST-E"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender Group *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Male">Male Hostel</option>
                <option value="Female">Female Hostel</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session Fee (₦) *</label>
              <input
                type="number"
                value={feePerSession}
                onChange={(e) => setFeePerSession(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Features, amenities, and room layout description..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-lg hover:bg-emerald-800"
          >
            Save Hostel Record
          </button>
        </form>
      )}

      {/* Hostel Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {hostels.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHostelId(h.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedHostelId === h.id
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {h.name} ({h.gender})
          </button>
        ))}
      </div>

      {currentHostel && (
        <div className="space-y-6">
          {/* Hostel Summary Info */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Total Rooms</span>
              <span className="text-base font-bold text-slate-900">{rooms.length} Rooms</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Total Bed Spaces</span>
              <span className="text-base font-bold text-slate-900">{currentHostel.totalCapacity} Spaces</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Session Fee</span>
              <span className="text-base font-bold text-emerald-800 font-mono">
                ₦{currentHostel.feePerSession.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Status</span>
              <Badge status={currentHostel.status} />
            </div>
          </div>

          {/* Room Management Section */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-800" />
                Rooms in {currentHostel.name} ({rooms.length})
              </h2>
              <button
                onClick={() => setShowAddRoom(!showAddRoom)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Room
              </button>
            </div>

            {showAddRoom && (
              <form onSubmit={handleCreateRoom} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-slate-800 block">Add New Room Configuration</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Room Number *</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      required
                      placeholder="e.g. A-105"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Block *</label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Floor *</label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    >
                      <option value="Ground">Ground</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Capacity (Bed Spaces) *</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      min={1}
                      max={8}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-900 text-white font-bold rounded text-xs"
                >
                  Save Room
                </button>
              </form>
            )}

            {/* Rooms Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-4">Room No.</th>
                    <th className="py-2.5 px-4">Block & Floor</th>
                    <th className="py-2.5 px-4">Bed Capacity</th>
                    <th className="py-2.5 px-4">Occupied Spaces</th>
                    <th className="py-2.5 px-4">Available Spaces</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => {
                    const availableSpaces = room.capacity - room.occupiedSpaces;
                    return (
                      <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{room.roomNumber}</td>
                        <td className="py-2.5 px-4 text-slate-700">{room.block} — {room.floor}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{room.capacity} Beds</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{room.occupiedSpaces}</td>
                        <td className="py-2.5 px-4 font-bold text-emerald-800">{availableSpaces} Free</td>
                        <td className="py-2.5 px-4">
                          <Badge status={room.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
