"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, ShieldCheck, UserCheck, Trash2, ArrowRight } from 'lucide-react'

const GDPRPage = () => {
  const rights = [
    { icon: UserCheck, title: "Right to Access", desc: "You have the right to request a copy of the personal data we hold about you." },
    { icon: ShieldCheck, title: "Right to Correction", desc: "You can request that we correct any inaccurate or incomplete personal data." },
    { icon: Trash2, title: "Right to Erasure", desc: "Also known as the 'right to be forgotten' - you can request that we delete your data." }
  ]

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
            <Landmark className="w-4 h-4" />
            Compliance Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            GDPR <span className="text-primary italic font-serif">Compliance</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Your data rights are our priority. We are fully committed to protecting your privacy in accordance with European Union law.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 space-y-24">
        {/* Your Rights Grid */}
        <div className="space-y-12">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-foreground tracking-tight">Your <span className="text-primary">Rights</span> Under GDPR</h2>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto italic">As a community member, you have total control over how your information is processed and stored.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rights.map((right, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[3rem] bg-muted/20 border border-border/50 space-y-6 hover:bg-background hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                    <right.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">{right.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{right.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto space-y-12 text-muted-foreground">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight m-0 border-b border-border pb-4">Data Processing Transparency</h2>
            <p className="leading-relaxed">
              We only process data that is essential for the functionality of Products Hunt. This includes maintaining your profile, enabling product launches, and securing our voting infrastructure against manipulation. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-12 pt-12 border-t border-border">
             <div className="p-12 sm:p-16 rounded-[4rem] bg-background border border-border shadow-2xl shadow-primary/5 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                <h3 className="text-3xl font-black text-foreground tracking-tight">Exercise your rights</h3>
                <p className="text-muted-foreground font-medium max-w-xl mx-auto">Want to download your data or request account deletion? Our automated systems are ready to help you manage your privacy preferences.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                   <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                     Request Data Export
                   </button>
                   <button className="px-8 py-4 bg-background border border-destructive/20 text-destructive rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-destructive/5 transition-colors">
                     Delete My Account
                   </button>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pt-4">
                  Response time: Usually within 48 hours
                </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default GDPRPage
