import React, { useState } from 'react';
import { insertIncome } from '/imports/api/income/methods';

// type and interfaces
type Source = 'salary' | 'parent' | 'freelance' | 'gift' | 'other';

interface FormState {
  idempotencyKey: string,
  amount: string;       // string so the input stays controlled without NaN on empty
  source: Source | '';
  description: string;
  date: string;         // HTML date inputs always work with "YYYY-MM-DD" strings
  account_id: string;
  is_recurring: boolean;
}

interface FormErrors {
  amount?: string;
  source?: string;
  date?: string;
}

// Constants 
const SOURCES: { value: Source; label: string; icon: string }[] = [
  { value: 'salary', label: 'Salary', icon: '💼' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
  { value: 'freelance', label: 'Freelance', icon: '🛠️' },
  { value: 'gift', label: 'Gift', icon: '🎁' },
  { value: 'other', label: 'Other', icon: '•••' },
];

const today = (): string => new Date().toISOString().split('T')[0];

// Helpers 
const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  const parsed = parseFloat(form.amount);

  if (!form.amount || isNaN(parsed) || parsed < 0.01) {
    errors.amount = 'Enter a valid amount (minimum GHS 0.01).';
  }
  if (parsed > 1_000_000) {
    errors.amount = 'Amount cannot exceed GHS 1,000,000.';
  }
  if (!form.source) {
    errors.source = 'Select an income source.';
  }
  if (!form.date) {
    errors.date = 'Select a date.';
  }

  return errors;
};

// Component 
interface IncomeProps {
  onSuccess?: (newId: string) => void;  // e.g. navigate back to dashboard
  onCancel?: () => void;
}
const idempotencyKey = crypto.randomUUID();

const Income = ({ onSuccess, onCancel }: IncomeProps) => {

  const [form, setForm] = useState<FormState>({
    idempotencyKey: '',
    amount: '',
    source: '',
    description: '',
    date: today(),
    account_id: 'main_wallet',
    is_recurring: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Field helpers 

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear the specific error as soon as the user corrects the field
    if (errors[key as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  // Submit
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const newId = await insertIncome.callAsync({
        idempotencyKey,
        amount: parseFloat(form.amount),
        source: form.source as Source,
        description: form.description.trim() || undefined,
        date: new Date(form.date),   // convert string → Date for the method
        account_id: form.account_id,
        is_recurring: form.is_recurring,
      });

      onSuccess?.(newId as any);
    } catch (err: any) {
        console.log('Full error:', err);          // add this line
        console.log('Error reason:', err?.reason);
        console.log('Error message:', err?.message);
        console.log('Error error:', err?.error);
        setServerError(err?.reason ?? err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render 

  return (
    <form
      onSubmit={handleSubmit}
      noValidate     // disable browser built-in popups; we handle our own
      aria-label="Add income"
      className="
        bg-gray-900 border border-gray-700 rounded-2xl
        p-6 sm:p-8
        mx-auto w-full max-w-xl
        flex flex-col gap-6
        text-gray-100
      "
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg sm:text-2xl">Add income</h1>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-100 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Amount ── */}
      <fieldset className="flex flex-col gap-1">
        <legend className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          Amount
        </legend>
        <div className={`
          flex items-baseline gap-2 border rounded-xl px-4 py-3
          focus-within:border-blue-500 transition-colors
          ${errors.amount ? 'border-red-500' : 'border-gray-600'}
        `}>
          <span className="text-gray-400 text-base font-medium">GHS</span>
          <input
            type="text"
            inputMode="decimal"
            id="amount"
            required
            placeholder="0.00"
            value={form.amount}
            onChange={e => setField('amount', e.target.value)}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            aria-invalid={!!errors.amount}
            className="
              flex-1 bg-transparent border-none outline-none
              font-bold text-2xl sm:text-4xl text-white placeholder-gray-600
            "
          />
        </div>
        {errors.amount && (
          <p id="amount-error" role="alert" className="text-red-400 text-xs mt-1">
            {errors.amount}
          </p>
        )}
      </fieldset>

      {/* ── Source ── */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs uppercase tracking-widest text-gray-400 mb-1">
          Source
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SOURCES.map(({ value, label, icon }) => (
            <label
              key={value}
              className={`
                flex items-center gap-2 p-3 rounded-xl border cursor-pointer
                text-sm font-medium transition-colors select-none
                ${form.source === value
                  ? 'border-blue-500 bg-blue-950 text-blue-300'
                  : 'border-gray-600 hover:border-gray-400 text-gray-300'
                }
              `}
            >
              {/*
                Hide the native radio visually but keep it for
                keyboard nav and screen readers
              */}
              <input
                type="radio"
                name="source"
                value={value}
                checked={form.source === value}
                onChange={() => setField('source', value)}
                className="sr-only"
              />
              <span aria-hidden="true">{icon}</span>
              {label}
            </label>
          ))}
        </div>
        {errors.source && (
          <p role="alert" className="text-red-400 text-xs mt-1">
            {errors.source}
          </p>
        )}
      </fieldset>

      {/* ── Details ── */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs uppercase tracking-widest text-gray-400 mb-1">
          Details
        </legend>

        {/* description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-xs text-gray-400">
            Description <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="text"
            id="description"
            placeholder="e.g. June salary — ABC Ltd"
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            className="
              bg-transparent border border-gray-600 rounded-xl px-3 py-2
              text-sm text-white placeholder-gray-600
              focus:outline-none focus:border-blue-500 transition-colors
            "
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-xs text-gray-400">Date</label>
          <input
            type="date"
            id="date"
            value={form.date}
            onChange={e => setField('date', e.target.value)}
            aria-describedby={errors.date ? 'date-error' : undefined}
            aria-invalid={!!errors.date}
            className="
              bg-transparent border border-gray-600 rounded-xl px-3 py-2
              text-sm text-white
              focus:outline-none focus:border-blue-500 transition-colors
              [color-scheme:schema-dark]
            "
          />
          {errors.date && (
            <p id="date-error" role="alert" className="text-red-400 text-xs">
              {errors.date}
            </p>
          )}
        </div>

        {/* To account */}
        <div className="flex flex-col gap-1">
          <label htmlFor="account" className="text-xs text-gray-400">
            To account
          </label>
          <select
            id="account"
            value={form.account_id}
            onChange={e => setField('account_id', e.target.value)}
            className="
              bg-gray-800 border border-gray-600 rounded-xl px-3 py-2
              text-sm text-white
              focus:outline-none focus:border-blue-500 transition-colors
            "
          >
            <option value="main_wallet">Main wallet</option>
            {/* Future: map over user's real accounts from a subscription */}
          </select>
        </div>

        {/* Recurring */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            id="recurring_monthly"
            checked={form.is_recurring}
            onChange={e => setField('is_recurring', e.target.checked)}
            className="h-4 w-4 accent-blue-500"
          />
          <span className="text-sm text-gray-300">Recurring monthly</span>
        </label>
      </fieldset>

      {/* ── Server error ── */}
      {serverError && (
        <p role="alert" className="text-red-400 text-sm text-center">
          {serverError}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              flex-1 py-3 rounded-xl border border-gray-600
              text-sm font-medium text-gray-300
              hover:border-gray-400 transition-colors
              disabled:opacity-40
            "
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="
            flex-1 py-3 rounded-xl
            bg-blue-600 hover:bg-blue-500 active:bg-blue-700
            text-white font-semibold text-sm
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) : (
            'Save income'
          )}
        </button>
      </div>
    </form>
  );
};

export default Income;