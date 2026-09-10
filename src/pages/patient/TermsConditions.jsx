import { useState, useEffect } from "react";
import { FileText, ArrowLeft, RefreshCw, AlertCircle, Scale, Gavel, CheckCircle2, Shield, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getTermsConditions } from "../../api/legalApi";

export default function TermsConditionsView() {
  const [termsConditions, setTermsConditions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTermsConditions();
  }, []);

  const fetchTermsConditions = async () => {
    try {
      setLoading(true);
      const response = await getTermsConditions();
      if (response.status === 1) {
        setTermsConditions(response.data.text || "");
      } else {
        setError("Failed to load Terms & Conditions");
      }
    } catch (error) {
      console.error("Error fetching terms & conditions:", error);
      setError("Failed to load Terms & Conditions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
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
              <Scale size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Terms & Conditions
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Please read our terms carefully to understand your rights and responsibilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Gavel size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Legal Compliance</p>
              <p className="text-sm text-gray-500">Regulatory standards</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Transparent Terms</p>
              <p className="text-sm text-gray-500">Clear guidelines</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Shield size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">User Protection</p>
              <p className="text-sm text-gray-500">Your rights secured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <RefreshCw size={48} className="animate-spin text-purple-600" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading Terms & Conditions...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchTermsConditions}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        ) : termsConditions ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Terms & Conditions Details</h2>
                  <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-li:text-gray-600">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {termsConditions}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 mx-auto mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Terms & Conditions</h3>
            <p className="text-gray-600">Terms & Conditions will be available soon.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Questions About Our Terms?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Our legal team is available to clarify any questions about our terms and conditions.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
            <Gavel size={20} />
            Contact Legal Team
          </button>
        </div>
      </div>
    </div>
  );
}
