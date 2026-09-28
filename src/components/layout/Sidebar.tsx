import React from 'react';
import {
  LayoutDashboard,
  User,
  FileText,
  Home,
  CreditCard,
  Wrench,
  Megaphone,
  BarChart3,
  Users,
  ShieldAlert,
  Building,
  Key,
} from 'lucide-react';
import { Role } from '../../types';

interface SidebarProps {
  role: Role;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeView, onNavigate }) => {
  const studentNavItems = [
    { id: 'student-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'student-profile', label: 'Student Profile', icon: User },
    { id: 'student-apply', label: 'Apply for Accommodation', icon: FileText },
    { id: 'student-allocation', label: 'My Room Allocation', icon: Key },
    { id: 'student-payment', label: 'Payment Status', icon: CreditCard },
    { id: 'student-maintenance', label: 'Maintenance Complaints', icon: Wrench },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-students', label: 'Student Registry', icon: Users },
    { id: 'admin-hostels', label: 'Hostels & Room Matrix', icon: Building },
    { id: 'admin-applications', label: 'Accommodation Applications', icon: FileText },
    { id: 'admin-allocations', label: 'Room Allocation Engine', icon: Key },
    { id: 'admin-payments', label: 'Payment Verification', icon: CreditCard },
    { id: 'admin-maintenance', label: 'Maintenance Desk', icon: Wrench },
    { id: 'admin-announcements', label: 'Hostel Broadcasts', icon: Megaphone },
    { id: 'admin-reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'admin-audit', label: 'Security Audit Logs', icon: ShieldAlert },
  ];

  const items = role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] shrink-0 border-r border-slate-800 p-4">
      <div className="mb-6 px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
          Current Access Level
        </span>
        <span className="text-xs font-semibold text-white block mt-0.5 capitalize">
          {role === 'admin' ? 'Hostel Administrator' : 'Polytechnic Student'}
        </span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-slate-800 px-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Portal Home</span>
        </button>
      </div>
    </aside>
  );
};
