
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
    console.log('Listing tables...')
    // This is a bit of a hack to get table names via a common error or RPC if enabled
    // But we can just try some likely names
    const tables = ['doctors', 'clinics', 'testimonials', 'appointments', 'public_appointments', 'messages', 'contact_messages', 'feedback']
    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
            console.log(`Table '${table}' error: ${error.message}`)
        } else {
            console.log(`Table '${table}' EXISTS!`)
        }
    }
}

listTables()
