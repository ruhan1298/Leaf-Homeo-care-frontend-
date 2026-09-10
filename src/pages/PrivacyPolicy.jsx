import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { getPrivacyPolicy } from '../api/legalApi';

const PrivacyPolicy = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPrivacyPolicy();
        if (response.status === 1) {
          setContent(response.data);
        } else {
          // If no content found, show default content
          setContent({
            text: getDefaultPrivacyContent(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        // Show default content on error instead of error state
        setContent({
          text: getDefaultPrivacyContent(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getDefaultPrivacyContent = () => {
    return `
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, including name, email address, phone number, and medical history relevant to homeopathic treatment. We also collect information about your use of our services.</p>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about your consultations, and to comply with legal obligations.</p>
      
      <h2>3. Information Sharing</h2>
      <p>We do not sell, trade, or rent your personal identification information to others. We may share your information with our certified homeopathic practitioners solely for the purpose of providing you with consultation services.</p>
      
      <h2>4. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted and stored securely.</p>
      
      <h2>5. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal information. You may also opt out of receiving communications from us at any time.</p>
      
      <h2>6. Cookies</h2>
      <p>We use cookies to enhance your experience on our platform. You can set your browser to refuse cookies, but some parts of our services may not function properly without them.</p>
      
      <h2>7. Third-Party Services</h2>
      <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices of such third-party sites. We encourage you to read the privacy statements of each site you visit.</p>
      
      <h2>8. Changes to Privacy Policy</h2>
      <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.</p>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600">{error}</p>
        <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Link>

        {/* Header Card */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg mb-6">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500 mt-1">Last updated: {content?.updatedAt || 'N/A'}</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: content?.text || 'No content available' }}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Contact Information
          </h3>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@leafhomeocare.com" className="text-blue-600 font-medium hover:underline">
              privacy@leafhomeocare.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
