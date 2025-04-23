import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>

        <p className="text-lg">
          At <strong>Track Mark</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
          use, and safeguard your information when you use our platform.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            We may collect your name, student ID, email address, uploaded content, and activity data within the app. This data is
            collected for authentication, dashboard personalization, and improving the platform experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To verify your identity and access permissions</li>
            <li>To display your uploaded content or track progress</li>
            <li>To send important notifications or approval updates</li>
            <li>To enhance the platform with analytics (anonymized)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
          <p>
            All your data is stored securely and encrypted. We follow industry-standard practices to protect your information
            from unauthorized access or loss.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
          <p>
            We do <strong>not</strong> sell or share your data with third parties. Your content and personal details remain private
            within the Track Mark platform and its internal operations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
          <p>
            You can request to delete your account or data by contacting us. We respect your rights and will take timely action
            to comply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy as needed. You’ll be notified of any changes through the platform or email.
          </p>
        </section>

        <p className="text-sm text-center mt-12 text-gray-500 dark:text-gray-400">
          This Privacy Policy was last updated on April 23, 2025.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
