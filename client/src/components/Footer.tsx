import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-8 px-4 md:px-8 border-t border-theme-sub/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 font-bold text-lg text-theme-main">
            <span>⚡</span>
            <span>TypeSprint</span>
          </div>
          <p className="text-xs text-theme-sub text-center md:text-left">
            The ultimate modern keyboard testing and certification ground.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-theme-sub font-medium">
          <Link to="/about" className="hover:text-theme-text transition-colors">About</Link>
          <Link to="/contact" className="hover:text-theme-text transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-theme-text transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-theme-text transition-colors">Terms</Link>
        </div>

        {/* Social / Info */}
        <div className="flex items-center gap-4 text-theme-sub">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-theme-text transition-colors"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-theme-text transition-colors"
            title="Twitter"
          >
            <Twitter size={18} />
          </a>
          <a
            href="mailto:support@typesprint.com"
            className="hover:text-theme-text transition-colors"
            title="Support"
          >
            <Mail size={18} />
          </a>
          <Link
            to="/about#faq"
            className="hover:text-theme-text transition-colors"
            title="FAQs"
          >
            <HelpCircle size={18} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-theme-sub/5 flex justify-center text-center">
        <p className="text-xs text-theme-sub">
          &copy; {new Date().getFullYear()} TypeSprint. All rights reserved. Created with absolute keyboard precision.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
