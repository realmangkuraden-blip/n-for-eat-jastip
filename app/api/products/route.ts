import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,description,image_url,selling_price,jastip_fee,is_available,is_featured,is_bestseller,is_promo,category:categories(name,slug)')
    .eq('is_available', true)
    .order('is_featured', { ascending: false })
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
