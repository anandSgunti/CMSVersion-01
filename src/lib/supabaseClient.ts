import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdxbmiilvxmittbgkncm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keGJtaWlsdnhtaXR0YmdrbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODU2NjUsImV4cCI6MjA3MjU2MTY2NX0.sPfglbgXQPO0gtTMB31SbfqrcVinFVuL1qQRcrBAFcQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);