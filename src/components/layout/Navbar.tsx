import React, { useState } from 'react';
import { User, SystemNotification } from '../../types';
import { store } from '../../services/store';
import { Bell, LogOut, ShieldCheck, User as UserIcon, RefreshCw, Check, Database } from 'lucide-react';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';
import { isSupabaseConfigured } from '../../lib/supabase';

interface NavbarProps {
  currentUser: User | null;
  onSelectRole: (role: 'student' | 'admin') => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const notifications: SystemNotification[] = currentUser
    ? store.getUserNotifications(currentUser.id)
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    store.markNotificationAsRead(id);
    setShowNotifications(false);
  };

  const handleSwitchUserRole = (userId: string) => {
    store.switchCurrentUser(userId);
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white border-b border-emerald-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm border border-amber-400 shrink-0 overflow-hidden">
                <img
                  src="https://fedpolyukana.edu.ng/wp-content/uploads/2026/07/Logo-150x150-removebg-preview.png"
                  alt="Federal Polytechnic Ukana Crest"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
                  FEDERAL POLYTECHNIC UKANA
                </div>
                <div className="text-[11px] font-medium text-amber-300 tracking-wide uppercase">
                  Hostel Management Portal
                </div>
              </div>
            </button>
          </div>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3">
            {/* Quick Switch Demo Bar */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-lg border border-emerald-700/60 text-xs">
              <span className="text-emerald-300 px-2 font-medium flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin-slow" /> Demo Switch:
              </span>
              <button
                onClick={() => handleSwitchUserRole('user-student-1')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  currentUser?.id === 'user-student-1'
                    ? 'bg-amber-400 text-emerald-950 shadow-xs font-semibold'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => handleSwitchUserRole('user-admin-1')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  currentUser?.id === 'user-admin-1'
                    ? 'bg-amber-400 text-emerald-950 shadow-xs font-semibold'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                Admin View
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800/80 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    )}
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Notifications
                        </span>
                        <span className="text-[11px] text-slate-500">{notifications.length} total</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n.id}
                              onClick={() => handleNotificationClick(n.id)}
                              className={`w-full text-left p-3 hover:bg-slate-50 transition-colors ${
                                !n.read ? 'bg-amber-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-800">
                                  {n.title}
                                </span>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Badge & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-800 border border-emerald-700/80 rounded-lg text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-semibold text-white leading-tight">
                        {currentUser.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-amber-300 font-medium capitalize">
                        {currentUser.role}
                      </div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {currentUser.role === 'admin' ? 'Hostel Administrator' : 'Polytechnic Student'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'student' ? (
                          <button
                            onClick={() => {
                              onNavigate('student-profile');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            My Student Profile
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onNavigate('admin-dashboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            Admin Console
                          </button>
                        )}

                        <div className="border-t border-slate-100 my-1" />
                        <div className="px-3 py-1">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Switch Demo Account
                          </p>
                          <button
                            onClick={() => handleSwitchUserRole('user-student-2')}
                            className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-700 hover:bg-emerald-50 flex items-center justify-between"
                          >
                            <span>Udoh Blessing (Student)</span>
                            {currentUser.id === 'user-student-2' && (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSwitchUserRole('user-admin-1')}
                            className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-700 hover:bg-emerald-50 flex items-center justify-between"
                          >
                            <span>Dr. E. U. Bassey (Admin)</span>
                            {currentUser.id === 'user-admin-1' && (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>
                        </div>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            store.switchCurrentUser('');
                            setShowUserMenu(false);
                            onNavigate('home');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3 py-1.5 text-xs font-semibold text-white hover:text-amber-300 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors"
                >
                  Student Portal Reg
                </button>
              </div>
            )}

            {/* Supabase Connection Button */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isSupabaseConfigured
                  ? 'bg-emerald-800 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800'
              }`}
              title="Configure Supabase Database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Supabase</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          </div>
        </div>
      </div>

      <SupabaseConfigModal isOpen={showSupabaseModal} onClose={() => setShowSupabaseModal(false)} />
    </header>
  );
};
