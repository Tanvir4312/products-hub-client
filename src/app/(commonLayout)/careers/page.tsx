"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Users, Globe } from 'lucide-react'

const CareersPage = () => {
  const jobs = [
    {
      title: "Senior Full Stack Engineer",
      team: "Engineering",
      location: "Remote (Global)",
      type: "Full-time"
    },
    {
      title: "Product Designer",
      team: "Design",
      location: "San Francisco / Remote",
      type: "Full-time"
    },
    {
      title: "Community Growth Manager",
      team: "Marketing",
      location: "Remote (Global)",
      type: "Part-time"
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
            <Briefcase className="w-4 h-4" />
            Join Our Mission
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter mb-6"
          >
            Help us build the <span className="text-primary italic font-serif">future of tech.</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We are looking for passionate individuals to join our distributed team and help empower makers around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 space-y-32">
        {/* Why Join Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Zap, title: "High Impact", desc: "Work on a platform that directly influences the launch of thousands of innovations yearly." },
            { icon: Globe, title: "Fully Remote", desc: "We are a distributed team. Work from wherever you feel most inspired and productive." },
            { icon: Users, title: "Makers First", desc: "Join a culture that celebrates creativity, experimentation, and community feedback." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary border border-border">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-foreground tracking-tight">Open <span className="text-primary">Positions</span></h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>

          <div className="space-y-6">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between p-8 sm:p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 hover:bg-background hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="space-y-4 md:space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-widest">
                      {job.team}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 md:mt-0">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Culture Section */}
        <div className="p-12 sm:p-20 rounded-[4rem] bg-primary text-white text-center space-y-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full -mr-48 -mt-48" />
           <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl font-black tracking-tight leading-tight">Don't see a role that fits?</h2>
              <p className="text-primary-foreground/80 font-medium text-lg leading-relaxed">We're always looking for talented makers, hunters, and enthusiasts. Send us your portfolio and let's start a conversation.</p>
              <button className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform shadow-xl">
                Apply Spontaneously
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}

export default CareersPage
