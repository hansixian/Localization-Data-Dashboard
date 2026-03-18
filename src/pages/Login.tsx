import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <Globe className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          GMPT Localization
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Data Dashboard for Stakeholders & XFNs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Lark SSO Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all bg-white/50"
                  placeholder="hansixian@bytedance.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Sign in with Lark SSO
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-400 font-medium">
                  Demo Accounts
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button onClick={() => { login('admin@bytedance.com'); navigate('/dashboard'); }} className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                Admin
              </button>
              <button onClick={() => { login('internal@bytedance.com'); navigate('/dashboard'); }} className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                Internal
              </button>
              <button onClick={() => { login('external@bytedance.com'); navigate('/dashboard'); }} className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                External
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
