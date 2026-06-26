import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-left leading-relaxed text-theme-sub text-sm">
      <h1 className="text-3xl font-extrabold text-theme-text mb-4">Terms of Service</h1>
      <p className="mb-4">Last Updated: June 26, 2026</p>

      <p className="mb-6 font-normal">
        By accessing and practicing on TypeSprint, you agree to comply with and be bound by the following Terms of Service.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">1. Acceptable Practice Rules</h3>
      <p className="mb-4">
        - Users must not deploy typing bots, automation macros, or external scripts to artificially inflate scores on global leaderboards. Doing so will result in permanent profile ban.
      </p>
      <p className="mb-4">
        - Creating fraudulent certificates using modified DOM elements or requesting unauthorized Postgres edits is strictly forbidden.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">2. Digital Credentials</h3>
      <p className="mb-4">
        Certificates issued are property of TypeSprint, backed by validated database records. We reserve the right to revoke certificates if users are found in violation of fairness rules.
      </p>

      <h3 className="font-bold text-theme-text text-base mt-6 mb-2">3. Limitation of Liability</h3>
      <p className="mb-4">
        TypeSprint is provided on an "as is" and "as available" basis. We make no warranties regarding uninterrupted service, audio synthesis failures, or database migration logs.
      </p>
    </div>
  );
};
export default Terms;
