
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mwpnekexofybhkjirfms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cG5la2V4b2Z5YmhramlyZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDU1NDUsImV4cCI6MjA4NzUyMTU0NX0.CDf67r2d9LuL7x2T8JVZNfDlE3yGsHVif1jaJaFLC-g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testJoin() {
    console.log('Testing join...')
    const { data, error } = await supabase
        .from('testimonials')
        .select('id, patient_name, review, rating, clinics(name)')
        .eq('is_active', true)

    if (error) {
        console.error('Error with join:', error)
    } else {
        console.log('Successfully fetched with join:', JSON.stringify(data, null, 2))
    }
}

testJoin()
