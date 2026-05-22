/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order, Customer, PromoCode, SalesDataPoint } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aether Walnut Desk Riser',
    description: 'Handcrafted from kiln-dried North American black walnut wood. Elevated ergonomic viewing angle with integrated storage space for notebooks and accessories. Natural satin wood-wax finish.',
    price: 135.00,
    originalPrice: 155.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    category: 'Desk & Office',
    rating: 4.8,
    ratingCount: 124,
    stock: 24,
    highlights: [
      'Genuine kiln-dried American Walnut',
      'Ergonomic eye-level lift of 4.5 inches',
      'Smooth hand-sanded satin finish',
      'Heavy-duty solid steel support structure'
    ],
    tags: ['wood', 'office', 'ergonomics', 'organizer']
  },
  {
    id: 'prod-2',
    name: 'Boreal Brass Table Lamp',
    description: 'A sculptural table light featuring solid spun brass with a tactile brushed finish. Emits a warm, diffused, glare-free optical glow. Features a knurled brass rotary mechanical dimmer switch.',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    category: 'Lighting',
    rating: 4.9,
    ratingCount: 78,
    stock: 12,
    highlights: [
      'Machined solid-brass components',
      'Custom sand-blasted glass spherical diffuser',
      'Continuous rotary dimmer switch from 1% to 100%',
      'Fully woven protective fabric cord (6.5 ft)'
    ],
    tags: ['lighting', 'brass', 'ambient', 'luxe']
  },
  {
    id: 'prod-3',
    name: 'Scribe Refillable Leather Journal',
    description: 'Crafted from oily vegetable-tanned Italian leather. Houses 160 pages of exceptionally heavy 120gsm cream paper ideal for sketching, standard pen, or fountain inks. Includes brass closure pin.',
    price: 48.00,
    originalPrice: 58.00,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
    category: 'Stationery',
    rating: 4.7,
    ratingCount: 212,
    stock: 45,
    highlights: [
      'Oily pull-up Italian full-grain leather cover',
      'Heavy-weight 120gsm fountain-pen friendly pages',
      'Refillable mechanical brass notebook screws',
      'Develops a rich personal antique patina over time'
    ],
    tags: ['leather', 'stationery', 'craft', 'gift']
  },
  {
    id: 'prod-4',
    name: 'Apex Key Organizer Sleeve',
    description: 'Streamlined pocket storage with silent locking friction hinges. Reduces clutter, halts pocket scratching, and hides up to 8 house or office keys in a beautiful, sand-blasted matte finish.',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    rating: 4.5,
    ratingCount: 94,
    stock: 6,
    highlights: [
      'Aerospace-grade zinc/aluminum alloy body',
      'Scratch-resistant sandblasted matte touch',
      'Friction lock washers for zero rattle',
      'Integrated heavy duty loop for car transponders'
    ],
    tags: ['edc', 'utility', 'metal', 'compact']
  },
  {
    id: 'prod-5',
    name: 'Terrace Ceramic Vase Set',
    description: 'Organic cylindrical stoneware vase featuring a high-fire volcanic texture. Double dipped inside to contain waters for live botanicals, leaving the raw exterior beautifully matte-finished.',
    price: 68.00,
    originalPrice: 75.00,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
    category: 'Home Modern',
    rating: 4.6,
    ratingCount: 63,
    stock: 18,
    highlights: [
      'Individually thrown high-temp stoneware',
      'Raw, mineral-rich textured basalt exterior',
      'Satin glass black fluid lining inside',
      'Includes padded bottom surface savers'
    ],
    tags: ['ceramic', 'decor', 'minimalist', 'artisan']
  },
  {
    id: 'prod-6',
    name: 'Vessel Vacuum Brewing Carafe',
    description: 'Double-walled copper-lined steel insulation provides temperature protection for up to 18 hours. Designed with a hand-turned natural walnut handle, push-button lid mechanism, and wide drip-free spout.',
    price: 92.00,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80',
    category: 'Kitchenware',
    rating: 4.8,
    ratingCount: 81,
    stock: 15,
    highlights: [
      'Keeps coffee piping hot for 12h, cold for 24h',
      'Medical-grade 18/8 stainless steel interior',
      'Ergonomic solid American walnut handle',
      'Leakproof toggle valve lid design'
    ],
    tags: ['insulated', 'kitchen', 'coffee', 'wood']
  },
  {
    id: 'prod-7',
    name: 'Merino Felt Laptop Sleeve',
    description: 'Dense 100% natural Bavarian merino wool construction offers structural water resistance and natural shock absorption. Features a full-grain front card panel pocket and simple magnetic clasp.',
    price: 74.00,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    rating: 4.9,
    ratingCount: 145,
    stock: 30,
    highlights: [
      '100% biodegradable premium wool felt (4mm)',
      'Heavy vegetable-tanned leather accessory shield',
      'Concealed secure magnetic flap snaps',
      'Fits laptops and tablets up to 14.1 inches'
    ],
    tags: ['wool', 'sleeve', 'laptop', 'fashion']
  },
  {
    id: 'prod-8',
    name: 'Aura Spun Metal Planter',
    description: 'A spun powder-coated solid aluminum planter balanced inside a sleek minimalist crossbar metal platform. Elegant satin finish with a drainage hole and silicone stopper for easy watering.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
    category: 'Home Modern',
    rating: 4.4,
    ratingCount: 51,
    stock: 22,
    highlights: [
      'Removable seamless aluminum spun basin',
      'Rigid matte powder-coated steel space frame stand',
      'Equipped with rubber drainage plug spacer',
      'Lightweight and fully rust-resistant'
    ],
    tags: ['plant', 'home', 'metal', 'structure']
  },
  {
    id: 'prod-9',
    name: 'GLOBAL TRAVEL',
    description: 'An immersive travel-themed scrapbook and journal compilation containing vintage world maps, old postal stamps, retro labels, and rustic traveler cards. Perfect for documenting memory logs in exquisite, warm-toned detail.',
    price: 35.00,
    originalPrice: 49.00,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    category: 'Stationery Sets',
    rating: 4.8,
    ratingCount: 92,
    stock: 35,
    highlights: [
      'Complete aesthetic kraft storage gift box',
      'Deluxe 180-page coordinate travel journal',
      'Over 120+ vintage stamps & stickers included',
      'Ideal premium gift choice for craft journalers'
    ],
    tags: ['travel', 'scrapbook', 'craft', 'journal']
  },
  {
    id: 'prod-10',
    name: 'PURPLE MOON IN GLASS',
    description: 'A dreamlike celestial stationary set featuring rich violet, starry indigo, and deep amethyst tones. Built with astronomical calendars, moonphase templates, starry crystal papers, and romantic dreamcatcher cards.',
    price: 49.00,
    originalPrice: 59.00,
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    category: 'Stationery Sets',
    rating: 4.9,
    ratingCount: 114,
    stock: 28,
    highlights: [
      'Magnetic box enclosure with velvet ribbon pull',
      'High-fidelity 120gsm cosmic starry ledger',
      'Gold-foil accent cards and lunar sticker packs',
      'Includes glass wax seal kit and matching purple ink'
    ],
    tags: ['purple', 'moon', 'stars', 'celestial']
  },
  {
    id: 'prod-11',
    name: 'PINK ANNE IN THE FLOWERS',
    description: 'An elegant and romantic pastel pink stationery suite inspired by classic flower gardens and whimsical storybook illustrations. Perfect for beautiful cursive memoirs and elegant hand-written letter crafting.',
    price: 49.00,
    originalPrice: 59.00,
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=800&auto=format&fit=crop&q=80',
    category: 'Stationery Sets',
    rating: 4.7,
    ratingCount: 86,
    stock: 40,
    highlights: [
      'Dainty rose-colored organizer casing',
      'Pressed-flower decorative papers (80 sheets)',
      'Rabbit and floral washitapes & stickers included',
      'Premium blush pink mechanical gel pen'
    ],
    tags: ['pink', 'floral', 'garden', 'cute']
  },
  {
    id: 'prod-12',
    name: 'PETER\'S FOREST',
    description: 'A botanical, woodland-themed bullet journal treasure box containing a heavy magnetic buckle notebook, secret forest guides, herbaceous plant washitapes, and evergreen plant bookmarks.',
    price: 49.00,
    originalPrice: 59.00,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80',
    category: 'Stationery Sets',
    rating: 4.8,
    ratingCount: 75,
    stock: 32,
    highlights: [
      'Premium sage green PU leather magnetic cover',
      'High-density wood-free grid paper ideal for layouts',
      'Exotic flora and fauna pressed decals',
      'Includes structural ruler and multi-use steel clip'
    ],
    tags: ['green', 'botanical', 'forest', 'aesthetic']
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Alexander Sterling',
    email: 'alexander@sterling-design.co',
    ordersCount: 4,
    totalSpent: 489.00,
    registrationDate: '2025-10-12'
  },
  {
    id: 'cust-2',
    name: 'Elena Rostova',
    email: 'elena.rost@vanguard.io',
    ordersCount: 2,
    totalSpent: 263.00,
    registrationDate: '2025-12-04'
  },
  {
    id: 'cust-3',
    name: 'Marcus Vance',
    email: 'marcus@vance.net',
    ordersCount: 1,
    totalSpent: 135.00,
    registrationDate: '2026-02-18'
  },
  {
    id: 'cust-4',
    name: 'Sofia Chen',
    email: 's.chen@modular-labs.com',
    ordersCount: 3,
    totalSpent: 351.00,
    registrationDate: '2026-04-01'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9824',
    date: '2026-05-18T10:30:00Z',
    customerName: 'Alexander Sterling',
    customerEmail: 'alexander@sterling-design.co',
    shippingAddress: {
      street: '154 Mercer St, Apt 4A',
      city: 'New York',
      zipCode: '10012',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Aether Walnut Desk Riser',
        price: 135.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-3',
        productName: 'Scribe Refillable Leather Journal',
        price: 48.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 231.00,
    discount: 23.10,
    shipping: 10.00,
    tax: 16.63,
    total: 234.53,
    status: 'Delivered',
    promoCode: 'AETHER10',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-9751',
    date: '2026-05-19T14:15:00Z',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rost@vanguard.io',
    shippingAddress: {
      street: '22 Rue de l\'Université',
      city: 'Paris',
      zipCode: '75007',
      country: 'France'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Boreal Brass Table Lamp',
        price: 189.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-4',
        productName: 'Apex Key Organizer Sleeve',
        price: 34.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 223.00,
    discount: 0,
    shipping: 15.00,
    tax: 17.84,
    total: 255.84,
    status: 'Shipped',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-9712',
    date: '2026-05-20T09:44:00Z',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@vance.net',
    shippingAddress: {
      street: '842 Skyline Boulevard',
      city: 'San Francisco',
      zipCode: '94116',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Aether Walnut Desk Riser',
        price: 135.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 135.00,
    discount: 13.50,
    shipping: 0,
    tax: 9.72,
    total: 131.22,
    status: 'Pending',
    promoCode: 'WELCOME10',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-9654',
    date: '2026-05-21T08:12:00Z',
    customerName: 'Sofia Chen',
    customerEmail: 's.chen@modular-labs.com',
    shippingAddress: {
      street: 'Block 2, Hillview Crescent 12-04',
      city: 'Singapore',
      zipCode: '669521',
      country: 'Singapore'
    },
    items: [
      {
        productId: 'prod-7',
        productName: 'Merino Felt Laptop Sleeve',
        price: 74.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 148.00,
    discount: 0,
    shipping: 20.00,
    tax: 11.84,
    total: 179.84,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    percent: 10,
    active: true,
    description: '10% off for first-time customers on any order item'
  },
  {
    code: 'AETHER10',
    percent: 10,
    active: true,
    description: 'Special brand discount for loyal catalog members'
  },
  {
    code: 'SPRING20',
    percent: 20,
    active: false,
    description: '20% off during seasonal cleanout (Currently paused)'
  },
  {
    code: 'CREATOR25',
    percent: 25,
    active: true,
    description: 'Exclusively for our premium partner review network'
  }
];

export const SALES_TRENDS: SalesDataPoint[] = [
  { date: 'May 15', amount: 1205.00, ordersCount: 8 },
  { date: 'May 16', amount: 960.00, ordersCount: 6 },
  { date: 'May 17', amount: 1540.00, ordersCount: 11 },
  { date: 'May 18', amount: 2434.53, ordersCount: 14 },
  { date: 'May 19', amount: 1855.84, ordersCount: 9 },
  { date: 'May 20', amount: 2131.22, ordersCount: 12 },
  { date: 'May 21', amount: 1179.84, ordersCount: 5 }
];
