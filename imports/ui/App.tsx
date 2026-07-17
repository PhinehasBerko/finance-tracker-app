import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Login } from './Login';
import Dashboard from './Dashboard';

export const App = () => {
  const {user, isLoading } = useTracker(() => ({
    user: Meteor.user(),
    isLoading: Meteor.loggingIn(),
  }),[]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }
  if (!user) {
    return <Login />
  }

  return <Dashboard />
};