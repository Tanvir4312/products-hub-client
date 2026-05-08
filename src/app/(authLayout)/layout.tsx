"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import logo from "@/assets/logo/icon1.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Minimalist Navbar */}
      <nav className="w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo & Branding */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-green-50 p-1 dark:bg-slate-800 transition-transform group-hover:scale-105">
                <Image
                  src={logo}
                  alt="FaithBridge Academy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-green-700 dark:text-white">
                Products Hunt
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content: Centered Form Card */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#007B5E_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer Branding (Optional but professional) */}
      <footer className="py-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Products Hunt - All rights reserveds
        </p>
      </footer>
    </div>
  );
}
