
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testColumns() {
    const tables = ['appointments', 'contact_messages', 'feedback']
    for (const table of tables) {
        console.log(`Checking ${table}...`)
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.error(`Error ${table}:`, error.message)
        } else if (data && data.length > 0) {
            console.log(`${table} columns:`, Object.keys(data[0]))
        } else {
            console.log(`${table} exists but is empty.`)
            // Try to get columns by selecting something that doesn't exist to see error or just assume
        }
    }
}

testColumns()
