export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export function gtag(...args: any[]) {
  if (typeof window === 'undefined') return
  ;(window as any).dataLayer = (window as any).dataLayer || []
  ;(window as any).dataLayer.push(args)
}

export const analytics = {
  viewItem: (p: { id: string|number; name: string; price?: number }) => {
    if (!GA_ID) return
    gtag('event', 'view_item', {
      currency: 'UAH',
      value: p.price || 0,
      items: [{ item_id: String(p.id), item_name: p.name, price: p.price }],
    })
  },
  addToCart: (p: { id: string|number; name: string; price?: number; quantity?: number }) => {
    if (!GA_ID) return
    gtag('event', 'add_to_cart', {
      currency: 'UAH',
      value: (p.price || 0) * (p.quantity || 1),
      items: [{ item_id: String(p.id), item_name: p.name, price: p.price, quantity: p.quantity || 1 }],
    })
  },
  purchase: (order: { id: string; value: number; items: Array<{ id: string|number; name: string; price?: number; quantity?: number }> }) => {
    if (!GA_ID) return
    gtag('event', 'purchase', {
      transaction_id: order.id,
      currency: 'UAH',
      value: order.value,
      items: order.items.map(i => ({ item_id: String(i.id), item_name: i.name, price: i.price, quantity: i.quantity || 1 })),
    })
  },
}
