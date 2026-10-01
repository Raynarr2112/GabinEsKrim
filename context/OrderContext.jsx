import React, { createContext, useContext, useState, useEffect } from 'react';
import { FLAVORS, TOPPINGS, SIZE_OPTIONS } from '../data/flavors';
import { calculateRecommendation } from '../utils/scoring';
import { generateOrderId } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  isSupabaseConfigured,
} from '../services/supabase';
import {
  insertOrderToSupabase,
  updateOrderInSupabase,
  fetchOrdersFromSupabase,
  subscribeToSupabaseOrders,
  sendOrderToGoogleSheets,
  getGoogleSheetsWebhookUrl,
} from '../services/orderSync';

const OrderContext = createContext();

const STORAGE_KEY = 'scoopmatch_order_queue_v1';

// Initial mock orders for realistic barista queue demonstration
const INITIAL_DEMO_ORDERS = [
  {
    orderId: '#SCOOP-108',
    customerName: 'Alya Putri',
    notes: 'Sendok kayu ya kak, makasih!',
    flavor: FLAVORS[1], // Berry Blast
    serving: 'cup',
    size: 'single',
    toppings: ['boba'],
    totalPrice: 18000,
    timestamp: Date.now() - 1000 * 60 * 12,
    status: 'selesai',
  },
  {
    orderId: '#SCOOP-109',
    customerName: 'Bima Satria',
    notes: 'Topping biskuitnya dibanyakin kak',
    flavor: FLAVORS[3], // Caramel Crunch
    serving: 'cone',
    size: 'double',
    toppings: ['oreo', 'almond'],
    totalPrice: 31000,
    timestamp: Date.now() - 1000 * 60 * 5,
    status: 'diproses',
  },
  {
    orderId: '#SCOOP-110',
    customerName: 'Clarissa',
    notes: '',
    flavor: FLAVORS[0], // Choco Therapy
    serving: 'cone',
    size: 'single',
    toppings: ['choco-chips'],
    totalPrice: 17000,
    timestamp: Date.now() - 1000 * 60 * 2,
    status: 'pending',
  },
];

function mapDatabaseRowToOrder(row) {
  const matchedFlavor = FLAVORS.find(f => f.id === row.flavor_id) || {
    id: row.flavor_id,
    name: row.flavor_name,
    emoji: '🍦',
  };

  return {
    orderId: row.order_code,
    customerName: row.customer_name,
    notes: row.notes || '',
    flavor: matchedFlavor,
    serving: row.serving || 'cone',
    size: row.size || 'single',
    toppings: Array.isArray(row.toppings) ? row.toppings : [],
    totalPrice: Number(row.total_price) || 0,
    timestamp: new Date(row.created_at).getTime(),
    status: row.status || 'pending',
  };
}

export function OrderProvider({ children }) {
  // Navigation / View State
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'quiz' | 'recommendation' | 'ticket' | 'barista-queue'
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [recommendedFlavor, setRecommendedFlavor] = useState(FLAVORS[0]);

  // Ice Cream Customization state
  const [customization, setCustomization] = useState({
    serving: 'cone', // 'cone' | 'cup'
    size: 'single',  // 'single' | 'double'
    toppings: ['oreo'], // array of topping ids
  });

  // Current newly placed order for success ticket
  const [currentTicket, setCurrentTicket] = useState(null);

  // Barista Order Queue with LocalStorage & Cloud persistence
  const [orderQueue, setOrderQueue] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return INITIAL_DEMO_ORDERS;
  });

  // Save to localStorage whenever orderQueue changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderQueue));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orderQueue]);

  // Real-time synchronization with Supabase Cloud Database (if configured)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // 1. Fetch initial orders from cloud
    fetchOrdersFromSupabase().then(rows => {
      if (rows && rows.length > 0) {
        setOrderQueue(rows.map(mapDatabaseRowToOrder));
      }
    });

    // 2. Realtime listener for incoming orders & status changes
    const unsubscribe = subscribeToSupabaseOrders((payload) => {
      if (payload.eventType === 'INSERT') {
        const mapped = mapDatabaseRowToOrder(payload.new);
        setOrderQueue(prev => {
          if (prev.some(o => o.orderId === mapped.orderId)) return prev;
          return [mapped, ...prev];
        });
      } else if (payload.eventType === 'UPDATE') {
        const mapped = mapDatabaseRowToOrder(payload.new);
        setOrderQueue(prev =>
          prev.map(o => (o.orderId === mapped.orderId ? mapped : o))
        );
      } else if (payload.eventType === 'DELETE') {
        setOrderQueue(prev => prev.filter(o => o.orderId !== payload.old.order_code));
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Calculate live total price for current customization
  const calculateTotal = (flavor = recommendedFlavor, config = customization) => {
    const sizeObj = SIZE_OPTIONS.find(s => s.id === config.size) || SIZE_OPTIONS[0];
    let total = sizeObj.price;

    config.toppings.forEach(topId => {
      const topObj = TOPPINGS.find(t => t.id === topId);
      if (topObj) total += topObj.price;
    });

    return total;
  };

  // Launch playful confetti burst
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD1DC', '#FDE047', '#FB7185', '#684535', '#4ADE80'],
      });
    } catch {
      // fallback safe
    }
  };

  // Navigation handlers
  const startQuiz = () => {
    setQuizAnswers({});
    setCurrentView('quiz');
  };

  const handleFinishQuiz = (finalAnswers) => {
    setQuizAnswers(finalAnswers);
    const recommendation = calculateRecommendation(finalAnswers);
    setRecommendedFlavor(recommendation.flavor);

    // Smart default topping recommendation based on flavor
    if (recommendation.flavor.id === 'berry-blast') {
      setCustomization(prev => ({ ...prev, serving: 'cup', toppings: ['boba'] }));
    } else if (recommendation.flavor.id === 'choco-therapy') {
      setCustomization(prev => ({ ...prev, serving: 'cone', toppings: ['oreo', 'choco-chips'] }));
    } else {
      setCustomization(prev => ({ ...prev, toppings: ['oreo'] }));
    }

    setCurrentView('recommendation');
    setTimeout(() => {
      triggerConfetti();
    }, 300);
  };

  // Confirm order, save to Supabase Cloud, send to Google Sheets, and create ticket
  const placeOrder = ({ customerName, notes }) => {
    const newOrder = {
      orderId: generateOrderId(),
      customerName: customerName.trim(),
      notes: notes.trim(),
      flavor: recommendedFlavor,
      serving: customization.serving,
      size: customization.size,
      toppings: [...customization.toppings],
      totalPrice: calculateTotal(),
      timestamp: Date.now(),
      status: 'pending', // 'pending' | 'diproses' | 'selesai'
    };

    // 1. Push to Supabase Cloud Database (if configured)
    insertOrderToSupabase(newOrder);

    // 2. Push to Google Sheets Webhook (if configured)
    sendOrderToGoogleSheets(newOrder);

    // 3. Local state updates
    setOrderQueue(prev => [newOrder, ...prev]);
    setCurrentTicket(newOrder);
    setIsOrderModalOpen(false);
    setCurrentView('ticket');

    // Confetti celebration
    triggerConfetti();
  };

  // Barista status management
  const updateOrderStatus = (orderId, newStatus) => {
    // Update in Supabase
    updateOrderInSupabase(orderId, newStatus);

    // Update in Local State
    setOrderQueue(prev =>
      prev.map(ord => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const deleteOrder = (orderId) => {
    setOrderQueue(prev => prev.filter(ord => ord.orderId !== orderId));
  };

  const resetToDemoOrders = () => {
    setOrderQueue(INITIAL_DEMO_ORDERS);
  };

  const clearQueue = () => {
    setOrderQueue([]);
  };

  return (
    <OrderContext.Provider
      value={{
        currentView,
        setCurrentView,
        isOrderModalOpen,
        setIsOrderModalOpen,
        quizAnswers,
        recommendedFlavor,
        setRecommendedFlavor,
        customization,
        setCustomization,
        currentTicket,
        orderQueue,
        calculateTotal,
        startQuiz,
        handleFinishQuiz,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        resetToDemoOrders,
        clearQueue,
        triggerConfetti,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
