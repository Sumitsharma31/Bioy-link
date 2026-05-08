'use client';

import React, { useState, useTransition } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { saveAppearance } from './actions';

const themes = [
  { name: 'Modern Lime', colors: ['#131313', '#d2e823', '#e5e2e1'] },
  { name: 'Deep Space', colors: ['#0a0a2e', '#7c3aed', '#e2e8f0'] },
  { name: 'Snow Peak', colors: ['#ffffff', '#1a1a1a', '#6b7280'] },
  { name: 'Custom', colors: ['#1a1a2e', '#00d9ff', '#f0f0f0'] },
];

export default function AppearanceClient({ initialAppearance }: { initialAppearance: any }) {
  const [themePreset, setThemePreset] = useState(initialAppearance?.theme_preset || 'Modern Lime');
  const [buttonStyle, setButtonStyle] = useState(initialAppearance?.button_style || 'Rounded');
  const [fontFamily, setFontFamily] = useState(initialAppearance?.font_family || 'Inter');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('theme_preset', themePreset);
      formData.append('button_style', buttonStyle);
      formData.append('font_family', fontFamily);
      await saveAppearance(formData);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
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
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setThemePreset(theme.name)}
                className={`bg-surface-container-low border rounded-xl p-md flex flex-col items-center gap-sm transition-all ${
                  themePreset === theme.name ? 'border-primary-container shadow-md' : 'border-outline-variant/10 hover:border-outline-variant/40'
                }`}
              >
                <div className="flex gap-xs">
                  {theme.colors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-outline-variant/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className={`text-label-md ${themePreset === theme.name ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{theme.name}</span>
                {themePreset === theme.name && <Check size={14} className="text-primary" />}
              </button>
            ))}
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
      <div className="lg:col-span-4 hidden lg:block">
        <div className="sticky top-xl">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">Preview</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-lg flex justify-center wireframe-pattern">
            {(() => {
              const activeTheme = themes.find(t => t.name === themePreset) || themes[0];
              const [bg, primary, text] = activeTheme.colors;
              
              return (
                <div 
                  className="w-[260px] h-[500px] rounded-[36px] border-[6px] border-surface-container-high shadow-xl overflow-hidden flex flex-col items-center px-md py-lg transition-colors duration-300" 
                  style={{ 
                    backgroundColor: bg,
                    fontFamily: fontFamily !== 'Inter' ? `"${fontFamily}", sans-serif` : undefined 
                  }}
                >
                  <div className="w-16 h-16 rounded-full opacity-80 mb-md" style={{ backgroundColor: primary }} />
                  <div className="w-20 h-3 rounded-full mb-xs" style={{ backgroundColor: text, opacity: 0.6 }} />
                  <div className="w-14 h-2 rounded-full mb-lg" style={{ backgroundColor: text, opacity: 0.3 }} />
                  
                  <div className="w-full space-y-sm mt-md">
                    <div 
                      className={`w-full h-10 ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Rounded' ? 'rounded-md' : 'rounded-full'} transition-all`} 
                      style={{ backgroundColor: primary }} 
                    />
                    <div 
                      className={`w-full h-10 border ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Rounded' ? 'rounded-md' : 'rounded-full'} transition-all`} 
                      style={{ borderColor: primary, opacity: 0.4 }} 
                    />
                    <div 
                      className={`w-full h-10 border ${buttonStyle === 'Sharp' ? 'rounded-none' : buttonStyle === 'Rounded' ? 'rounded-md' : 'rounded-full'} transition-all`} 
                      style={{ borderColor: primary, opacity: 0.4 }} 
                    />
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
