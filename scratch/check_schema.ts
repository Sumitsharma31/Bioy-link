import { createAdminClient } from '../lib/supabase/admin';

async function checkSchema() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    console.log('Profile columns:', Object.keys(data[0] || {}));
  }
}

checkSchema();
