"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Heart, ExternalLink } from "lucide-react";
import { TiSocialInstagram, TiSocialTwitter, TiSocialYoutube } from "react-icons/ti";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Help & Support", href: "/help-support" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "GDPR", href: "/gdpr" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: TiSocialInstagram, href: "https://instagram.com", color: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-500" },
    { name: "Twitter", icon: TiSocialTwitter, href: "https://twitter.com", color: "hover:bg-[#1DA1F2]" },
    { name: "YouTube", icon: TiSocialYoutube, href: "https://youtube.com", color: "hover:bg-[#FF0000]" },
  ];

  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group cursor-pointer">
              <div className="flex items-center gap-2">
              
                <span className="text-xl font-bold text-gray-900 dark:text-[#FF5E3A] group-hover:text-[#FF5E3A] transition-colors duration-300">
                  Products<span className="text-[#FF5E3A] group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">Hunt</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-3 max-w-xs">
              Discover and launch amazing products. The best place for makers and hunters.
            </p>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#FF5E3A] transition-colors duration-200 flex items-center gap-1 group cursor-pointer"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#FF5E3A] transition-colors duration-200 flex items-center gap-1 group cursor-pointer"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all duration-300 cursor-pointer ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
            
            {/* Social Tagline */}
            <motion.p 
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              className="text-xs text-gray-400 dark:text-gray-500 mt-4 cursor-default"
            >
              Join our community of 10k+ makers
            </motion.p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 cursor-default">
            © {currentYear} Products Hunt. All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}