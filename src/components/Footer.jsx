import React from "react";
import { Leaf, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EAE5E0] text-stone-700 pt-12 pb-6 border-t border-stone-300">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Column 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#1C3F24] font-bold text-base">
            <Leaf className="h-5 w-5 text-[#00B100]" fill="#00B100" />
            <span>LEAF Care</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
            Premium vitality through nature. Bringing the finest homeopathic care to your digital doorstep.
          </p>
        </div>

        {/* Column 2: Patient Links */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3.5">Patient Links</h5>
          <ul className="space-y-2 text-xs font-semibold text-stone-700">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Clinic Locator</a></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3.5">Support</h5>
          <ul className="space-y-2 text-xs font-semibold text-stone-700">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Support</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3.5">Newsletter</h5>
          <div className="flex items-center bg-white border border-stone-300 rounded-xl p-1 max-w-xs">
            <input 
              type="email" 
              placeholder="Vitality tips..." 
              className="w-full bg-transparent px-3 py-1.5 text-xs outline-none text-stone-800 font-medium"
            />
            <button className="bg-[#00B100] text-white p-2 rounded-lg hover:bg-[#009000] transition-colors">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Legal bar */}
      <div className="mx-auto max-w-6xl px-6 pt-6 border-t border-stone-300/60 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-semibold gap-2">
        <span>© 2024 LEAF Homeo Care. Premium Vitality Through Nature.</span>
        <div className="flex items-center gap-4 text-stone-400">
          <span>Global standard clinical system</span>
        </div>
      </div>
    </footer>
  );
}