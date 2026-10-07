import React from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Key,
  CreditCard,
  Wrench,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomeLandingViewProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onNavigate: (view: string) => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onOpenLogin,
  onOpenRegister,
  onNavigate,
}) => {
  const hostels = store.getHostels();
  const currentUser = store.getCurrentUser()?.user;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-emerald-900">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src="https://fedpolyukana.edu.ng/wp-content/uploads/2026/06/ChatGPT-Image-Jun-30-2026-12_31_08-PM.png"
            alt="Federal Polytechnic Ukana Residence"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">


          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            FEDERAL POLYTECHNIC UKANA
            <span className="block text-amber-300 text-xl sm:text-3xl font-bold mt-2">
              Web-Based Hostel Accommodation Management System
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Essien Udim, Akwa Ibom State. Centralized digital platform for student registration, hostel hall selection, Remita TSA payment verification, automated room allocation, and maintenance complaints tracking.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {currentUser ? (
              <button
                onClick={() =>
                  onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')
                }
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                Go to {currentUser.role === 'admin' ? 'Admin Console' : 'Student Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  Register Student Portal Account
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-600 transition-colors"
                >
                  Sign In to Portal
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight">
            Digital Accommodation Lifecycle
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            A seamless, transparent process from matriculation registration to bed space key pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Portal Registration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students create verified profiles with Reg Number, School, Department, Level, and Next-of-Kin details.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Remita TSA Payment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay accommodation fee via Remita Treasury Single Account and upload RRR reference for Bursary clearance.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Automated Allocation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hostel administrators assign students to gender-appropriate halls, blocks, rooms, and specific bed spaces.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Maintenance Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Report room plumbing, electrical, furniture, or locks issues directly to the Works Department online.
            </p>
          </div>
        </div>
      </section>

      {/* Available Residential Halls Overview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-800" /> Poly Residence Hall
            </h2>
            <p className="text-xs text-slate-600">
              Female student accommodation facility on Fed Poly Ukana main campus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 max-w-2xl gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 hover:shadow-md transition-shadow"
            >
              {hostel.imageUrl && (
                <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
                  <img
                    src={hostel.imageUrl}
                    alt={hostel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge status={`${hostel.gender} Hall`} />
                  </div>
                </div>
              )}

              <div className="p-6 pt-0 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{hostel.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{hostel.location}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{hostel.description}</p>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">Capacity</span>
                    <span className="font-bold text-slate-900">{hostel.totalCapacity} Students</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">Rooms</span>
                    <span className="font-bold text-slate-900">{hostel.numberOfRooms} Rooms (4 Bed/Room)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">Session Fee</span>
                    <span className="font-bold text-emerald-800 font-mono">
                      ₦{hostel.feePerSession.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Hostel Photo Gallery */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-800" /> Campus Hostel Photo Gallery
          </h2>
          <p className="text-xs text-slate-600">
            Official photographic views of the Federal Polytechnic Ukana student residential facilities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img
                src="https://cdn.corenexis.com/f/LW7d70nDYeH.jpg"
                alt="Fed Poly Ukana Hostel View 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 text-xs font-semibold text-slate-800">
              Main Campus Hostel Block View
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img
                src="https://cdn.corenexis.com/f/I9N3RyDvx3d.jpg"
                alt="Fed Poly Ukana Hostel View 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 text-xs font-semibold text-slate-800">
              Residential Hall Quadrangle & Facilities
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img
                src="https://cdn.corenexis.com/f/IZ9W316Wf7J.jpg"
                alt="Fed Poly Ukana Hostel View 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 text-xs font-semibold text-slate-800">
              Student Accommodation Surroundings
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
