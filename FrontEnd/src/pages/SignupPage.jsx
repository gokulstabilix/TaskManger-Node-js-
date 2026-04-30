import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/FormInput';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error: apiError, isAuthenticated, clearError } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => () => clearError(), []);

  const validate = (values) => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!values.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email';
    if (!values.password) errs.password = 'Password is required';
    else if (values.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const v = validate({ ...form, [name]: value });
      setErrors((p) => ({ ...p, [name]: v[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const v = validate(form);
    setErrors((p) => ({ ...p, [name]: v[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(v).length > 0) return;
    await signup(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Join TaskFlow to manage your tasks efficiently</p>
          </div>

          {apiError && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormInput id="name" label="Full Name" value={form.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} icon={<User size={18} />} placeholder="John Doe" autoComplete="name" />
            <FormInput id="email" label="Email Address" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} icon={<Mail size={18} />} placeholder="you@example.com" autoComplete="email" />
            <FormInput id="password" label="Password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} icon={<Lock size={18} />} placeholder="••••••••" autoComplete="new-password" />

            <button type="submit" id="signup-submit-btn" disabled={isLoading} className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all duration-200 ${isLoading ? 'bg-primary-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98]'}`}>
              {isLoading ? (<><Loader2 size={18} className="animate-spin" /> Creating account…</>) : (<>Create Account <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">Sign in</Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">By signing up you agree to our Terms of Service</p>
      </div>
    </div>
  );
};
