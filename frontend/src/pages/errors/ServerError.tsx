import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <ServerCrash className="h-20 w-20 text-red-500 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - Server Error</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! Something went wrong on our end. We're working to fix the issue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ServerError;