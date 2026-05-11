'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 3000 
}: ToastProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!mounted) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      label: 'Success',
      bg: 'rgba(210, 232, 35, 0.05)'
    },
    error: {
      icon: <AlertCircle className="text-[#ff4b4b]" size={24} />,
      accent: '#ff4b4b',
      label: 'Error',
      bg: 'rgba(255, 75, 75, 0.05)'
    },
    info: {
      icon: <Info className="text-[#00d9ff]" size={24} />,
      accent: '#00d9ff',
      label: 'Info',
      bg: 'rgba(0, 217, 255, 0.05)'
    },
  };

  const current = config[type];

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-8 right-8 z-[9999] group pointer-events-auto"
        >
          {/* Main Container */}
          <div className="relative flex items-center gap-4 bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[320px] max-w-md overflow-hidden">
            
            {/* Neon Border Glow */}
            <div 
              className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" 
              style={{ 
                boxShadow: `inset 0 0 20px ${current.accent}`,
              }}
            />

            {/* Left Accent Bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: current.accent }}
            />

            {/* Icon Section */}
            <div 
              className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: current.bg }}
            >
              {current.icon}
              <div 
                className="absolute inset-0 rounded-xl blur-lg opacity-20"
                style={{ backgroundColor: current.accent }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span 
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: current.accent }}
                >
                  {current.label}
                </span>
                {type === 'success' && <Sparkles size={10} className="text-[#d2e823] animate-pulse" />}
              </div>
              <p className="text-sm font-medium text-white/90 leading-snug">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Premium Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-full rounded-full"
                style={{ backgroundColor: current.accent, boxShadow: `0 0 10px ${current.accent}` }}
              />
            </div>
          </div>

          {/* Background Shadow Glow */}
          <div 
            className="absolute -inset-2 blur-2xl opacity-10 -z-10 transition-opacity duration-500 group-hover:opacity-20"
            style={{ backgroundColor: current.accent }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;
