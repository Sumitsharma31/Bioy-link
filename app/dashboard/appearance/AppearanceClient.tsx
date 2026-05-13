'use client';

import React, { useState, useTransition } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { saveAppearance } from './actions';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const themes = [
  { name: 'Modern Lime', bg: '#131313', card: '#1c1c1c', text: '#ffffff', accent: '#d2e823' },
  { name: 'Deep Space', bg: '#0a0a2e', card: '#161644', text: '#e2e8f0', accent: '#7c3aed' },
  { name: 'Snow Peak', bg: '#ffffff', card: '#f3f4f6', text: '#1a1a1a', accent: '#6b7280' },
  { name: 'Custom', bg: '#1a1a2e', card: '#242442', text: '#f0f0f0', accent: '#00d9ff' },
];

export default function AppearanceClient({ 
  initialAppearance, 
  profile, 
  links 
}: { 
  initialAppearance: any;
  profile: any;
  links: any[];
}) {
  const isFree = profile?.subscription_tier === 'free';
  const [themePreset, setThemePreset] = useState(initialAppearance?.theme_preset || 'Modern Lime');
  const [buttonStyle, setButtonStyle] = useState(initialAppearance?.button_style || 'Rounded');
  const [fontFamily, setFontFamily] = useState(initialAppearance?.font_family || 'Inter');
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const handleSave = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('theme_preset', themePreset);
        formData.append('button_style', buttonStyle);
        formData.append('font_family', fontFamily);
        await saveAppearance(formData);
        setToast({ isVisible: true, message: 'Appearance updated successfully!', type: 'success' });
      } catch (error) {
        setToast({ isVisible: true, message: 'Failed to update appearance.', type: 'error' });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      {/* Controls Column */}
      <div className="lg:col-span-8 space-y-xl">
        <div className="pt-sm md:pt-0 flex justify-between items-center">
          <div>
            <h1 className="text-headline-lg text-on-surface mb-xs">Appearance</h1>
            <p className="text-body-md text-on-surface-variant">Customize your public profile page.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold flex items-center gap-sm hover:opacity-90 transition-opacity"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>

        {/* Themes Section */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Themes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {themes.map((theme) => {
              const isProTheme = theme.name === 'Custom';
              return (
                <div key={theme.name} className="relative group">
                  <button
                    onClick={() => {
                      if (isProTheme && isFree) {
                        return;
                      }
                      setThemePreset(theme.name);
                    }}
                    className={`w-full bg-surface-container-low border rounded-xl p-md flex flex-col items-center gap-sm transition-all ${
                      themePreset === theme.name ? 'border-primary-container shadow-md' : 'border-outline-variant/10 hover:border-outline-variant/40'
                    } ${isProTheme && isFree ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                    <div className="flex gap-xs">
                      <div className="w-6 h-6 rounded-full border border-outline-variant/20" style={{ backgroundColor: theme.bg }} />
                      <div className="w-6 h-6 rounded-full border border-outline-variant/20" style={{ backgroundColor: theme.card }} />
                      <div className="w-6 h-6 rounded-full border border-outline-variant/20" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className={`text-label-md ${themePreset === theme.name ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{theme.name}</span>
                    {themePreset === theme.name && <Check size={14} className="text-primary" />}
                  </button>
                  {isProTheme && isFree && (
                    <Link href="/pricing" className="absolute top-1 right-1 bg-primary-container text-on-primary-container px-xs py-[2px] rounded text-[8px] font-bold uppercase tracking-tighter shadow-lg flex items-center gap-xs">
                      <Zap size={8} /> Pro
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography Section */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Font Family</label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="DM Sans">DM Sans</option>
                <option value="Space Grotesk">Space Grotesk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Button Styles */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Button Style</h2>
          <div className="grid grid-cols-3 gap-md">
            {[
              { name: 'Sharp', radius: 'rounded-none' },
              { name: 'Rounded', radius: 'rounded-lg' },
              { name: 'Pill', radius: 'rounded-full' },
            ].map((style) => (
              <button
                key={style.name}
                onClick={() => setButtonStyle(style.name)}
                className={`bg-surface-container-low border rounded-xl p-lg flex flex-col items-center gap-md transition-all ${
                  buttonStyle === style.name ? 'border-primary-container' : 'border-outline-variant/10 hover:border-outline-variant/40'
                }`}
              >
                <div className={`w-full h-10 bg-primary-container ${style.radius}`} />
                <span className={`text-label-md ${buttonStyle === style.name ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{style.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-4 block mt-xl lg:mt-0">
        <div className="sticky top-xl">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Preview</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-lg flex justify-center wireframe-pattern">
              {(() => {
                const activeTheme = themes.find(t => t.name === themePreset) || themes[0];
                const { bg, card, text, accent } = activeTheme;
                
                return (
                  <div 
                    className="w-[260px] h-[500px] rounded-[36px] border-[6px] border-surface-container-high shadow-xl overflow-hidden flex flex-col items-center px-md py-lg transition-colors duration-300" 
                    style={{ 
                      backgroundColor: bg,
                      fontFamily: fontFamily !== 'Inter' ? `"${fontFamily}", sans-serif` : undefined 
                    }}
                  >
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center w-full mb-md mt-sm">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username} 
                          className="w-16 h-16 rounded-full object-cover mb-sm border-2" 
                          style={{ borderColor: accent }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full opacity-80 mb-sm flex items-center justify-center border-2" style={{ backgroundColor: card, borderColor: accent }}>
                           <span className="text-body-md font-bold uppercase" style={{ color: text }}>{profile?.username?.substring(0, 2) || 'UN'}</span>
                        </div>
                      )}
                      <h3 className="text-body-lg font-black truncate w-full" style={{ color: text }}>
                        @{profile?.username || 'username'}
                      </h3>
                      <p className="text-[10px] opacity-70 line-clamp-2 w-full px-xs" style={{ color: text }}>
                        {profile?.bio || 'Sharing my digital footprint one link at a time.'}
                      </p>
                    </div>
                    
                    {/* Links List */}
                    <div className="w-full space-y-sm overflow-y-auto no-scrollbar">
                      {links && links.length > 0 ? (
                        links.map((link) => (
                          <div 
                            key={link.id}
                            className={`w-full py-[10px] px-md flex items-center justify-between ${
                              buttonStyle === 'Sharp' ? 'rounded-none' : 
                              buttonStyle === 'Rounded' ? 'rounded-lg' : 
                              'rounded-full'
                            } transition-all border shadow-sm`} 
                            style={{ 
                              backgroundColor: card,
                              color: text,
                              borderColor: 'transparent'
                            }} 
                          >
                            <span className="text-[10px] font-bold truncate">{link.title}</span>
                            <div className="w-3 h-3 opacity-30" style={{ backgroundColor: text, WebkitMask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\'%3E%3C/path%3E%3Cpolyline points=\'15 3 21 3 21 9\'%3E%3C/polyline%3E%3Cline x1=\'10\' y1=\'14\' x2=\'21\' y2=\'3\'%3E%3C/line%3E%3C/svg%3E") center/contain no-repeat' }} />
                          </div>
                        ))
                      ) : (
                        <div className="space-y-sm w-full">
                          {[1, 2, 3].map((i) => (
                            <div 
                              key={i}
                              className={`w-full h-10 ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Rounded' ? 'rounded-lg' : 'rounded-full'} transition-all`} 
                              style={{ backgroundColor: card, opacity: 1 - (i * 0.2) }} 
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Social Row - Simplified */}
                    <div className="mt-md pt-md border-t w-full flex justify-center gap-sm" style={{ borderColor: 'rgba(150,150,150,0.1)' }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: card }} />
                      ))}
                    </div>

                    <div className="mt-auto pb-sm">
                      <span className="text-[8px] font-black tracking-tighter opacity-30" style={{ color: text }}>BioLinks</span>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}
