"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, FileCheck, ArrowRight } from 'lucide-react'

const PrivacyPolicyPage = () => {
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
            <Shield className="w-4 h-4" />
            Legal Documentation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            Privacy <span className="text-primary italic font-serif">Policy</span>
          </motion.h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <Clock className="w-4 h-4" />
               Last Updated: May 2024
            </div>
            <div className="flex items-center gap-2">
               <FileCheck className="w-4 h-4" />
               v2.4
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">1. Information Collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us when you create an account, post a product, participate in a vote, or communicate with us. This includes your name, email address, profile picture, and any content you upload to our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Additionally, we automatically collect certain information when you browse our site, such as your IP address, browser type, and interaction data to improve your user experience.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">2. Use of Information</h2>
            <ul className="space-y-4 text-muted-foreground list-disc pl-6 font-medium">
              <li>To provide, maintain, and improve our platform services.</li>
              <li>To facilitate product launches and community voting systems.</li>
              <li>To send you technical notices, updates, and security alerts.</li>
              <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">3. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We use encryption (SSL/TLS) for all data transmissions and follow industry best practices for data storage.
            </p>
          </section>

          <section className="space-y-6">
             <div className="p-8 sm:p-12 rounded-[3rem] bg-muted/30 border border-border/50 space-y-6">
                <h3 className="text-2xl font-black text-foreground tracking-tight">Questions about your data?</h3>
                <p className="text-muted-foreground font-medium">If you have any questions or concerns regarding your privacy or data usage, please reach out to our compliance officer.</p>
                <a href="mailto:privacy@productshunt.com" className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest group">
                  Contact Privacy Team
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
