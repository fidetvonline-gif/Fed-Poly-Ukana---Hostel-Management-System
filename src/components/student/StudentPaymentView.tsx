import React, { useState } from 'react';
import { store } from '../../services/store';
import { Badge } from '../common/Badge';
import { CreditCard, CheckCircle2, AlertCircle, FileText, Upload } from 'lucide-react';

interface StudentPaymentViewProps {
  onNavigate: (view: string) => void;
}

export const StudentPaymentView: React.FC<StudentPaymentViewProps> = ({ onNavigate }) => {
  const current = store.getCurrentUser();
  if (!current || !current.profile) {
    return <div className="p-8 text-center text-slate-600">Student session required.</div>;
  }

  const { profile } = current;
  const payment = store.getStudentPayment(profile.id);

  const [amount] = useState(30000);
  const [paymentReference, setPaymentReference] = useState(payment?.paymentReference || '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!paymentReference.trim()) {
      setError('Please enter a valid Remita TSA payment reference number.');
      return;
    }

    store.submitPayment(profile.id, amount, paymentReference.trim());
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" /> Accommodation Payment Verification
          </h1>
          <Badge status={payment ? payment.status : 'Pending Submission'} />
        </div>
        <p className="text-xs text-slate-600">
          Federal Polytechnic Ukana Treasury Single Account (TSA) Accommodation Fee Portal
        </p>
      </div>

      {/* Payment Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-500 font-medium">Session Fee Standard</span>
          <span className="text-lg font-bold text-slate-900 block tabular-nums">₦30,000.00</span>
          <span className="text-[10px] text-emerald-800 font-medium">Per Academic Session</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-500 font-medium">Payment Account</span>
          <span className="text-sm font-bold text-slate-900 block">REMITA TSA Channel</span>
          <span className="text-[10px] text-slate-500">Fed Poly Ukana Hostel Account</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-500 font-medium">Verification Desk</span>
          <span className="text-sm font-bold text-emerald-800 block">Bursary / Student Affairs</span>
          <span className="text-[10px] text-slate-500">Auto-cleared upon admin review</span>
        </div>
      </div>

      {payment ? (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-800" /> Recorded Payment Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Remita Payment Reference</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{payment.paymentReference}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Amount Paid</span>
              <span className="font-bold text-slate-900 text-sm">₦{payment.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Submission Date</span>
              <span className="font-medium text-slate-900">{new Date(payment.paymentDate).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verification Status</span>
              <Badge status={payment.status} />
            </div>
          </div>

          {payment.remarks && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-0.5">Bursary Remarks:</span>
              <span className="text-slate-600">{payment.remarks}</span>
            </div>
          )}

          {payment.status === 'Verified' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Payment Fully Verified!</strong> Your accommodation payment has been confirmed by Bursary. Your room allocation is secure.
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Submit Payment Reference Number
          </h2>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Payment reference submitted successfully for Bursary clearance!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remita Retrieval Reference (RRR) / Bank Teller Number *
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. REMITA-8849201923"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-mono outline-hidden"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Enter the 12-digit RRR generated on www.remita.net for Federal Polytechnic Ukana.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Submit Payment Reference
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
