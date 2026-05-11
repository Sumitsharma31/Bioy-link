'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  username: string;
}

const ShareButton = ({ username }: ShareButtonProps) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My BioLinks Profile',
          url: url
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Profile link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="bg-secondary-container text-on-secondary-container px-md py-sm rounded-lg text-label-md flex items-center gap-sm hover:opacity-90 transition-opacity"
    >
      <Share2 size={18} /> Share
    </button>
  );
};

export default ShareButton;
