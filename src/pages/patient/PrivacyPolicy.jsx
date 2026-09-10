import { useState, useEffect } from "react";
import { Shield, ArrowLeft, RefreshCw, AlertCircle, Lock, Eye, Database, CheckCircle2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getPrivacyPolicy } from "../../api/legalApi";

export default function PrivacyPolicyView() {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const response = await getPrivacyPolicy();
      if (response.status === 1) {
        setPrivacyPolicy(response.data.text || "");
      } else {
        setError("Failed to load Privacy Policy");
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      setError("Failed to load Privacy Policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/patient/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
              <Shield size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Privacy Policy
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Your privacy is our priority. Learn how we protect your personal information and data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Lock size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Secure Encryption</p>
              <p className="text-sm text-gray-500">256-bit SSL protection</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">HIPAA Compliant</p>
              <p className="text-sm text-gray-500">Healthcare standards</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Database size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Data Protection</p>
              <p className="text-sm text-gray-500">Secure storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <RefreshCw size={48} className="animate-spin text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading Privacy Policy...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPrivacyPolicy}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        ) : privacyPolicy ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Eye size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Privacy Policy Details</h2>
                  <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-li:text-gray-600">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {privacyPolicy}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 mx-auto mb-6">
              <Shield size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Privacy Policy</h3>
            <p className="text-gray-600">Privacy Policy will be available soon.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Questions About Your Privacy?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Our team is here to help you understand how we protect your information.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
            <Shield size={20} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
