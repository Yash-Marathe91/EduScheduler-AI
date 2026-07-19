"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { 
  LayoutDashboard, Calendar, Building2, 
  GraduationCap, Settings, Bell, Moon, User,
  Home, Sparkles, Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole") || "admin");
    }
  }, []);

  const allNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "faculty", "student"] },
    { href: "/dashboard/timetable", icon: Calendar, label: "Timetable", roles: ["admin", "faculty", "student"] },
    { href: "/dashboard/departments", icon: Building2, label: "Departments", roles: ["admin"] },
    { href: "/dashboard/classrooms", icon: Building2, label: "Classrooms", roles: ["admin"] },
    { href: "/dashboard/subjects", icon: Building2, label: "Subjects", roles: ["admin"] },
    { href: "/dashboard/faculty", icon: GraduationCap, label: "Faculty", roles: ["admin"] },
    { href: "/dashboard/settings", icon: Settings, label: "Settings", roles: ["admin", "faculty", "student"] },
  ];

  const navItems = allNavItems.filter(item => !role || item.roles.includes(role));

  return (
    <div className="flex-1 flex min-h-screen relative w-full overflow-hidden bg-transparent">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen p-md gap-xs bg-surface/40 backdrop-blur-xl border-r border-outline-variant/30 w-72 flex-shrink-0 z-40 sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-sm mb-lg px-2 pt-2">
          <img src="/apple-touch-icon.png" alt="EduScheduler AI Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 object-cover bg-white" />
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-fixed-dim truncate">
              EduScheduler
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">AI Intelligence</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 flex-1 px-2 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "group relative flex items-center gap-sm p-3 rounded-xl transition-all duration-300 ease-out",
                  isActive 
                    ? "text-primary font-medium" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-xl -z-10" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
                )}
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-transform duration-300 ease-out group-hover:scale-110",
                    isActive ? "text-primary" : "opacity-80"
                  )} 
                />
                <span className="font-label-md text-label-md tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {(!role || role === 'admin') && (
          <div className="px-2 pb-4">
            <button className="group relative w-full overflow-hidden bg-primary text-on-primary py-3 px-4 rounded-xl font-label-md text-label-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:-translate-y-0.5 active:translate-y-0">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                New Schedule
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 bg-surface/50 backdrop-blur-xl border-b border-outline-variant/30 flex-shrink-0 transition-all duration-300">
          <div className="md:hidden flex items-center gap-xs">
            <span className="font-headline-md text-headline-md font-bold text-primary">EduScheduler</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-on-surface-variant group-focus-within:text-primary transition-colors duration-300" />
              </div>
              <input 
                type="text" 
                placeholder="Search resources, faculty, or classrooms..." 
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest/50 border border-outline-variant/50 focus:border-primary/50 focus:bg-surface rounded-full outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(var(--color-primary),0.1)] text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <button className="group text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
              <Bell size={20} className="group-hover:animate-wiggle" />
            </button>
            <button className="group text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
              <Moon size={20} className="group-hover:-rotate-12" />
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer ml-2 shadow-sm">
              <User size={18} className="text-primary" />
            </div>
          </div>
        </header>
        
        {/* Page Content Wrapped in GSAP Transition */}
        <PageTransition>
          {children}
        </PageTransition>
        
        {/* Bottom padding for mobile nav */}
        <div className="h-24 md:hidden"></div>
      </div>
      
      {/* BottomNavBar (Visible only on Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 md:hidden bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex flex-col items-center justify-center transition-all p-2 rounded-2xl relative",
                isActive ? "text-primary" : "text-on-surface-variant"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 animate-fade-in" />
              )}
              <item.icon size={22} className={cn("mb-1 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
