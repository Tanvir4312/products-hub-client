"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Scale, Clock, FileText, ArrowRight, ShieldAlert } from 'lucide-react'

const TermsOfServicePage = () => {
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
            <Scale className="w-4 h-4" />
            Terms of Use
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            Terms of <span className="text-primary italic font-serif">Service</span>
          </motion.h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <Clock className="w-4 h-4" />
               Effective Date: May 2024
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
          
          <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex gap-6 items-start">
             <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
             <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground m-0">Important Summary</h3>
                <p className="text-muted-foreground m-0 text-sm leading-relaxed">By using Products Hunt, you agree to these terms. We do not tolerate spam, bot-voting, or harassment. You own the content you post, but give us permission to display it.</p>
             </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Products Hunt, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">2. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">3. Posting Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you post innovations or reviews, you represent that you have the right to do so and that the content does not violate any third-party rights. We reserve the right to remove any content that violates our community guidelines.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight border-b border-border pb-4">4. Limitations of Liability</h2>
            <p className="text-muted-foreground leading-relaxed italic">
              Products Hunt shall not be held liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-12 pt-12 border-t border-border">
             <div className="text-center space-y-4">
                <h3 className="text-xl font-black text-foreground uppercase tracking-widest">Need more clarification?</h3>
                <p className="text-muted-foreground font-medium">Our legal team is happy to assist you with any questions regarding these terms.</p>
                <a href="mailto:legal@productshunt.com" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
                  Contact Legal Team
                  <ArrowRight className="w-4 h-4" />
                </a>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
