import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Simple protection: Check if user exists and has admin email
  // In production, you'd check a 'role' column in the profiles table
  const adminEmails = ['ssumi@example.com', 'ssumit10kr@gmail.com', 'csumitsharma31@gmail.com']; // Add user's email here

  if (!user || !adminEmails.includes(user.email || '')) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-xl bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-title-md font-bold text-on-surface">Admin Control Panel</h1>
          <div className="flex items-center gap-md">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-sm py-xs rounded">Live Status</span>
          </div>
        </header>

        <div className="p-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
