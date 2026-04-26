import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('email_subscribers')
      .upsert(
        { email: email.toLowerCase().trim(), source: source || 'exit_intent' },
        { onConflict: 'email' }
      );

    if (error) throw error;

    return NextResponse.json({
      success: true,
      code: 'SAVE5',
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Subscription failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
