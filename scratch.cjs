const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zoabkilwmcjreqnrhewm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvYWJraWx3bWNqcmVxbnJoZXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTU4NzgsImV4cCI6MjA5Mzc5MTg3OH0.4L4dFHCMyzbobpXnc04uHhJ2RKsIqLY9c-_KhxJWf4Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('background_images').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Data length:', data.length);
  }
}
check();
