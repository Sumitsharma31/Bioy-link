import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Image as ImageIcon, Trash2, Plus, AlertCircle } from 'lucide-react';
import { addBackgroundImage, deleteBackgroundImage } from './actions';

export default async function AdminAppearancePage() {
  const supabase = await createAdminClient();
  
  const { data: backgrounds, error } = await supabase
    .from('background_images')
    .select('*')
    .order('created_at', { ascending: false });

  // If table doesn't exist or isn't in schema cache yet, handle both error codes
  const tableMissing = error?.code === '42P01' || error?.code === 'PGRST205';

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-md text-on-surface">Appearance Settings</h2>
          <p className="text-body-md text-on-surface-variant">Manage global background images for freemium and premium users.</p>
        </div>
      </div>

      {tableMissing && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-md rounded-lg flex items-center gap-sm">
          <AlertCircle size={20} />
          <span className="text-label-md">The `background_images` table does not exist. Please run the SQL setup script.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl items-start">
        {/* Add New Form */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-md">
          <div className="flex items-center gap-sm mb-xs">
            <Plus size={18} className="text-primary" />
            <h3 className="text-headline-sm text-on-surface">Add Background</h3>
          </div>
          
          <form action={addBackgroundImage} className="flex flex-col gap-md">
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Image Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="e.g. Cyberpunk City"
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Image File (Cloudinary)</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*"
                required 
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm text-on-surface focus:border-primary focus:outline-none file:mr-md file:py-xs file:px-sm file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>

            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Access Tier</label>
              <select 
                name="tier" 
                required
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="pro max">Pro Max</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={tableMissing}
              className="bg-primary-container text-on-primary-container font-bold rounded-lg py-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              Add Image
            </button>
          </form>
        </div>

        {/* List Current Images */}
        <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-md">
          <div className="flex items-center gap-sm mb-xs">
            <ImageIcon size={18} className="text-primary" />
            <h3 className="text-headline-sm text-on-surface">Library</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {backgrounds?.map((bg) => (
              <div key={bg.id} className="relative group rounded-lg overflow-hidden border border-outline-variant/20 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-sm">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-label-md text-white font-bold">{bg.name}</p>
                      <span className={`text-[10px] uppercase font-black tracking-wider px-xs py-[2px] rounded ${bg.tier === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-primary'}`}>
                        {bg.tier}
                      </span>
                    </div>
                    <form action={async () => {
                      'use server'
                      await deleteBackgroundImage(bg.id)
                    }}>
                      <button type="submit" className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}

            {backgrounds?.length === 0 && !tableMissing && (
              <div className="col-span-full py-xl text-center text-on-surface-variant border border-dashed border-outline-variant/20 rounded-lg">
                No background images found. Add one to the library.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
