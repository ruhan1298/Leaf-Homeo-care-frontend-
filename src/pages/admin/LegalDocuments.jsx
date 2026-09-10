import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FileText, Shield, Save, RefreshCw, AlertCircle } from "lucide-react";
import { 
  getPrivacyPolicy, 
  createPrivacyPolicy, 
  updatePrivacyPolicy,
  getTermsConditions,
  createTermsConditions,
  updateTermsConditions 
} from "../../api/legalApi";

export default function LegalDocuments() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [privacyPolicy, setPrivacyPolicy] = useState({ id: null, text: "" });
  const [termsConditions, setTermsConditions] = useState({ id: null, text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const [privacyRes, termsRes] = await Promise.all([
        getPrivacyPolicy().catch(err => ({ status: 0 })),
        getTermsConditions().catch(err => ({ status: 0 }))
      ]);

      if (privacyRes.status === 1) {
        setPrivacyPolicy({
          id: privacyRes.data.id,
          text: privacyRes.data.text || ""
        });
      }

      if (termsRes.status === 1) {
        setTermsConditions({
          id: termsRes.data.id,
          text: termsRes.data.text || ""
        });
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setMessage({ type: "error", text: "Failed to load documents" });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacyPolicy = async () => {
    if (!privacyPolicy.text.trim()) {
      setMessage({ type: "error", text: "Privacy Policy text cannot be empty" });
      return;
    }

    try {
      setSaving(true);
      let response;
      if (privacyPolicy.id) {
        response = await updatePrivacyPolicy({ id: privacyPolicy.id, text: privacyPolicy.text });
      } else {
        response = await createPrivacyPolicy({ text: privacyPolicy.text });
      }

      if (response.status === 1) {
        setMessage({ type: "success", text: "Privacy Policy saved successfully" });
        if (!privacyPolicy.id) {
          setPrivacyPolicy({ id: response.data.id, text: response.data.text });
        }
      } else {
        setMessage({ type: "error", text: response.message || "Failed to save" });
      }
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      setMessage({ type: "error", text: "Failed to save Privacy Policy" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTermsConditions = async () => {
    if (!termsConditions.text.trim()) {
      setMessage({ type: "error", text: "Terms & Conditions text cannot be empty" });
      return;
    }

    try {
      setSaving(true);
      let response;
      if (termsConditions.id) {
        response = await updateTermsConditions({ id: termsConditions.id, text: termsConditions.text });
      } else {
        response = await createTermsConditions({ text: termsConditions.text });
      }

      if (response.status === 1) {
        setMessage({ type: "success", text: "Terms & Conditions saved successfully" });
        if (!termsConditions.id) {
          setTermsConditions({ id: response.data.id, text: response.data.text });
        }
      } else {
        setMessage({ type: "error", text: response.message || "Failed to save" });
      }
    } catch (error) {
      console.error("Error saving terms & conditions:", error);
      setMessage({ type: "error", text: "Failed to save Terms & Conditions" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
          Legal Documents
        </h1>
        <p className="text-sm text-gray-500">Manage Privacy Policy and Terms & Conditions</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {message.type === "success" ? (
            <Shield size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-3 px-1 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "privacy"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`pb-3 px-1 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "terms"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Terms & Conditions
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xs p-6">
          {activeTab === "privacy" ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Privacy Policy</h2>
                  <p className="text-sm text-gray-500">Manage your privacy policy content</p>
                </div>
              </div>
              <textarea
                value={privacyPolicy.text}
                onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, text: e.target.value })}
                placeholder="Enter your Privacy Policy here..."
                className="w-full h-96 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm text-gray-700"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePrivacyPolicy}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Privacy Policy
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Terms & Conditions</h2>
                  <p className="text-sm text-gray-500">Manage your terms and conditions content</p>
                </div>
              </div>
              <textarea
                value={termsConditions.text}
                onChange={(e) => setTermsConditions({ ...termsConditions, text: e.target.value })}
                placeholder="Enter your Terms & Conditions here..."
                className="w-full h-96 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm text-gray-700"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveTermsConditions}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Terms & Conditions
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
