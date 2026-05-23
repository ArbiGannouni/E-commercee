/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  rating: number;
  ratingCount: number;
  stock: number;
  highlights: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  purchasePrice?: number;
  mediaOrder?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string; // ISO string or simple date string
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  promoCode?: string;
  paymentMethod: string;
}

export interface PromoCode {
  code: string;
  percent: number;
  active: boolean;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  registrationDate: string;
}

export interface SalesDataPoint {
  date: string;
  amount: number;
  ordersCount: number;
}

export interface SimulatedEmail {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  productName: string;
  productId: string;
  stock: number;
}

export type UserRole = 'super_admin' | 'admin' | 'customer';

export interface AdminPermissions {
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canDeleteOrders: boolean;
  canManageOrders: boolean;
  canManagePromos: boolean;
  canModifySettings: boolean;
  viewDashboard: boolean;
  viewProducts: boolean;
  viewOrders: boolean;
  viewCustomers: boolean;
  viewPromos: boolean;
  viewEmails: boolean;
  viewSettings: boolean;
  viewPermissions: boolean;
}

export interface FooterFeature {
  id: string;
  title: string;
  desc: string;
  icon: string;
}



