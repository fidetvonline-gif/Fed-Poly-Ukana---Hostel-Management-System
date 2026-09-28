import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-200">
            Federal Polytechnic Ukana — Directorate of Student Affairs
          </p>
          <p className="text-slate-400 mt-0.5">
            P.M.B. 1004, Essien Udim Local Government Area, Akwa Ibom State, Nigeria
          </p>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Official Portal v1.0 MVP</span>
          <span aria-hidden="true">·</span>
          <span>Helpdesk: info@fedpolyukana.edu.ng</span>
          <span aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()} Federal Polytechnic Ukana</span>
        </div>
      </div>
    </footer>
  );
};
