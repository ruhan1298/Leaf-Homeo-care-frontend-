import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Users, 
  Calendar, 
  CreditCard, 
  Truck, 
  BarChart3, 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  User
} from "lucide-react";

// Brand color - kept for compatibility
export const BRAND = "#00B100";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Stethoscope, label: "Doctors", path: "/admin/doctors" },
  { icon: Users, label: "Patients", path: "/admin/patients" },
  { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Truck, label: "Courier Tracking", path: "/admin/courier" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: User, label: "Profile", path: "/admin/profile" },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-dark text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 text-white decoration-transparent">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/30">
              🌿
            </span>
            <span className="font-sans text-lg font-bold tracking-tight">
              Leaf Homeo
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="rounded-lg p-1 hover:bg-white/10 lg:hidden text-white/80"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 decoration-transparent ${
                  isActive 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.02]" 
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-white/70"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function TopHeader({ setSidebarOpen }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-6 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block w-72 md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search patients, doctors..."
            className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-sm outline-hidden focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right side: notifications + profile */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-brand-light flex items-center justify-center font-bold text-brand-dark text-sm border border-brand-primary/10">
              AD
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">▾</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-fadeIn">
              <Link
                to="/admin/profile"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors decoration-transparent"
              >
                <User size={15} className="text-gray-400" />
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/admin/login";
                }}
                className="flex w-full items-center gap-2 rounded-lg border-t border-gray-50 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} className="text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-5 px-6 border-t border-gray-100 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} Leaf Homeo Care. All rights reserved.
    </footer>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-800 font-sans antialiased">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
