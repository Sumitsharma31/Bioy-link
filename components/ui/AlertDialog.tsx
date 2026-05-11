'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Info, CheckCircle2, X, Bell } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  type?: 'warning' | 'error' | 'info' | 'success' | 'confirm';
  autoClose?: boolean;
}

const AlertDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  type = 'confirm',
  autoClose = false
}: AlertDialogProps) => {
  const [mounted, setMounted] = useState(false);
  const DURATION = 5000;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!mounted) return null;

  const config = {
    warning: {
      icon: <AlertTriangle className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      bg: 'rgba(210, 232, 35, 0.05)',
      btn: 'bg-[#d2e823] text-black hover:bg-[#d2e823]/80'
    },
    error: {
      icon: <Trash2 className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      bg: 'rgba(210, 232, 35, 0.05)',
      btn: 'bg-[#d2e823] text-black hover:bg-[#d2e823]/80'
    },
    confirm: {
      icon: <Bell className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      bg: 'rgba(210, 232, 35, 0.05)',
      btn: 'bg-[#d2e823] text-black hover:bg-[#d2e823]/80'
    },
    info: {
      icon: <Info className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      bg: 'rgba(210, 232, 35, 0.05)',
      btn: 'bg-[#d2e823] text-black hover:bg-[#d2e823]/80'
    },
    success: {
      icon: <CheckCircle2 className="text-[#d2e823]" size={24} />,
      accent: '#d2e823',
      bg: 'rgba(210, 232, 35, 0.05)',
      btn: 'bg-[#d2e823] text-black hover:bg-[#d2e823]/80'
    }
  };

  const current = config[type];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            className="absolute top-6 right-6 w-[340px] pointer-events-auto"
          >
            {/* Main Container - High Contrast Lime/Black (Simplified) */}
            <div className="relative bg-[#131313] border-2 border-[#d2e823]/20 rounded-2xl p-5 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Subtle Lime Corner Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d2e823]/10 blur-[40px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white/30 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d2e823] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(210,232,35,0.2)]">
                    <div className="text-black scale-75">
                      {current.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight italic">
                    {title}
                  </h3>
                </div>

                {/* Body */}
                <p className="text-[13px] font-medium text-white/70 leading-snug">
                  {description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                    className="flex-[1.5] py-3 rounded-xl text-[10px] font-black bg-[#d2e823] text-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_5px_20px_rgba(210,232,35,0.2)]"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              {/* Auto Close Progress */}
              {autoClose && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: DURATION / 1000, ease: 'linear' }}
                    className="h-full bg-[#d2e823]"
                  />
                </div>
              )}
            </div>

            {/* Reflection Effect */}
            <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AlertDialog;
