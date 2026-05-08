'use client';

import React, { useState } from 'react';
import { Download, Copy, FileText, Image, Code, FileType, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeClientProps {
  username: string;
}

const QRCodeClient = ({ username }: QRCodeClientProps) => {
  const [copied, setCopied] = useState(false);
  const [fgColor, setFgColor] = useState('#131313');
  const [frameStyle, setFrameStyle] = useState('Rounded');
  const [showLogo, setShowLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : `http://localhost:3000/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = (format: string) => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    if (format === 'SVG') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${username}-qr.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      // For PNG/PDF we'd normally use a canvas or library, 
      // but for this demo SVG is the cleanest implementation
      alert(`${format} download triggered for ${username}-qr.${format.toLowerCase()}`);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        setShowLogo(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      {/* QR Preview */}
      <div className="lg:col-span-7 space-y-lg">
        <div className="pt-sm md:pt-0">
          <h1 className="text-headline-lg text-on-surface mb-xs">QR Code</h1>
          <p className="text-body-md text-on-surface-variant">Generate and customize your profile QR code.</p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-xl flex items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none" />
          <div className={`bg-white p-xl flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500 aspect-square overflow-hidden ${
            frameStyle === 'Circle' ? 'rounded-full' : frameStyle === 'Rounded' ? 'rounded-2xl' : 'rounded-none'
          } hover:scale-105`}>
            <QRCodeSVG
              id="qr-code-svg"
              value={profileUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor={fgColor}
              imageSettings={showLogo && (logoUrl || true) ? {
                src: logoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=BL&backgroundColor=131313",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              } : undefined}
            />
          </div>
        </div>
        <div className="text-center">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">{profileUrl.replace('https://', '').replace('http://', '')}</span>
        </div>

        {/* Direct Link */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md flex items-center gap-md">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 px-sm py-xs text-on-surface text-body-md rounded-t-sm"
          />
          <button 
            onClick={handleCopy}
            className="p-sm bg-surface-variant rounded-lg hover:bg-surface-bright transition-colors flex items-center gap-sm"
          >
            {copied ? <CheckCircle size={18} className="text-primary" /> : <Copy size={18} className="text-on-surface" />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="lg:col-span-5 space-y-lg">
        {/* Download Formats */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Download</h2>
          <div className="grid grid-cols-2 gap-md">
            {[
              { label: 'PDF', icon: FileText },
              { label: 'PNG', icon: Image },
              { label: 'SVG', icon: Code },
              { label: 'EPS', icon: FileType },
            ].map((fmt) => (
              <button 
                key={fmt.label} 
                onClick={() => downloadQR(fmt.label)}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md flex items-center gap-md hover:border-outline-variant/40 transition-colors"
              >
                <fmt.icon size={20} className="text-primary-fixed-dim" />
                <span className="text-label-md text-on-surface font-bold">{fmt.label}</span>
                <Download size={16} className="text-on-surface-variant ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Share */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Quick Share</h2>
          <div className="flex gap-md">
            {['Twitter', 'Threads', 'LinkedIn'].map((platform) => (
              <button key={platform} className="flex-1 bg-surface-container-low border border-outline-variant/10 rounded-xl py-sm text-label-md text-on-surface-variant hover:text-on-surface hover:border-outline-variant/40 transition-colors">
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Customization */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Customize</h2>
          <div className="space-y-md">
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md">
              <span className="text-label-sm text-on-surface-variant uppercase">Custom Colors</span>
              <div className="flex gap-sm mt-sm">
                {[
                  { name: 'Dark', color: '#131313' },
                  { name: 'Lime', color: '#d2e823' },
                  { name: 'Purple', color: '#7c3aed' },
                  { name: 'Blue', color: '#00d9ff' }
                ].map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => setFgColor(c.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${fgColor === c.color ? 'border-primary scale-110' : 'border-transparent'}`} 
                    style={{ backgroundColor: c.color }} 
                  />
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md">
              <span className="text-label-sm text-on-surface-variant uppercase">Frame Style</span>
              <div className="flex gap-sm mt-sm">
                {['None', 'Circle', 'Rounded'].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setFrameStyle(f)}
                    className={`px-md py-xs rounded-lg text-label-md transition-all ${frameStyle === f ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-bright'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md">
              <div className="flex items-center justify-between mb-sm">
                <span className="text-label-sm text-on-surface-variant uppercase">Brand Logo</span>
                <button 
                  onClick={() => setShowLogo(!showLogo)}
                  className={`text-xs px-2 py-1 rounded transition-all ${showLogo ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}
                >
                  {showLogo ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="space-y-sm">
                <input 
                  type="file" 
                  id="logo-upload" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                />
                <label 
                  htmlFor="logo-upload" 
                  className="mt-sm w-full py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center justify-center cursor-pointer gap-sm"
                >
                  {logoUrl ? 'Change Logo' : 'Upload Custom Logo'}
                </label>
                {logoUrl && (
                  <button 
                    onClick={() => { setLogoUrl(''); setShowLogo(false); }}
                    className="w-full text-[10px] text-error hover:underline"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeClient;
