import React from 'react';

const SupportHelpPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🛠️ AskHire – Support & Help Center</h1>

      <p className="mb-6">
        Welcome to the AskHire Support & Help Center! Whether you're a <strong>Candidate</strong>,{' '}
        <strong>Manager</strong> or <strong>Admin</strong>, we’re here to ensure your recruitment experience is
        smooth, efficient, and stress-free.
      </p>

      {/* Quick Links */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔍 Quick Links</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><a href="#faqs" className="text-blue-600 hover:underline">FAQs</a></li>
          <li><a href="#contact-support" className="text-blue-600 hover:underline">Contact Support</a></li>
          <li><a href="#troubleshooting" className="text-blue-600 hover:underline">Troubleshooting Guide</a></li>
          <li><a href="#user-manuals" className="text-blue-600 hover:underline">User Manuals</a></li>
          <li><a href="#privacy" className="text-blue-600 hover:underline">Privacy & Security</a></li>
          <li><a href="#system" className="text-blue-600 hover:underline">System Requirements</a></li>
        </ul>
      </section>

      {/* FAQs */}
      <section id="faqs" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🙋‍♂️ Frequently Asked Questions (FAQs)</h2>

        <div className="mb-4">
          <h3 className="font-bold text-lg">Candidates</h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>How do I upload my CV?</strong> Go to your dashboard, click "Upload CV", and select a PDF or DOCX file.</li>
            <li><strong>What does my CV Match Score mean?</strong> It shows how well your CV matches the job using AI.</li>
            <li><strong>Can I reapply for the same job?</strong> Only if the listing is still open and your previous application expired or was withdrawn.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-lg">Managers</h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>How do I create a new job posting?</strong> Go to "Job Listings" → "Create New Job" → Fill details → Publish.</li>
            <li><strong>Can I schedule interviews automatically?</strong> Yes, use the "Interview Scheduler" with your available slots.</li>
            <li><strong>How do I evaluate CVs?</strong> Use the AI scores and manually review candidate profiles.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg">Admins</h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>How do I manage users and roles?</strong> Go to "Admin Panel" → "User Management" to assign roles, reset passwords, etc.</li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🧩 Troubleshooting Guide</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>CV Upload Not Working:</strong> File must be under 5MB, PDF/DOCX only. Try clearing cache or using another browser.</li>
          <li><strong>Didn’t Receive Confirmation Email:</strong> Check your spam folder and ensure your email is correct.</li>
          <li><strong>Login Issues:</strong> Use “Forgot Password?” or contact support.</li>
        </ul>
      </section>

      {/* User Manuals */}
      <section id="user-manuals" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📚 User Manuals</h2>
        <p>Download detailed guides:</p>
        <ul className="list-disc ml-6 mt-2">
          <li><a href="/docs/candidate-guide.pdf" className="text-blue-600 hover:underline">Candidate User Guide (PDF)</a></li>
          <li><a href="/docs/hr-manager-guide.pdf" className="text-blue-600 hover:underline">HR Manager Guide (PDF)</a></li>
          <li><a href="/docs/admin-manual.pdf" className="text-blue-600 hover:underline">Admin Portal Manual (PDF)</a></li>
        </ul>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🔒 Privacy & Security</h2>
        <p>
          AskHire uses end-to-end encryption to secure your data. We are compliant with data protection regulations like GDPR.{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">Read our Privacy Policy</a>.
        </p>
      </section>

      {/* System Requirements */}
      <section id="system" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🖥️ System Requirements</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Browser:</strong> Latest versions of Chrome, Firefox, or Edge</li>
          <li><strong>Device:</strong> PC, Laptop, Tablet, or Mobile (responsive design supported)</li>
          <li><strong>Internet:</strong> Stable internet connection recommended</li>
        </ul>
      </section>

      {/* Contact Support */}
      <section id="contact-support" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📞 Contact Support</h2>
        <p>If you need further assistance, reach out to us:</p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Email:</strong> <a href="mailto:support@askhire.com" className="text-blue-600 hover:underline">support@askhire.com</a></li>
          <li><strong>Phone:</strong> +94 71 123 4567</li>
          <li><strong>Live Chat:</strong> Weekdays 9AM - 6PM IST</li>
          <li><strong>Response Time:</strong> Within 24 hours</li>
        </ul>
      </section>

      <div className="mt-8">
        <p>💡 Have feedback or suggestions? <a href="mailto:feedback@askhire.com" className="text-blue-600 hover:underline">Let us know</a>.</p>
      </div>
    </div>
  );
};

export default SupportHelpPage;
