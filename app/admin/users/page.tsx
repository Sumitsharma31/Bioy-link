import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Users, Search, MoreVertical, Shield, Trash2, Mail } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();

  // Fetch users (profiles)
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    return <div className="text-error p-xl">Error fetching users: {error.message}</div>;
  }

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-md text-on-surface">User Management</h2>
          <p className="text-body-md text-on-surface-variant">View, edit, and manage all registered users on the platform.</p>
        </div>
        <div className="flex gap-md">
          <div className="relative">
            <Search size={18} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              placeholder="Search users..." 
              className="bg-surface-container-low border border-outline-variant/20 rounded-lg pl-xl pr-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-sm px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-bold hover:opacity-90 transition-all">
            Add User
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
        <div className="overflow-x-hidden md:overflow-x-auto">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-high/50 text-label-sm uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/10">
                <th className="px-xl py-md font-bold">User Information</th>
                <th className="px-xl py-md font-bold">Subscription</th>
                <th className="px-xl py-md font-bold">Timezone</th>
                <th className="px-xl py-md font-bold">Joined</th>
                <th className="px-xl py-md font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/10">
              {users?.map((user) => (
                <tr key={user.id} className="block md:table-row hover:bg-surface-variant/20 transition-colors group p-md md:p-0 relative">
                  <td className="block md:table-cell px-md md:px-xl py-sm md:py-md">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden flex items-center justify-center shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold">{user.username?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md font-bold text-on-surface truncate">{user.full_name || 'Anonymous'}</p>
                        <p className="text-label-sm text-on-surface-variant truncate">@{user.username}</p>
                      </div>
                      <div className="md:hidden">
                        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-sm rounded-lg hover:bg-surface-container-high">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-md md:px-xl py-xs md:py-md">
                    <span className="md:hidden text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Plan</span>
                    <span className={`text-label-sm px-sm py-[2px] rounded uppercase font-bold tracking-wider ${
                      user.subscription_tier === 'pro' 
                        ? 'bg-primary-container text-on-primary-container' 
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-md md:px-xl py-xs md:py-md text-body-sm text-on-surface-variant">
                    <span className="md:hidden text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Timezone</span>
                    <span>{user.timezone || 'UTC'}</span>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-md md:px-xl py-xs md:py-md text-body-sm text-on-surface-variant">
                    <span className="md:hidden text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Joined</span>
                    <span>{new Date(user.updated_at || Date.now()).toLocaleDateString()}</span>
                  </td>
                  <td className="block md:table-cell px-md md:px-xl py-sm md:py-md mt-sm md:mt-0 border-t border-outline-variant/5 md:border-none">
                    <div className="flex items-center justify-around md:justify-end gap-md">
                      <button className="flex items-center justify-center gap-xs flex-1 md:flex-none text-on-surface-variant hover:text-primary transition-colors p-sm rounded-lg hover:bg-surface-container-high bg-surface-container md:bg-transparent" title="Send Email">
                        <Mail size={18} />
                        <span className="md:hidden text-label-sm font-bold">Email</span>
                      </button>
                      <button className="flex items-center justify-center gap-xs flex-1 md:flex-none text-on-surface-variant hover:text-error transition-colors p-sm rounded-lg hover:bg-surface-container-high bg-surface-container md:bg-transparent" title="Delete User">
                        <Trash2 size={18} />
                        <span className="md:hidden text-label-sm font-bold">Delete</span>
                      </button>
                      <button className="hidden md:flex text-on-surface-variant hover:text-on-surface transition-colors p-sm rounded-lg hover:bg-surface-container-high">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-xl border-t border-outline-variant/10 flex items-center justify-between bg-surface/30">
          <p className="text-label-sm text-on-surface-variant">Showing {users?.length} of {users?.length} users</p>
          <div className="flex gap-sm">
            <button disabled className="px-md py-xs border border-outline-variant/20 rounded-lg text-label-sm font-bold opacity-50">Previous</button>
            <button disabled className="px-md py-xs border border-outline-variant/20 rounded-lg text-label-sm font-bold opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
