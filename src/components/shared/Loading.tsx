"use client"

import React from "react"
import { motion } from "motion/react"

interface LoadingProps {
  fullScreen?: boolean
}

const Loading = ({ fullScreen = true }: LoadingProps) => {
  return (
    <div className={`${fullScreen ? "fixed inset-0 z-[9999]" : "relative w-full py-20"} bg-white dark:bg-[#0F172A]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section Skeleton */}
        <div className="mb-8">
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-64 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
          />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            className="mt-3 h-5 w-full max-w-2xl rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
          />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="mt-2 h-5 w-3/4 max-w-xl rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
          />
        </div>

        {/* Featured Product Card Skeleton */}
        <div className="mb-12">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="h-64 w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
            />
            <div className="p-6">
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="h-7 w-48 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
              />
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="mt-3 h-4 w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
              />
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="mt-2 h-4 w-5/6 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
              />
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="group rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                className="h-48 w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
              />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.1 }}
                      className="h-5 w-32 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                    />
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.2 }}
                      className="mt-2 h-3 w-20 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                    />
                  </div>
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.15 }}
                    className="h-8 w-12 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                  />
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.25 }}
                    className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.3 }}
                    className="h-3 w-24 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                  />
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.35 }}
                    className="h-4 w-16 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.4 }}
                    className="h-4 w-16 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading