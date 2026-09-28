import React, { useState } from 'react';
import { store } from '../../services/store';
import { Megaphone, Plus, CheckCircle2 } from 'lucide-react';

export const AdminAnnouncementsView: React.FC = () => {
  const currentAdmin = store.getCurrentUser();
  const authorName = currentAdmin?.user.name || 'Directorate of Student Affairs';

  const announcements = store.getAnnouncements();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Male Hostels' | 'Female Hostels'>('All');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addAnnouncement({
      title,
      content,
      author: authorName,
      targetAudience,
      priority,
    });

    setMessage('Broadcast announcement published to student portals!');
    setTitle('');
    setContent('');
    setShowForm(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" /> Hostel Broadcast & Announcements
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Publish official student residential notices, sanitation schedules, and clearance bulletins
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New Broadcast Notice'}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Publish New Student Notice
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Mandatory Environmental Sanitation Exercise"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="All">All Resident Students</option>
                  <option value="Male Hostels">Male Hostels Only</option>
                  <option value="Female Hostels">Female Hostels Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Normal">Normal Notice</option>
                  <option value="Urgent">Urgent Bulletin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Broadcast Content *</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write the complete notice message..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 shadow-xs"
          >
            Publish Notice to Student Portals
          </button>
        </form>
      )}

      {/* Published Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{ann.title}</span>
              {ann.priority === 'Urgent' && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  URGENT NOTICE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Author: {ann.author} ({ann.targetAudience})</span>
              <span>Published: {new Date(ann.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
