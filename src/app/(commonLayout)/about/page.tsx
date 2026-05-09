"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Info, Globe, ShieldCheck, Heart } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-border/50 bg-muted/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.3em] border border-primary/10 mb-6 shadow-sm"
          >
            <Info className="w-4 h-4" />
            Our Identity
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            About <span className="text-primary italic font-serif">Products Hunt</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Empowering the next generation of makers. We are a community-driven platform dedicated to discovering, launching, and celebrating technological innovation.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Main Description */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-foreground tracking-tight">Our <span className="text-primary">Mission</span></h2>
              <div className="h-1.5 w-20 bg-primary rounded-full" />
            </div>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Launched in 2024, Products Hunt has quickly become the primary destination for developers, designers, and tech enthusiasts to showcase their latest creations. Our platform is built on the belief that great ideas should be accessible to everyone, regardless of the size of the team behind them.
              </p>
              <p>
                Whether you're building a simple AI tool, a complex SaaS platform, or a creative design utility, Products Hunt provides the exposure, community feedback, and validation needed to take your innovation to the next level.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {[
                { icon: Globe, label: "Global Reach", color: "text-blue-500" },
                { icon: ShieldCheck, label: "Vetted Tech", color: "text-emerald-500" },
                { icon: Heart, label: "Maker Focused", color: "text-rose-500" }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-muted/20 border border-border/50 text-center space-y-3">
                  <item.icon className={cn("w-8 h-8 mx-auto", item.color)} />
                  <span className="text-xs font-black uppercase tracking-tight block text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Information Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-background border border-border rounded-[3rem] p-10 sm:p-12 shadow-2xl shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">Get in <span className="text-primary italic font-serif">Touch</span></h3>
                  <p className="text-sm text-muted-foreground font-medium">Have questions or want to collaborate? Reach out to our dedicated support team.</p>
                </div>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10 shadow-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Official Email</span>
                      <p className="text-lg font-black text-foreground">producthunt@gmail.com</p>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/10 shadow-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Support Line 01</span>
                        <p className="text-lg font-black text-foreground">01710987654</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Support Line 02</span>
                        <p className="text-lg font-black text-foreground">01718098765</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border border-dashed text-center">
                    <p className="text-xs font-bold text-muted-foreground italic">
                      "Connecting makers with the resources they need to succeed."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'

export default AboutPage
