import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test connection by getting the current timestamp
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1)

    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected
      return NextResponse.json(
        { error: error.message, connected: false },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Supabase connection successful!',
      connected: true,
      timestamp: new Date().toISOString(),
      note: error?.code === 'PGRST116'
        ? 'Connection works, but test table doesn\'t exist (expected for fresh setup)'
        : 'Connection fully operational'
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to connect to Supabase', connected: false },
      { status: 500 }
    )
  }
}