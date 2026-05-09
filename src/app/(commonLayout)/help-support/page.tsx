"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, FileText, LifeBuoy, Mail, ArrowRight } from 'lucide-react'

const HelpSupportPage = () => {
  const faqs = [
    {
      q: "How do I launch a product?",
      a: "Simply click on the 'AddProduct' button in your dashboard. You'll need to provide a name, description, and at least one image/link."
    },
    {
      q: "What are the rules for voting?",
      a: "Users can vote for any product they find interesting. However, spamming or using bot accounts is strictly prohibited and will result in a ban."
    },
    {
      q: "How do I become a moderator?",
      a: "Moderators are chosen from our most active and helpful community members. Keep contributing and follow our guidelines!"
    },
    {
      q: "Is there a mobile app?",
      a: "We are currently a web-first platform, but our site is fully responsive and works perfectly on all mobile browsers."
    }
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
            <LifeBuoy className="w-4 h-4" />
            Support Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            How can we <span className="text-primary italic font-serif">help you?</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Find answers to frequently asked questions or reach out to our dedicated support team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="h-1.5 w-20 bg-primary rounded-full" />
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-muted/20 border border-border/50 hover:border-primary/20 transition-colors group"
                >
                  <h3 className="text-lg font-black text-foreground mb-3 group-hover:text-primary transition-colors">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar Contact */}
          <div className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-primary text-white space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black tracking-tight leading-tight">Still need assistance?</h3>
                <p className="text-primary-foreground/80 font-medium text-sm">Our support team is available 24/7 to help you with any platform issues.</p>
                <a
                  href="mailto:support@productshunt.com"
                  className="flex items-center justify-between w-full p-4 bg-white text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
                >
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] border border-border bg-background space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-foreground">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Community Chat</h3>
              <p className="text-muted-foreground text-sm font-medium">Join our Discord community for real-time help from other makers and moderators.</p>
              <button className="text-primary font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 group">
                Join Discord
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpSupportPage
