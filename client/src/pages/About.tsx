import React from 'react';
import { Award, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-left leading-relaxed">
      <h1 className="text-3xl font-extrabold text-theme-text mb-4">About TypeSprint</h1>
      <p className="text-theme-sub text-base mb-6">
        TypeSprint is a modern keyboard evaluation engine and verification system. Developed for software engineers, digital professionals, and keyboard enthusiasts, it aims to deliver clean performance testing and cryptographic authenticity tracking.
      </p>

      <h2 className="text-xl font-bold text-theme-text mt-8 mb-3">Our Core Philosophy</h2>
      <p className="text-theme-sub text-sm mb-4">
        We believe that writing code and documentation should feel fluid. Speed is a byproduct of accuracy. By training on TypeSprint, you learn to suppress immediate typing corrections and cultivate absolute key muscle memory. We focus heavily on rendering performance, typing scroll mechanics, and mathematically verified speed calculations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10">
          <Award className="text-theme-main mb-3" size={24} />
          <h3 className="font-bold text-theme-text text-sm mb-1.5">Official Credentials</h3>
          <p className="text-xs text-theme-sub">
            Say goodbye to fake screenshots. Claim a public URL certificate with unique cryptographic ID formats like TS-YYYY-XXXXXX, scanning to immediate database validation links.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-theme-sub/10">
          <ShieldCheck className="text-theme-main mb-3" size={24} />
          <h3 className="font-bold text-theme-text text-sm mb-1.5">PostgreSQL Verification</h3>
          <p className="text-xs text-theme-sub">
            All certifications link to deep typing logs generated directly by our Express servers during tests. We preserve test parameters (WPM, Accuracy, Date) to prevent fraud.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-theme-text mt-8 mb-3">Get in Touch</h2>
      <p className="text-theme-sub text-sm mb-6">
        If you have feedback, feature suggestions, or business inquiries, feel free to email our core engineering team directly at:
      </p>
      <div className="flex items-center gap-2 text-theme-main font-semibold text-sm bg-theme-main/5 border border-theme-main/20 p-4 rounded-xl max-w-sm">
        <Mail size={16} />
        <span>team@typesprint.com</span>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/test"
          className="inline-flex items-center gap-2 px-6 py-3 bg-theme-main text-black font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          Take a Speed Test <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
export default About;
