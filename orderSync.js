import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { TOPPINGS, SIZE_OPTIONS, SERVING_OPTIONS } from '../data/flavors';

const SHEETS_CONFIG_KEY = 'scoopmatch_sheets_webhook_url';

export function getGoogleSheetsWebhookUrl() {
  const envUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl) return envUrl;
  try {
    return localStorage.getItem(SHEETS_CONFIG_KEY) || '';
  } catch {
    return '';
  }
}

export function setGoogleSheetsWebhookUrl(url) {
  try {
    if (url) {
      localStorage.setItem(SHEETS_CONFIG_KEY, url.trim());
    } else {
      localStorage.removeItem(SHEETS_CONFIG_KEY);
    }
  } catch (e) {
    console.error('Failed to save webhook URL', e);
  }
}

// Convert app order structure to flat database & sheets row
export function formatOrderForExport(order) {
  const sizeObj = SIZE_OPTIONS.find(s => s.id === order.size);
  const servingObj = SERVING_OPTIONS.find(s => s.id === order.serving);
  const toppingsFormatted = (order.toppings || [])
    .map(tid => {
      const t = TOPPINGS.find(item => item.id === tid);
      return t ? t.name : tid;
    })
    .join(', ') || '-';

  return {
    order_code: order.orderId,
    customer_name: order.customerName,
    notes: order.notes || '',
    flavor_id: order.flavor?.id || '',
    flavor_name: order.flavor?.name || '',
    serving: servingObj?.name || order.serving,
    size: sizeObj?.name || order.size,
    toppings: toppingsFormatted,
    total_price: order.totalPrice,
    status: order.status || 'pending',
    timestamp: new Date(order.timestamp).toISOString(),
  };
}

// 1. Send order to Google Sheets Webhook (Free Google Apps Script)
export async function sendOrderToGoogleSheets(order) {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!webhookUrl) return false;

  const payload = formatOrderForExport(order);

  try {
    // Mode no-cors avoids CORS restriction on Google Apps Script redirects
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
    return true;
  } catch (err) {
    console.error('Failed to sync to Google Sheets:', err);
    return false;
  }
}

// 2. Insert order to Supabase
export async function insertOrderToSupabase(order) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const row = {
    order_code: order.orderId,
    customer_name: order.customerName,
    notes: order.notes || '',
    flavor_id: order.flavor?.id || '',
    flavor_name: order.flavor?.name || '',
    serving: order.serving,
    size: order.size,
    toppings: order.toppings || [],
    total_price: order.totalPrice,
    status: order.status || 'pending',
    created_at: new Date(order.timestamp).toISOString(),
  };

  try {
    const { data, error } = await supabase.from('orders').insert([row]).select();
    if (error) {
      console.error('Supabase insert error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase unexpected error:', err);
    return null;
  }
}

// 3. Update order status in Supabase
export async function updateOrderInSupabase(orderCode, newStatus) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('order_code', orderCode);

    if (error) {
      console.error('Supabase update error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase update error:', err);
    return false;
  }
}

// 4. Fetch all orders from Supabase
export async function fetchOrdersFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
}

// 5. Subscribe to real-time changes in Supabase
export function subscribeToSupabaseOrders(onOrderChange) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      payload => {
        onOrderChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
