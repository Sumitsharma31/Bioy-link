'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import {
  GripVertical, Globe, ShoppingBag, BarChart3, Share2, Trash2,
  Instagram, Twitter, Linkedin, Github, Youtube, Facebook,
  Mail, Phone, Video, Music, MessageCircle, X, Plus, Loader2
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { toggleLinkActive, deleteLink, updateLinkIcon, addLink, updateBio, reorderLinks } from './actions';
import AlertDialog from '@/components/ui/AlertDialog';
import Toast from '@/components/ui/Toast';

const iconMap: Record<string, React.ElementType> = {
  Globe, Instagram, Twitter, Linkedin, Github, Youtube, Facebook,
  Mail, Phone, ShoppingBag, Video, Music, MessageCircle
};

interface LinksClientProps {
  initialLinks: any[];
  appearance: any;
  profile: any;
}

const LinksClient = ({ initialLinks, appearance, profile }: LinksClientProps) => {
  const [links, setLinks] = useState(initialLinks);
  const [bio, setBio] = useState(profile?.bio || '');

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'warning' | 'error' | 'info' | 'success' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info',
  });

  const showAlert = (config: Omit<typeof alertConfig, 'isOpen'>) => {
    setAlertConfig({ ...config, isOpen: true });
  };
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });
  const [isPending, startTransition] = useTransition();
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [newLinkIcon, setNewLinkIcon] = useState('Globe');
  const [showNewIconPicker, setShowNewIconPicker] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const linksListRef = useRef<HTMLUListElement>(null);

  const handleBioSave = () => {
    startTransition(async () => {
      try {
        await updateBio(bio);
        setToast({ isVisible: true, message: 'Bio updated successfully!', type: 'success' });
      } catch (error) {
        setToast({ isVisible: true, message: 'Failed to update bio.', type: 'error' });
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle New Link Icon Picker
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
        setShowNewIconPicker(false);
      }
      // Handle Existing Links Icon Pickers
      if (linksListRef.current && !linksListRef.current.contains(event.target as Node)) {
        setSelectedLinkId(null);
      }
    }
    if (showNewIconPicker || selectedLinkId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewIconPicker, selectedLinkId]);

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('iconName', newLinkIcon);

    startTransition(async () => {
      const result = await addLink(formData);
      if (result.success) {
        setToast({ isVisible: true, message: 'Link added successfully!', type: 'success' });
        // Instead of reload, we could reset form state here if we wanted
        window.location.reload();
      } else {
        setToast({ isVisible: true, message: result.error || 'Failed to add link.', type: 'error' });
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleLinkActive(id, !current);
      setLinks(links.map(l => l.id === id ? { ...l, is_active: !current } : l));
    });
  };

  const handleDelete = (id: string) => {
    showAlert({
      title: 'Delete Link?',
      description: 'Are you sure you want to delete this link? This action cannot be undone.',
      type: 'error',
      onConfirm: () => {
        startTransition(async () => {
          try {
            await deleteLink(id);
            setLinks(links.filter(l => l.id !== id));
            setToast({ isVisible: true, message: 'Link deleted.', type: 'success' });
          } catch (error) {
            setToast({ isVisible: true, message: 'Failed to delete link.', type: 'error' });
          }
        });
      }
    });
  };

  const handleSelectIcon = (linkId: string, iconName: string) => {
    startTransition(async () => {
      await updateLinkIcon(linkId, iconName);
      setLinks(links.map(l => l.id === linkId ? { ...l, icon_name: iconName } : l));
      setSelectedLinkId(null);
    });
  };

  const handleReorder = (newOrder: any[]) => {
    setLinks(newOrder);
    // Sync with DB
    startTransition(async () => {
      const linkIds = newOrder.map(l => l.id);
      await reorderLinks(linkIds);
    });
  };

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
      />
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-md pt-sm md:pt-0 mb-xl">
        <div>
          <h1 className="text-headline-lg text-on-surface mb-xs">Manage Links</h1>
          <p className="text-on-surface-variant text-body-md">Add new links and organize your profile.</p>
        </div>

        <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-sm w-full lg:w-auto items-center">
          <div className="w-full sm:w-40 relative" ref={iconPickerRef}>
            <button
              type="button"
              onClick={() => setShowNewIconPicker(!showNewIconPicker)}
              className="w-full bg-surface-container-high border border-outline-variant/40 px-sm py-[9px] text-on-surface text-body-md rounded-lg flex items-center gap-sm"
            >
              {(() => {
                const SelectedIcon = iconMap[newLinkIcon] || Globe;
                return <SelectedIcon size={18} />;
              })()}
              <span className="truncate">{newLinkIcon}</span>
            </button>

            {showNewIconPicker && (
              <div className="absolute top-12 left-0 z-50 bg-surface-container-high border border-outline-variant rounded-xl p-md shadow-2xl grid grid-cols-4 gap-sm w-48 animate-fade-in">
                {Object.keys(iconMap).map((iconName) => {
                  const PickerIcon = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => { setNewLinkIcon(iconName); setShowNewIconPicker(false); }}
                      className="w-10 h-10 rounded-lg hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <PickerIcon size={18} className="text-on-surface" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="w-full sm:w-40">
            <input type="text" name="title" placeholder="Link Title" required className="w-full bg-surface-container-high border border-outline-variant/40 focus:ring-0 focus:border-primary px-sm py-[9px] text-on-surface text-body-md rounded-lg" />
          </div>
          <div className="w-full sm:w-48">
            <input type="url" name="url" placeholder="https://..." required className="w-full bg-surface-container-high border border-outline-variant/40 focus:ring-0 focus:border-primary px-sm py-[9px] text-on-surface text-body-md rounded-lg" />
          </div>
          <button type="submit" disabled={isPending} className="flex items-center justify-center gap-sm bg-primary-container text-on-primary-container px-md py-[9px] rounded-lg font-bold shadow-sm active:scale-95 transition-all w-full sm:w-auto shrink-0 disabled:opacity-50">
            {isPending ? <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" /> : <><Plus size={20} /> Add Link</>}
          </button>
        </form>
      </header>

      {/* Bio Section */}
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg mb-xl space-y-md">
        <div>
          <label className="block text-label-sm text-on-surface-variant uppercase mb-xs font-bold tracking-wider">Your Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio about yourself..."
            className="w-full bg-surface-container-high border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:border-primary px-md py-sm text-on-surface text-body-md rounded-lg resize-none min-h-[100px] transition-all"
          />
          <div className="flex justify-between items-center mt-sm">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">{bio.length} / 160 characters</span>
            <button
              onClick={handleBioSave}
              disabled={isPending || bio === profile?.bio}
              className="bg-primary/10 hover:bg-primary/20 text-primary px-md py-xs rounded-md text-label-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Update Bio'}
            </button>
          </div>
        </div>
      </div>

      <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="grid grid-cols-1 gap-md" ref={linksListRef}>
        {links?.map((link) => {
          const LinkIcon = iconMap[link.icon_name] || Globe;
          return (
            <Reorder.Item
              key={link.id}
              value={link}
              className={`bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col md:flex-row gap-lg group hover:border-outline-variant/40 transition-colors ${!link.is_active ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all' : ''
                }`}
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-center md:justify-start">
                <div className="cursor-grab active:cursor-grabbing text-on-surface-variant p-xs">
                  <GripVertical size={20} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-md">
                <div className="flex flex-col md:flex-row gap-md">
                  <div className="flex-1">
                    <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Title</label>
                    <input
                      className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-xs text-on-surface text-body-md rounded-t-sm"
                      type="text"
                      defaultValue={link.title}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">URL</label>
                    <input
                      className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-xs text-on-surface text-body-md rounded-t-sm"
                      type="text"
                      defaultValue={link.url}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-md flex-wrap">
                  <div className="flex items-center gap-xs relative">
                    <button
                      onClick={() => setSelectedLinkId(selectedLinkId === link.id ? null : link.id)}
                      className="w-10 h-10 rounded bg-surface-variant flex items-center justify-center border border-outline-variant/20 hover:border-primary transition-colors"
                    >
                      <LinkIcon size={20} className="text-on-surface" />
                    </button>
                    <span className="text-label-md text-on-surface-variant">{link.icon_name || 'Select Icon'}</span>

                    {/* Icon Picker Popover */}
                    {selectedLinkId === link.id && (
                      <div className="absolute top-12 left-0 z-50 bg-surface-container-high border border-outline-variant rounded-xl p-md shadow-2xl grid grid-cols-5 gap-sm w-64 animate-fade-in">
                        {Object.keys(iconMap).map((iconName) => {
                          const PickerIcon = iconMap[iconName];
                          return (
                            <button
                              key={iconName}
                              onClick={() => handleSelectIcon(link.id, iconName)}
                              className="w-10 h-10 rounded-lg hover:bg-primary/20 flex items-center justify-center transition-colors"
                            >
                              <PickerIcon size={18} className="text-on-surface" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-sm ml-auto">
                    <BarChart3 size={20} className="text-on-surface-variant cursor-pointer hover:text-on-surface" />
                    <Share2 size={20} className="text-on-surface-variant cursor-pointer hover:text-on-surface" />
                  </div>
                </div>
              </div>

              {/* Toggle & Delete */}
              <div className="flex sm:flex-col justify-between items-center gap-md border-t sm:border-t-0 sm:border-l border-outline-variant/20 pt-md sm:pt-0 sm:pl-lg">
                <button
                  onClick={() => handleToggle(link.id, link.is_active)}
                  className="flex items-center gap-sm"
                >
                  <span className="text-label-md text-on-surface-variant">{link.is_active ? 'Visible' : 'Hidden'}</span>
                  <div className={`w-12 h-6 ${link.is_active ? 'bg-primary-container' : 'bg-surface-variant'} rounded-full relative flex items-center px-xs cursor-pointer`}>
                    <div className={`w-4 h-4 ${link.is_active ? 'bg-on-primary-container translate-x-6' : 'bg-on-surface-variant'} rounded-full transition-transform`} />
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Reorder.Item>
          );
        })}
        {links?.length === 0 && (
          <div className="text-center py-xl text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
            No links yet. Click "Add Link" to get started.
          </div>
        )}
      </Reorder.Group>

      {/* Live Preview Outline */}
      <div className="mt-xl">
        <h2 className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-md">Live Preview Outline</h2>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-xl flex items-center justify-center wireframe-pattern">
          {(() => {
            const themes = [
              { name: 'Modern Lime', bg: '#131313', card: '#1c1c1c', text: '#ffffff', accent: '#d2e823' },
              { name: 'Deep Space', bg: '#0a0a2e', card: '#161644', text: '#e2e8f0', accent: '#7c3aed' },
              { name: 'Snow Peak', bg: '#ffffff', card: '#f3f4f6', text: '#1a1a1a', accent: '#6b7280' },
              { name: 'Custom', bg: '#1a1a2e', card: '#242442', text: '#f0f0f0', accent: '#00d9ff' },
            ];
            const activeTheme = themes.find(t => t.name === appearance?.theme_preset) || themes[0];
            const { bg, card, text, accent } = activeTheme;
            const radius = appearance?.button_style === 'Sharp' ? 'rounded-none' : appearance?.button_style === 'Rounded' ? 'rounded-lg' : 'rounded-full';

            return (
              <div
                className="w-64 h-[500px] border-[6px] border-surface-container-high rounded-[3rem] p-md relative overflow-hidden flex flex-col items-center shadow-2xl transition-all duration-500"
                style={{ backgroundColor: bg, fontFamily: appearance?.font_family }}
              >
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center w-full mb-md mt-sm">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-14 h-14 rounded-full object-cover mb-xs border-2"
                      style={{ borderColor: accent }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full opacity-80 mb-xs flex items-center justify-center border-2" style={{ backgroundColor: card, borderColor: accent }}>
                      <span className="text-[10px] font-bold uppercase" style={{ color: text }}>{profile?.username?.substring(0, 2) || 'UN'}</span>
                    </div>
                  )}
                  <h3 className="text-[12px] font-black truncate w-full" style={{ color: text }}>
                    @{profile?.username || 'username'}
                  </h3>
                  <p className="text-[9px] opacity-70 line-clamp-2 w-full px-xs" style={{ color: text }}>
                    {bio || 'Sharing my digital footprint one link at a time.'}
                  </p>
                </div>

                <div className="w-full space-y-sm overflow-y-auto no-scrollbar max-h-[260px] px-xs">
                  {links?.filter(l => l.is_active).map(l => {
                    const PreviewIcon = iconMap[l.icon_name] || Globe;
                    return (
                      <div
                        key={l.id}
                        className={`w-full py-[8px] px-sm flex items-center justify-between transition-all shadow-sm border border-transparent ${radius}`}
                        style={{ backgroundColor: card, color: text }}
                      >
                        <div className="flex items-center gap-xs overflow-hidden">
                          <PreviewIcon size={12} style={{ color: accent }} />
                          <span className="text-[9px] font-bold truncate flex-1" style={{ color: text }}>{l.title}</span>
                        </div>
                        <div className="w-2.5 h-2.5 opacity-30 shrink-0" style={{ backgroundColor: text, WebkitMask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\'%3E%3C/path%3E%3Cpolyline points=\'15 3 21 3 21 9\'%3E%3C/polyline%3E%3Cline x1=\'10\' y1=\'14\' x2=\'21\' y2=\'3\'%3E%3C/line%3E%3C/svg%3E") center/contain no-repeat' }} />
                      </div>
                    );
                  })}
                  {(!links || links.filter(l => l.is_active).length === 0) && (
                    <div className={`w-full h-10 border border-dashed border-outline-variant/30 flex items-center justify-center ${radius}`}>
                      <span className="text-[8px] text-on-surface-variant/40">No active links</span>
                    </div>
                  )}
                </div>

                {/* Social Row - Simplified */}
                <div className="mt-md pt-md border-t w-full flex justify-center gap-sm" style={{ borderColor: 'rgba(150,150,150,0.1)' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full" style={{ backgroundColor: card }} />
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
    </>
  );
};

export default LinksClient;
