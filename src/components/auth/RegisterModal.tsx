import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { store } from '../../services/store';
import { Gender, StudentLevel, ProgramType } from '../../types';
import { AlertCircle } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    gender: 'Male' as Gender,
    dateOfBirth: '2004-06-15',
    school: 'School of Science & Applied Technology',
    department: 'Computer Science',
    programme: 'National Diploma (ND)' as ProgramType,
    level: 'ND I' as StudentLevel,
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = store.registerStudent({
      fullName: formData.fullName,
      registrationNumber: formData.registrationNumber,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      school: formData.school,
      department: formData.department,
      programme: formData.programme,
      level: formData.level,
    });

    if (!res.success) {
      setError(res.message || 'Registration failed.');
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Federal Polytechnic Ukana — Student Registration"
      subtitle="Complete your academic details to register for hostel accommodation portal"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. Udo Mary Edidiong"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Reg No. *</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              placeholder="e.g. 2025/ND/CS/042"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden uppercase"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. udo.mary@student.fedpolyukana.edu.ng"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="08012345678"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">School / Faculty *</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              <option value="School of Science & Applied Technology">
                School of Science & Applied Technology
              </option>
              <option value="School of Engineering Technology">
                School of Engineering Technology
              </option>
              <option value="School of Management Studies">
                School of Management Studies
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical / Electronic Engineering">Electrical / Electronic Engineering</option>
              <option value="Statistics">Statistics</option>
              <option value="Science Laboratory Technology">Science Laboratory Technology</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Programme *</label>
            <select
              name="programme"
              value={formData.programme}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              <option value="National Diploma (ND)">National Diploma (ND)</option>
              <option value="Higher National Diploma (HND)">Higher National Diploma (HND)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              <option value="ND I">ND I</option>
              <option value="ND II">ND II</option>
              <option value="HND I">HND I</option>
              <option value="HND II">HND II</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-hidden"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors"
          >
            Create Student Account & Continue
          </button>
        </div>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Already registered on the portal?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="font-bold text-emerald-800 hover:underline"
          >
            Sign In Here
          </button>
        </div>
      </form>
    </Modal>
  );
};
