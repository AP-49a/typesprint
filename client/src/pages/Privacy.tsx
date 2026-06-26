import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-left leading-relaxed text-theme-sub text-sm">
      <h1 className="text-3xl font-extrabold text-theme-text mb-4">Privacy Policy</h1>
      <p className="mb-4">Last Updated: June 26, 2026</p>

      <p className="mb-6">
        At TypeSprint, we prioritize the privacy and security of our users. This Privacy Policy details how we collect, process, and safeguard your data when you visit our platform.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">1. Data We Collect</h3>
      <p className="mb-4">
        - **Account Information:** Email address, username, password, display name, and generated robot avatars when registering.
      </p>
      <p className="mb-4">
        - **Performance Statistics:** Typing test results including Gross WPM, Net WPM, accuracy ratios, incorrect key logs, durations, and completion timestamps.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">2. How We Use Data</h3>
      <p className="mb-4 font-normal">
        We utilize collected metrics exclusively to calculate user profiles, update the weekly global rankings leaderboard, generate PDF credentials, and improve typing sound synthesis.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">3. Storage &amp; Safety</h3>
      <p className="mb-4">
        Passwords are encrypted using cryptographically secure hashing functions (`bcryptjs`) before database persistence. Verified credentials are publicly visible at `/verify/:id` to support professional job applications.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">4. Third-Party Services</h3>
      <p className="mb-4">
        TypeSprint uses QR Code APIs to render certificate links. No user data is traded or sold to advertisement agencies.
      </p>
    </div>
  );
};
export default Privacy;
