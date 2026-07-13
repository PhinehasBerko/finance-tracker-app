import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

type Mode = 'login' | 'sign-up' | 'forgot-password';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
};

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validate =(form:FormState, mode: Mode) => {
  const errors : FormErrors = {};
  if (!form.email) {
    errors.email = 'Email is required';
  } else if(!EMAIL_RE.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (mode ==='forgot-password') return errors;

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (mode === 'sign-up' && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
};

interface LoginProps {
  onSuccess?: () => void;
}
export const Login = ({onSuccess}: LoginProps) => {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] =  useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Field helper
  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>{
    setForm(prev => ({...prev, [key]: value}));
    if (error[key as keyof FormErrors]) {
      setError( prev => ({...prev, [key]: undefined}));
    };
    if (serverError) setServerError(null);
    if (successMsg) setSuccessMsg(null);

  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError({});
    setServerError(null);
    setSuccessMsg(null);
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const validationErrors = validate(form, mode);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return;
    }

    setLoading (true);
    try {
      if (mode === 'login') {
       await Meteor.loginWithPasswordAsync(form.email, form.password);
        onSuccess?.();

      } else if (mode === 'sign-up') {
        new Promise<void>((resolve, reject) => {
          Accounts.createUser(
            {email: form.email, password: form.password},
            (err) => (err ? reject(err) : resolve()),
          );
        });
        onSuccess?.();

      } else if (mode === 'forgot-password') {
        new Promise<void>((resolve, reject) => {
          Accounts.forgotPassword({email: form.email}, (err) => err ? reject(err): resolve());
        });
        setSuccessMsg('Password reset, email sent - check your inbox.');
      }
    } catch (err: any) {
      setServerError(err?.reason ?? err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setServerError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        Meteor.loginWithGoogle(
        { requestPermissions: ['email', 'profile'], loginStyle: 'popup'},
        (err) => (err? reject(err) : resolve())
        );
      })
      onSuccess?.();
    } catch (err: any) {
      setServerError(err?.reason ?? err?.message ?? 'Google sign-in failed.');
    } finally {
      setLoading(false)
    }
  };
  const title = mode === 'login' ? 'Sign In' 
              : mode === 'sign-up' ? 'Create Account'
              : 'Reset email';
  
  const submitLabel = mode === 'login' ? 'Sign In' 
              : mode === 'sign-up' ? 'Create Account'
              : 'Send reset email';

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white shadow-sm border border-gray-200 p-8 flex flex-col gap-6 rounded-2xl'>
        {/* Title */}
        <div className='text-center' >
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          <p className='text-sm text-gray-500 mt-1'>
            {mode === 'login' && 'Welcome to Pocketly'}
            {mode === 'sign-up' && 'Start tracking your finances'}
            {mode === 'forgot-password' && 'We"ll send you a reset link to your email'}
          </p>
        </div>

        {/* Server error / success message */}
        {serverError && <div role='alert' className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{serverError}</div>}
        {successMsg && <div role='status' className='p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl'>{successMsg}</div>}

      <form 
      onSubmit={handleSubmit}
      noValidate
      aria-label={title}
      className='flex flex-col gap-4'
      >
      
        <div className='flex flex-col gap-1'>
          <label htmlFor="email" className='text-sm font-medium text-gray-700'>
            Email
          </label>
          <input 
            type="email" 
            id='email' 
            autoComplete='email'
            placeholder='you@example.com'
            value= {form.email}
            onChange= { (e) => setField('email',e.currentTarget.value) }
            className= {`
              w-full px-3 py-2.5 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              disabled:opacity-50 transition-colors 
              ${error.email ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {error.email && 
            <span id='email-error' role='alert' className='text-xs text-red-500'>
              {error.email}
            </span>
          }
        </div>
        {/* Password - hidden in forgot mode */}
        { mode !== 'forgot-password' && (
          <div className='flex flex-col gap-1'>
            <div className='flex justify-between items-center'>
              <label htmlFor="password" className='text-sm font-medium text-gray-700'>
                Password
              </label>
              { mode === 'login' && (
                <button
                  type='button'
                  onClick={ () => switchMode('forgot-password')}
                  className='text-xs text-blue-600 hover:underline'
                >
                  Forgot password
                </button>
              )}
            </div>
            <input 
              type="password" 
              id="password" 
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} 
              placeholder='........'
              value={form.password}
              onChange={e => setField('password', e.target.value)}
              aria-describedby={error.password ? 'password-error' : undefined}
              aria-invalid = {!!error.password}
              disabled= {loading}
              className={`
                w-full px-3 py-2.5 border rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 transition-colors
                ${error.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}
                `}
            />
            {error.password && (
              <span id='password-error' role='alert' className='text-xs text-red-500'>
                {error.password}
              </span>
            )}
          </div>
        )}

        {/* Confirm password - signup only */}
    {mode === 'sign-up' && (

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">

                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setField('confirmPassword', e.target.value)}
                aria-describedby={error.confirmPassword ? 'confirm-error' : undefined}
                aria-invalid={!!error.confirmPassword}
                disabled={loading}
                className={`
                  w-full px-3 py-2.5 border rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:opacity-50 transition-colors
                  ${error.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}
                `}
              />
              {error.confirmPassword && (
                <span id="confirm-error" role="alert" className="text-xs text-red-500">
                  {error.confirmPassword}
                </span>
              )}
            </div>
          )}
 
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-xl font-semibold text-sm text-white
              bg-blue-600 hover:bg-blue-500 active:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {mode === 'forgot-password' ? 'Sending…' : mode === 'sign-up' ? 'Creating account…' : 'Signing in…'}
              </>
            ) : submitLabel}
          </button>
        </form>
 
        {/* ── OAuth — hidden in forgot mode ── */}
        {mode !== 'forgot-password' && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
 
            {/* Google — border required by Google brand guidelines on white bg */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-3
                py-2.5 px-4 rounded-xl border border-gray-300
                bg-white hover:bg-gray-50 active:bg-gray-100
                text-sm font-medium text-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.15 8.74 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.42h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.98 3.39-4.89 3.39-8.47z"/>
                <path fill="#FBBC05" d="M5.1 14.7c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.5 7.5C.54 9.41 0 11.64 0 14s.54 4.59 1.5 6.5l3.6-2.8z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.93l-3.66-2.84c-1.1.74-2.52 1.18-4.3 1.18-3.26 0-5.99-2.11-6.98-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}
 
        {/* ── Mode switcher ── */}
        <p className="text-center text-sm text-gray-500">
          {mode === 'login' && (
            <>Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('sign-up')} className="text-blue-600 font-medium hover:underline">
                Sign up
              </button>
            </>
          )}
          {mode === 'sign-up' && (
            <>Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')} className="text-blue-600 font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
          {mode === 'forgot-password' && (
            <button type="button" onClick={() => switchMode('login')} className="text-blue-600 font-medium hover:underline">
              ← Back to sign in
            </button>
          )}
        </p>
 
      </div>
    </div>
  );

};