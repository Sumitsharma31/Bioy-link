'use client';

import React, { useState, useTransition } from 'react';
import { 
  GripVertical, Globe, ShoppingBag, BarChart3, Share2, Trash2, 
  Instagram, Twitter, Linkedin, Github, Youtube, Facebook, 
  Mail, Phone, Video, Music, MessageCircle, X, Plus
} from 'lucide-react';
import { toggleLinkActive, deleteLink, updateLinkIcon, addLink } from './actions';

const iconMap: Record<string, React.ElementType> = {
  Globe, Instagram, Twitter, Linkedin, Github, Youtube, Facebook, 
  Mail, Phone, ShoppingBag, Video, Music, MessageCircle
};

interface LinksClientProps {
  initialLinks: any[];
  appearance: any;
}

const LinksClient = ({ initialLinks, appearance }: LinksClientProps) => {
  const [links, setLinks] = useState(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [newLinkIcon, setNewLinkIcon] = useState('Globe');
  const [showNewIconPicker, setShowNewIconPicker] = useState(false);

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('iconName', newLinkIcon);
    
    startTransition(async () => {
      const result = await addLink(formData);
      if (result.success) {
        // Refresh local state (in a real app we'd get the new link back from the action)
        // For now, since we revalidatePath, we can just hope the user refreshes or 
        // we can fetch the latest links here. But better to just update the UI.
        window.location.reload(); // Simple fix for now to ensure all server state is fresh
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
    if (confirm('Are you sure you want to delete this link?')) {
      startTransition(async () => {
        await deleteLink(id);
        setLinks(links.filter(l => l.id !== id));
      });
    }
  };

  const handleSelectIcon = (linkId: string, iconName: string) => {
    startTransition(async () => {
      await updateLinkIcon(linkId, iconName);
      setLinks(links.map(l => l.id === linkId ? { ...l, icon_name: iconName } : l));
      setSelectedLinkId(null);
    });
  };

  return (
    <>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-md pt-sm md:pt-0 mb-xl">
        <div>
          <h1 className="text-headline-lg text-on-surface mb-xs">Manage Links</h1>
          <p className="text-on-surface-variant text-body-md">Add new links and organize your profile.</p>
        </div>
        
        <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-sm w-full lg:w-auto items-center">
           <div className="w-full sm:w-40 relative">
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

      <div className="grid grid-cols-1 gap-md">
        {links?.map((link) => {
          const LinkIcon = iconMap[link.icon_name] || Globe;
          return (
            <div
              key={link.id}
              className={`bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col md:flex-row gap-lg group hover:border-outline-variant/40 transition-colors ${
                !link.is_active ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all' : ''
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
            </div>
          );
        })}
        {links?.length === 0 && (
           <div className="text-center py-xl text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
             No links yet. Click "Add Link" to get started.
           </div>
        )}
      </div>

      {/* Live Preview Outline */}
      <div className="mt-xl">
        <h2 className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-md">Live Preview Outline</h2>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-xl flex items-center justify-center wireframe-pattern">
          {(() => {
            const themes = [
              { name: 'Modern Lime', colors: ['#131313', '#d2e823', '#e5e2e1'] },
              { name: 'Deep Space', colors: ['#0a0a2e', '#7c3aed', '#e2e8f0'] },
              { name: 'Snow Peak', colors: ['#ffffff', '#1a1a1a', '#6b7280'] },
              { name: 'Custom', colors: ['#1a1a2e', '#00d9ff', '#f0f0f0'] },
            ];
            const activeTheme = themes.find(t => t.name === appearance?.theme_preset) || themes[0];
            const [bg, primary, text] = activeTheme.colors;
            const radius = appearance?.button_style === 'Sharp' ? 'rounded-none' : appearance?.button_style === 'Rounded' ? 'rounded-md' : 'rounded-full';

            return (
              <div 
                className="w-64 h-[440px] border-[6px] border-surface-container-high rounded-[3rem] p-md relative overflow-hidden flex flex-col items-center shadow-2xl transition-all duration-500"
                style={{ backgroundColor: bg, fontFamily: appearance?.font_family }}
              >
                <div className="w-14 h-14 rounded-full opacity-80 mb-md mt-sm" style={{ backgroundColor: primary }} />
                <div className="w-24 h-2 rounded-full mb-xs" style={{ backgroundColor: text, opacity: 0.6 }} />
                <div className="w-16 h-1.5 rounded-full mb-lg" style={{ backgroundColor: text, opacity: 0.3 }} />
                
                <div className="w-full space-y-sm overflow-y-auto no-scrollbar max-h-[220px] px-xs">
                  {links?.filter(l => l.is_active).map(l => {
                    const PreviewIcon = iconMap[l.icon_name] || null;
                    return (
                      <div 
                        key={l.id} 
                        className={`w-full h-10 flex items-center gap-sm px-sm transition-all shadow-sm ${radius}`}
                        style={{ backgroundColor: primary }}
                      >
                         {PreviewIcon && <PreviewIcon size={12} style={{ color: bg }} />}
                         <span className="text-[10px] font-bold truncate flex-1 text-center" style={{ color: bg }}>{l.title}</span>
                      </div>
                    );
                  })}
                  {(!links || links.filter(l => l.is_active).length === 0) && (
                     <div className={`w-full h-10 border border-dashed border-outline-variant/30 flex items-center justify-center ${radius}`}>
                       <span className="text-[8px] text-on-surface-variant/40">No active links</span>
                     </div>
                  )}
                </div>
                
                <div className="mt-auto pb-sm">
                  <span className="text-[10px] font-black tracking-tighter" style={{ color: text, opacity: 0.5 }}>BioLinks</span>
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
