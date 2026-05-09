"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Layout, Terminal, Zap, BarChart, Sparkles, Code, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const carouselData = [
  {
    id: 1,
    title: "AI Writing Assistant for Content Creators",
    description: "Generate high-converting blog posts, social media captions, and ad copy in seconds with our state-of-the-art AI language models.",
    cta: "Try AI Writer",
    badge: "AI & Innovation",
    gradient: "from-indigo-600 to-indigo-800",
    icon: <Bot className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Smart Productivity Workspace & Notes",
    description: "Transform your chaotic workflow into a streamlined system. Notes, tasks, and project management in one unified, smart dashboard.",
    cta: "Get Productive",
    badge: "Productivity",
    gradient: "from-[#FF5E3A] to-[#ff8c70]",
    icon: <Sparkles className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "SaaS Analytics & Startup Dashboard",
    description: "Track your MRR, churn rate, and customer lifetime value with real-time analytics. Make data-driven decisions for your SaaS growth.",
    cta: "View Metrics",
    badge: "SaaS & Analytics",
    gradient: "from-slate-800 to-slate-900",
    icon: <BarChart className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Next-Gen Developer Collaboration Tools",
    description: "Built by developers for developers. Streamline your deployment pipelines and collaborate seamlessly with your engineering team.",
    cta: "Start Coding",
    badge: "Developer Tools",
    gradient: "from-indigo-500 to-purple-600",
    icon: <Terminal className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=2070&auto=format&fit=crop"
  }
]

const HomeCarousel = () => {
  return (
    <section className="pt-8 w-full overflow-hidden px-3 lg:px-0">
      <div className="h-[450px] sm:h-[550px] lg:h-[70vh] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden  border border-border group transition-all duration-700 relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
        >
          {carouselData.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full w-full">
              {({ isActive }) => (
                <div className="relative h-full w-full overflow-hidden bg-slate-900">
                  {/* Background Image with Depth */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Content Container */}
                  <div className="relative h-full flex items-center px-8 sm:px-16 lg:px-20">
                    <div className="max-w-3xl space-y-6 sm:space-y-8">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-gradient-to-r ${slide.gradient} text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10`}
                      >
                        {slide.icon}
                        {slide.badge}
                      </motion.div>

                      <div className="space-y-4">
                        <motion.h2
                          initial={{ opacity: 0, x: -40 }}
                          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl"
                        >
                          {slide.title.split(' ').map((word, i) => (
                            <span key={i} className={["AI", "Smart", "SaaS", "Developer", "Tools", "Next-Gen"].includes(word) ? "text-[#FF5E3A]" : ""}>
                              {word}{' '}
                            </span>
                          ))}
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="text-base sm:text-lg lg:text-xl text-slate-300 font-medium leading-relaxed max-w-xl drop-shadow-lg"
                        >
                          {slide.description}
                        </motion.p>
                      </div>


                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}

          {/* Navigation Controls - Premium Glassmorphism */}
          <div className="absolute bottom-10 right-10 z-30 flex items-center gap-5">
            <button className="swiper-button-prev-custom w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white backdrop-blur-2xl border border-white/10 transition-all hover:border-white/30 active:scale-90 group">
              <ArrowRight className="w-7 h-7 rotate-180 transition-transform group-hover:-translate-x-1" />
            </button>
            <button className="swiper-button-next-custom w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FF5E3A] hover:bg-[#ff451a] text-white transition-all shadow-2xl shadow-[#FF5E3A]/40 active:scale-90 group">
              <ArrowRight className="lg:w-7 lg:h-7 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  )
}

export default HomeCarousel
