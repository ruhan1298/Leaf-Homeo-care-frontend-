import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Package, 
  FileText, 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  User,
  Users,
  HeartPulse
} from "lucide-react";

// Brand color - kept for compatibility
export const BRAND = "#00B100";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/patient/dashboard" },
  { icon: Calendar, label: "Book Appointment", path: "/patient/book" },
  { icon: FileText, label: "My Appointments", path: "/patient/appointments" },
  { icon: Users, label: "Doctors", path: "/patient/doctors" },
  { icon: Bell, label: "Notifications", path: "/patient/notifications" },
  { icon: User, label: "Profile", path: "/patient/profile" },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    if (item.action === "book") {
      navigate(item.path);
    }
    setSidebarOpen(false);
  };

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
          <Link to="/patient/dashboard" className="flex items-center gap-2.5 text-white decoration-transparent">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/30 text-white font-bold">
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
                key={item.label}
                to={item.path}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 decoration-transparent ${
                  isActive 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.02]" 
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
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
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

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

        {/* Brand indicator for mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <HeartPulse className="text-brand-primary" size={20} />
          <span className="font-bold text-gray-800 text-sm">Patient Portal</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold bg-brand-light text-brand-dark px-3 py-1 rounded-full border border-brand-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          Patient Dashboard
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
            <div className="h-9 w-9 rounded-xl bg-brand-light flex items-center justify-center font-bold text-brand-dark text-sm border border-brand-primary/10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="User profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">▾</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-fadeIn">
              <button 
                onClick={() => { navigate("/patient/profile"); setShowProfileMenu(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={15} className="text-gray-400" />
                Profile
              </button>
              <button 
                onClick={() => { navigate("/patient/profile/edit"); setShowProfileMenu(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={15} className="text-gray-400" />
                Complete Profile
              </button>
              <button 
                onClick={() => { navigate("/patient/profile/change-password"); setShowProfileMenu(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={15} className="text-gray-400" />
                Change Password
              </button>
              <button 
                onClick={handleLogout}
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

export default function PatientLayout({ children }) {
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
