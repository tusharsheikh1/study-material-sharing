import React from 'react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center mb-6">Terms & Conditions</h1>

        <p className="text-lg">
          Welcome to <strong>Track Mark</strong>. By using this platform, you agree to abide by the following terms and conditions. Please read them carefully.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Use of Platform</h2>
          <p>
            Track Mark is a centralized educational resource sharing platform. You must use it for academic purposes only.
            Any misuse, including spamming, uploading harmful content, or harassment, will result in account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Content Ownership</h2>
          <p>
            All materials uploaded remain the intellectual property of the respective uploader. By uploading, you grant Track Mark the right to display and distribute the content within the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Accuracy of Information</h2>
          <p>
            We strive to ensure the content is helpful and accurate, but Track Mark is not responsible for any academic or personal consequences from using outdated or incorrect materials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. User Conduct</h2>
          <p>
            Users must maintain respectful behavior. Any misconduct, hate speech, or intentional disruption of the platform may lead to permanent ban.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Account Termination</h2>
          <p>
            Admins reserve the right to approve, reject, or suspend accounts based on behavior, misuse, or false identity. All decisions are final.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Modifications</h2>
          <p>
            Track Mark reserves the right to update these terms at any time. Changes will be communicated via platform notifications or email.
          </p>
        </section>

        <p className="text-sm text-center mt-12 text-gray-500 dark:text-gray-400">
          Last updated: April 23, 2025
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
