
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection...')

    const { data: doctors, error: dError } = await supabase.from('doctors').select('*').limit(1)
    if (dError) {
        console.error('Error fetching doctors:', dError)
    } else {
        console.log('Successfully fetched doctors:', doctors)
        if (doctors.length > 0) {
            console.log('Doctors columns:', Object.keys(doctors[0]))
        }
    }

    const { data: testimonials, error: tError } = await supabase.from('testimonials').select('*').limit(1)
    if (tError) {
        console.error('Error fetching testimonials:', tError)
    } else {
        console.log('Successfully fetched testimonials:', testimonials)
        if (testimonials.length > 0) {
            console.log('Testimonials columns:', Object.keys(testimonials[0]))
        }
    }
}

testConnection()
