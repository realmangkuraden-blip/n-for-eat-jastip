'use client'
import { useState } from 'react'
export default function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  function add() { let cart: Record<string,number> = {}; try { cart = JSON.parse(localStorage.getItem('nfe-cart') || '{}') } catch {}; cart[productId]=(cart[productId]||0)+1; localStorage.setItem('nfe-cart',JSON.stringify(cart)); setAdded(true) }
  return <button onClick={add} className="btn btn-primary mt-6 w-full">{added ? '✓ Ditambahkan ke Keranjang' : 'Tambah ke Keranjang'}</button>
}