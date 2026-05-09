"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Database, Cookie, Settings, ArrowRight } from 'lucide-react'

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-border/50 bg-muted/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 mb-6"
          >
            <Cookie className="w-4 h-4" />
            Tracking & Cookies
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            Cookie <span className="text-primary italic font-serif">Policy</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Understanding how we use cookies to provide a better, more personalized experience for our community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                 <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Necessary for the website to function. They handle authentication, security, and basic navigation.</p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10">
                 <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Analytics Cookies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Help us understand how visitors interact with our platform so we can improve the discovery engine.</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12 text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-3xl font-black text-foreground tracking-tight m-0">What are cookies?</h2>
              <p className="leading-relaxed">Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help the platform remember your login state, preferences, and voting history.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-black text-foreground tracking-tight m-0">Managing your preferences</h2>
              <p className="leading-relaxed">You can control and manage cookies through your browser settings. Please note that disabling essential cookies may affect the functionality of our product launch and voting systems.</p>
            </section>
          </div>

          <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-black text-foreground tracking-tight">Prefer a data-free experience?</h4>
                <p className="text-sm text-muted-foreground font-medium">Learn more about our commitment to data protection in our GDPR section.</p>
             </div>
             <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 group">
                View GDPR Compliance
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyPage
