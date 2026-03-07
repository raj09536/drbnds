
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAppointments() {
    console.log('Testing public_appointments...')
    const { data, error } = await supabase.from('public_appointments').select('*').limit(1)
    if (error) {
        console.error('Error fetching appointments:', error)
    } else {
        console.log('Successfully fetched appointments:', data)
        if (data && data.length > 0) {
            console.log('Appointments columns:', Object.keys(data[0]))
        }
    }
}

testAppointments()
