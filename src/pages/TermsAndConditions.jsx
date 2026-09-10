import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import { getTermsConditions } from '../api/legalApi';

const TermsAndConditions = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTermsConditions();
        if (response.status === 1) {
          setContent(response.data);
        } else {
          // If no content found, show default content
          setContent({
            text: getDefaultTermsContent(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error fetching terms:', err);
        // Show default content on error instead of error state
        setContent({
          text: getDefaultTermsContent(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getDefaultTermsContent = () => {
    return `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Leaf Homeo Care services, you accept and agree to be bound by the terms and provisions of this agreement.</p>
      
      <h2>2. Medical Disclaimer</h2>
      <p>The information provided on this platform is for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider.</p>
      
      <h2>3. User Responsibilities</h2>
      <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to notify us immediately of any unauthorized use of your account.</p>
      
      <h2>4. Services</h2>
      <p>Leaf Homeo Care provides homeopathic consultation services through certified practitioners. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.</p>
      
      <h2>5. Privacy Policy</h2>
      <p>Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs our services and describes how we collect, use, and protect your personal information.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>Leaf Homeo Care shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of our services.</p>
      
      <h2>7. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the service following any such changes constitutes your acceptance of the new terms.</p>
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
          <div className="h-48 bg-gradient-to-r from-green-600 to-green-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
                <FileText className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Terms & Conditions</h1>
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
            <FileText className="h-5 w-5 text-green-600" />
            Contact Information
          </h3>
          <p className="text-gray-600">
            If you have any questions about these Terms & Conditions, please contact us at{' '}
            <a href="mailto:support@leafhomeocare.com" className="text-green-600 font-medium hover:underline">
              support@leafhomeocare.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
