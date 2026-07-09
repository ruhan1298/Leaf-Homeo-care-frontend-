import React, { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-stone-200 w-full sticky top-0 z-50 shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 select-none">
          <Leaf className="h-6 w-6 text-[#00B100]" fill="#00B100" />
          <span className="font-serif text-xl font-black tracking-tight text-stone-900">
            LEAF HOMEO Care
          </span>
        </div>

        {/* 1. DESKTOP NAVIGATION (बड़ी स्क्रीन पर दिखेगा, मोबाइल पर hidden रहेगा) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
          <a href="#" className="text-[#00B100] border-b-2 border-[#00B100] pb-4 -mb-4">Dashboard</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Find Doctors</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Appointments</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Remedies</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Records</a>
        </nav>

        {/* Right Side: Profile & Hamburger Button */}
        <div className="flex items-center gap-4">
          {/* User Profile */}
          <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* HAMBURGER BUTTON (सिर्फ मोबाइल पर दिखेगा `md:hidden`) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-1 text-stone-600 hover:text-stone-900 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* 2. MOBILE DROPDOWN MENU (सिर्फ तब दिखेगा जब isOpen true होगा और स्क्रीन मोबाइल होगी) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 shadow-inner absolute w-full left-0 animate-fadeIn">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-stone-600">
            <a href="#" onClick={() => setIsOpen(false)} className="text-[#00B100] bg-emerald-50/50 px-3 py-2 rounded-xl">Dashboard</a>
            <a href="#" onClick={() => setIsOpen(false)} className="hover:text-stone-900 hover:bg-stone-50 px-3 py-2 rounded-xl transition-colors">Find Doctors</a>
            <a href="#" onClick={() => setIsOpen(false)} className="hover:text-stone-900 hover:bg-stone-50 px-3 py-2 rounded-xl transition-colors">Appointments</a>
            <a href="#" onClick={() => setIsOpen(false)} className="hover:text-stone-900 hover:bg-stone-50 px-3 py-2 rounded-xl transition-colors">Remedies</a>
            <a href="#" onClick={() => setIsOpen(false)} className="hover:text-stone-900 hover:bg-stone-50 px-3 py-2 rounded-xl transition-colors">Records</a>
          </nav>
        </div>
      )}
    </header>
  );
}