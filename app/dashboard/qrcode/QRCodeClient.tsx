'use client';

import React, { useState, useMemo } from 'react';
import { Download, Copy, FileText, Image, Code, FileType, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeClientProps {
  username: string;
}

/**
 * Generates a data URI for the BioLinks SVG logo tinted to `color`.
 * The SVG uses currentColor-style substitution so the logo always matches the QR fg color.
 */
function buildLogoDataUri(color: string): string {
  const encodedColor = encodeURIComponent(color);
  const svg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#glow)" stroke="${color}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M170 100V412H270C340 412 382 370 382 318C382 280 360 250 330 236C355 220 372 190 372 156C372 108 332 100 278 100H170Z" fill="none"/>
    <path d="M220 250L282 220"/>
    <path d="M282 220V145"/>
    <circle cx="282" cy="145" r="16" fill="${color}" stroke="none"/>
    <circle cx="282" cy="220" r="16" fill="${color}" stroke="none"/>
    <path d="M265 318H390"/>
    <circle cx="245" cy="318" r="16" fill="${color}" stroke="none"/>
    <circle cx="390" cy="318" r="16" fill="${color}" stroke="none"/>
  </g>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${svg.replace(/#/g, '%23').replace(/\n/g, '').replace(/\s{2,}/g, ' ')}`;
}

const COLOR_PRESETS = [
  { name: 'Dark',   color: '#131313' },
  { name: 'Lime',   color: '#d2e823' },
  { name: 'Purple', color: '#7c3aed' },
  { name: 'Blue',   color: '#00d9ff' },
];

const QRCodeClient = ({ username }: QRCodeClientProps) => {
  const [copied, setCopied]       = useState(false);
  const [fgColor, setFgColor]     = useState('#131313');
  const [frameStyle, setFrameStyle] = useState('Rounded');

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${username}`
    : `http://localhost:3000/${username}`;

  // Re-generate logo data URI whenever the QR color changes
  const logoDataUri = useMemo(() => buildLogoDataUri(fgColor), [fgColor]);

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
      const a = document.createElement('a');
      a.href = svgUrl;
      a.download = `${username}-qr.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === 'PNG') {
      // Render SVG → canvas → PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 0, 0, 600, 600);
        URL.revokeObjectURL(url);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `${username}-qr.png`;
        a.click();
      };
      img.src = url;
    } else {
      alert(`${format} export coming soon.`);
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

        {/* QR Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-xl flex items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none" />
          <div
            className={`bg-white p-xl flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500 aspect-square overflow-hidden hover:scale-105 ${
              frameStyle === 'Circle'  ? 'rounded-full' :
              frameStyle === 'Rounded' ? 'rounded-2xl'  : 'rounded-none'
            }`}
          >
            <QRCodeSVG
              id="qr-code-svg"
              value={profileUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor={fgColor}
              imageSettings={{
                src: logoDataUri,
                x: undefined,
                y: undefined,
                height: 52,
                width: 52,
                excavate: true,
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-widest">
            {profileUrl.replace('https://', '').replace('http://', '')}
          </span>
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
            {copied
              ? <CheckCircle size={18} className="text-primary" />
              : <Copy size={18} className="text-on-surface" />
            }
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
              { label: 'PDF',  icon: FileText },
              { label: 'PNG',  icon: Image    },
              { label: 'SVG',  icon: Code     },
              { label: 'EPS',  icon: FileType },
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
              <button
                key={platform}
                className="flex-1 bg-surface-container-low border border-outline-variant/10 rounded-xl py-sm text-label-md text-on-surface-variant hover:text-on-surface hover:border-outline-variant/40 transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Customization */}
        <div>
          <h2 className="text-headline-sm text-on-surface mb-md">Customize</h2>
          <div className="space-y-md">
            {/* Color Presets */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md">
              <span className="text-label-sm text-on-surface-variant uppercase">QR Color</span>
              <p className="text-[11px] text-on-surface-variant/60 mt-xs mb-sm">Logo tints automatically to match.</p>
              <div className="flex gap-sm mt-sm">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setFgColor(c.color)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${fgColor === c.color ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
                {/* Custom colour picker */}
                <label className="w-9 h-9 rounded-full border-2 border-dashed border-outline-variant/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                  title="Custom color">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="opacity-0 absolute w-9 h-9 cursor-pointer"
                  />
                  <span className="text-[10px] text-on-surface-variant pointer-events-none">+</span>
                </label>
              </div>

              {/* Logo preview strip */}
              <div className="mt-md flex items-center gap-md p-sm bg-surface-container rounded-lg">
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wide">Logo preview</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoDataUri} alt="BioLinks logo preview" className="w-8 h-8 object-contain" />
                <span className="text-[11px] text-on-surface-variant ml-auto" style={{ color: fgColor }}>■ {fgColor}</span>
              </div>
            </div>

            {/* Frame Style */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-md">
              <span className="text-label-sm text-on-surface-variant uppercase">Frame Style</span>
              <div className="flex gap-sm mt-sm">
                {['None', 'Circle', 'Rounded'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrameStyle(f)}
                    className={`px-md py-xs rounded-lg text-label-md transition-all ${
                      frameStyle === f
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                        : 'bg-surface-variant text-on-surface-variant hover:bg-surface-bright'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeClient;
