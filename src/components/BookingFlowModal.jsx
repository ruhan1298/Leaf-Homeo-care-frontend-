import React, { useState, useEffect } from "react";
import { X, Zap, Users, ChevronRight, AlertCircle, Calendar } from "lucide-react";

export default function BookingFlowModal({ isOpen, onClose, selectedDoctor = null }) {
  // step 1: Choose Booking Type | step 2: Enter Details & Confirm
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState(selectedDoctor ? "specific" : null);
  
  // Form States
  const [symptom, setSymptom] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    if (selectedDoctor) {
      setBookingType("specific");
      setStep(2);
    } else {
      setBookingType(null);
      setStep(1);
    }
  }, [selectedDoctor, isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    if (selectedDoctor) {
      onClose();
    } else {
      setStep(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking Confirmed! Type: ${bookingType}, Symptom: ${symptom}`);
    onClose();
    setStep(1);
    setSymptom("");
    setPreferredTime("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      
      {/* Modal Card */}
      <div className="bg-white rounded-2xl w-full max-w-lg border border-gray-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
              {step === 1 ? "Start Consultation Booking" : "Consultation Details"}
            </h3>
            <p className="text-gray-400 text-xs font-semibold mt-0.5">
              {step === 1 ? "Select how you want to connect" : "Fill in your symptoms & schedule"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-grow">
          
          {/* ================= STEP 1: SELECT METHOD ================= */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Method 1: Open Request / Instant Pool */}
              <div 
                onClick={() => { setBookingType("open"); setStep(2); }}
                className={`group p-4 bg-white border rounded-2xl cursor-pointer transition-all flex items-start gap-4 ${
                  bookingType === "open" 
                    ? "border-brand-primary bg-brand-light/10" 
                    : "border-gray-200 hover:border-brand-primary hover:bg-gray-50/30"
                }`}
              >
                <div className="p-3 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10 shrink-0">
                  <Zap className="h-5 w-5" fill="currentColor" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-primary transition-colors">
                      Instant Broadcast (Open Request)
                    </h4>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-xs font-medium mt-1 leading-relaxed">
                    यह रिक्वेस्ट सीधे हमारे सभी लाइव होमियोपैथ्स के **'पूल'** में चली जाएगी। जो भी डॉक्टर सबसे पहले एक्सेप्ट करेगा, वह तुरंत आपसे जुड़ जाएगा। इमरजेंसी के लिए बेस्ट!
                  </p>
                </div>
              </div>

              {/* Method 2: Specific Doctor from Our Experts */}
              <div 
                onClick={() => { setBookingType("specific"); setStep(2); }}
                className={`group p-4 bg-white border rounded-2xl cursor-pointer transition-all flex items-start gap-4 ${
                  bookingType === "specific" 
                    ? "border-brand-primary bg-brand-light/10" 
                    : "border-gray-200 hover:border-brand-primary hover:bg-gray-50/30"
                }`}
              >
                <div className="p-3 bg-gray-50 text-gray-500 group-hover:bg-brand-light group-hover:text-brand-primary rounded-xl border border-gray-200/60 transition-colors shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-primary transition-colors">
                      Choose an Expert (Specific Selection)
                    </h4>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-xs font-medium mt-1 leading-relaxed">
                    अगर आप किसी खास डॉक्टर से ही इलाज कराना चाहते हैं, तो यह ऑप्शन चुनें। आप उनके पर्सनल कैलेंडर से अपना मनपसंद टाइम स्लॉट बुक कर सकते हैं।
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 2: ENTER DETAILS ================= */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Context Label based on Selection */}
              <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
                {bookingType === "open" ? (
                  <>
                    <Zap className="h-4 w-4 text-brand-primary" fill="currentColor" />
                    <p className="text-xs font-bold text-gray-700">Mode: Open Broadcast Request (To All Available Doctors)</p>
                  </>
                ) : (
                  <>
                    <img 
                      src={selectedDoctor?.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80"} 
                      alt="Doctor" 
                      className="w-8 h-8 rounded-xl object-cover border border-gray-200" 
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {selectedDoctor ? `Booking with ${selectedDoctor.name}` : "Mode: Specific Expert Selection"}
                      </p>
                      {selectedDoctor && <p className="text-[10px] font-semibold text-gray-400">{selectedDoctor.specialty}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Input: Symptoms */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Describe Your Symptoms / Problem</label>
                <textarea 
                  required
                  rows={3}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="जैसे: मुझे पिछले 2 दिनों से सर्दी, खांसी और हल्का बुखार है..."
                  className="w-full text-sm font-medium p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50/50 text-gray-800 resize-none"
                />
              </div>

              {/* Input: Preferred Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Preferred Date & Time Slot</label>
                <div className="relative">
                  <input 
                    required
                    type="datetime-local" 
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-sm font-medium p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-brand-primary bg-gray-50/50 text-gray-800"
                  />
                </div>
              </div>

              {/* Quick Disclaimer */}
              <div className="flex items-start gap-2 text-[11px] text-gray-400 font-semibold p-3 bg-brand-light/20 rounded-xl border border-brand-primary/10">
                <AlertCircle className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <p>होम्योपैथी कंसल्टेशन पूरी तरह से डिजिटल और सुरक्षित वीडियो कॉल के माध्यम से होगी। कृपया अपॉइंटमेंट समय पर उपलब्ध रहें।</p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-2.5 rounded-xl bg-brand-primary text-xs font-bold text-white hover:bg-brand-hover shadow-md shadow-brand-primary/20 transition-all cursor-pointer text-center"
                >
                  Confirm Appointment
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}