import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { PaymentStatus } from '../../types';
import { CreditCard, Search, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const AdminPaymentsView: React.FC = () => {
  const currentAdmin = store.getCurrentUser();
  const adminName = currentAdmin?.user.name || 'Dr. E. U. Bassey';

  const payments = store.getPayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [message, setMessage] = useState<string | null>(null);

  const filtered = payments.filter((p) => {
    const student = store.getAllStudents().find((s) => s.profile.id === p.studentId);
    const matchesSearch =
      p.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.profile.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (paymentId: string, status: PaymentStatus, remarks: string) => {
    store.verifyPayment(paymentId, status, remarks, adminName);
    setMessage(`Payment ${pRef(paymentId)} status updated to ${status}.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const pRef = (id: string) => payments.find((p) => p.id === id)?.paymentReference || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" /> Accommodation Payment Clearance Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Verify student Remita TSA payment receipts against Treasury Single Account portal records
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payment reference or student name..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Submitted', 'Verified', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Remita RRR Reference</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filtered.map((pay) => {
                  const student = store.getAllStudents().find((s) => s.profile.id === pay.studentId);

                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student?.user.name || 'Student'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{student?.profile.registrationNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{pay.paymentReference}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">₦{pay.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(pay.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={pay.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {pay.status === 'Submitted' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleVerify(pay.id, 'Rejected', 'Invalid RRR sequence.')}
                              className="px-2.5 py-1 text-rose-700 bg-rose-50 border border-rose-200 rounded font-bold hover:bg-rose-100"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleVerify(pay.id, 'Verified', 'TSA Bank Teller Verified.')}
                              className="px-2.5 py-1 text-white bg-emerald-900 rounded font-bold hover:bg-emerald-800"
                            >
                              Verify Clearance
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Verified by {pay.verifiedByAdminName}
                          </span>
                        )}
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
