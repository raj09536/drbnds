
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDetailedColumns() {
    const table = 'contact_messages'
    // Try to insert a row with all possible columns to see what sticks, or use RPC
    // Alternatively, just try to select some columns and see error
    const columns = ['id', 'name', 'email', 'phone', 'clinic', 'message', 'clinic_id', 'is_read', 'created_at']
    for (const col of columns) {
        const { error } = await supabase.from(table).select(col).limit(1)
        if (error) {
            console.log(`Column '${col}' in ${table} NOT found: ${error.message}`)
        } else {
            console.log(`Column '${col}' in ${table} EXISTS`)
        }
    }
}

checkDetailedColumns()
