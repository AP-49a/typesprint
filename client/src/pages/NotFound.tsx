import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <HelpCircle className="text-theme-main animate-bounce mb-5" size={64} />
      <h1 className="text-4xl font-extrabold text-theme-text font-mono">404 - Lost in Sprint</h1>
      <p className="text-sm text-theme-sub mt-3 max-w-sm">
        The page you are looking for has run out of time, changed lanes, or does not exist.
      </p>
      <Link
        to="/test"
        className="mt-8 px-6 py-3 rounded-xl bg-theme-main text-black font-semibold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} /> Return to Typing Test
      </Link>
    </div>
  );
};
export default NotFound;
