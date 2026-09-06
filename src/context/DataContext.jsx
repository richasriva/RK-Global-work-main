'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { products as defaultProducts } from '../data/products';
import { categories as defaultCategories } from '../data/categories';
import { insights as defaultBlogs } from '../data/insights';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const defaultSlides = [
  { 
    id: '1', 
    title: 'Heavy Duty Rebar Cutting & Bending Machines', 
    subtitle: 'High precision hydraulic benders for infrastructure contractors.', 
    badge: 'OFFICIAL MANUFACTURER', 
    image: '/images/machines/stirrup-bender-d4.jpg',
    headingLine2: '& Bending Machines',
    description: 'High precision hydraulic benders for infrastructure contractors.',
    features: [
      { icon: 'ShieldCheck', label: 'ISO 9001 Certified' },
      { icon: 'Award', label: 'Factory Direct Price' },
      { icon: 'Wrench', label: '1-Year Warranty' },
      { icon: 'CheckCircle2', label: 'Pan-India Delivery' }
    ]
  },
  { 
    id: '2', 
    title: 'Industrial Grade Concrete Mixers & Batching', 
    subtitle: 'Ex-factory prices across India with site warranty.', 
    badge: 'BESTSELLER 2026', 
    image: '/images/machines/concrete-mixer-machine.jpg',
    eyebrow: 'BESTSELLER 2026',
    headingLine1: 'Industrial Grade Concrete Mixers',
    headingLine2: '& Batching Machinery',
    description: 'Ex-factory prices across India with site warranty.',
    features: [
      { icon: 'ShieldCheck', label: 'High Batch Capacity' },
      { icon: 'Award', label: 'Heavy Steel Drum' },
      { icon: 'Wrench', label: 'Site Support' },
      { icon: 'CheckCircle2', label: 'Ex-Factory Price' }
    ]
  },
  { 
    id: '3', 
    title: 'High Rise Suspended Platform Hoists', 
    subtitle: 'ZLP800 800kg load rating with safety lock mechanism.', 
    badge: 'PAN INDIA DELIVERY', 
    image: '/images/machines/suspended-platform-zlp800.webp',
    eyebrow: 'PAN INDIA DELIVERY',
    headingLine1: 'High Rise Suspended',
    headingLine2: 'Platform Hoists (ZLP800)',
    description: 'ZLP800 800kg load rating with safety lock mechanism.',
    features: [
      { icon: 'ShieldCheck', label: 'ZLP800 Standard' },
      { icon: 'Award', label: '800kg Load Rating' },
      { icon: 'Wrench', label: 'Safety Lock Mechanism' },
      { icon: 'CheckCircle2', label: 'Pan India Onsite Service' }
    ]
  }
];

const defaultAboutData = {
  eyebrow: 'OFFICIAL R.K. GLOBAL ENGINEERING',
  title: 'Two Decades of Engineering Excellence in Construction Machinery',
  subtitle: 'We combine heavy manufacturing precision with ISO 9001 quality controls to deliver rugged machinery contractors trust implicitly across India.',
  experienceBadgeText: '20+ YEARS',
  experienceBadgeSub: 'Manufacturing Excellence',
  image: '/images/machines/threading-machine-worker.webp',
  feature1Title: 'Factory Direct Pricing & Transparent Warranty',
  feature1Desc: 'Eliminate middleman margins with ex-factory pricing and 1-year comprehensive warranty.',
  feature2Title: 'Pan-India On-Site Technical Service Support',
  feature2Desc: 'Dedicated field engineering team for fast installation, operator training, and spare parts delivery.'
};

const DataContext = createContext({
  products: [],
  categories: [],
  slides: [],
  blogs: [],
  aboutData: defaultAboutData,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  addSlide: () => {},
  updateSlide: () => {},
  deleteSlide: () => {},
  addBlog: () => {},
  updateBlog: () => {},
  deleteBlog: () => {},
  updateAbout: () => {}
});

export function DataProvider({ children }) {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState(defaultProducts);
  const [categories, setCategories] = useState(defaultCategories);
  const [slides, setSlides] = useState(defaultSlides);
  const [blogs, setBlogs] = useState(defaultBlogs);
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [orders, setOrders] = useState([]);
  
  // Track timestamp of local admin edit to prevent local re-render lag from realtime echoes
  const lastLocalEditRef = useRef(0);

  const normalizeSlide = (s) => ({
    id: s.id || Date.now().toString(),
    title: s.title || 'Heavy Duty Construction Machinery',
    subtitle: s.subtitle || 'High precision B2B machinery manufactured in India.',
    badge: s.badge || 'OFFICIAL MANUFACTURER',
    image: s.image || '/images/machines/stirrup-bender-d4.jpg',
    eyebrow: s.badge || s.eyebrow || 'OFFICIAL MANUFACTURER',
    headingLine1: s.title || 'Heavy Duty Construction Machinery',
    headingLine2: '',
    description: s.subtitle || 'High precision B2B machinery manufactured in India.',
    features: s.features && Array.isArray(s.features) ? s.features : [
      { icon: 'ShieldCheck', label: 'ISO 9001 Certified' },
      { icon: 'Award', label: 'Factory Direct Price' },
      { icon: 'Wrench', label: '1-Year Warranty' },
      { icon: 'CheckCircle2', label: 'Pan-India Delivery' }
    ]
  });

  // Table-specific fetch helpers for micro-targeted updates
  const fetchProductsOnly = async () => {
    try {
      const { data: supaProds } = await supabase.from('products').select('*');
      if (supaProds && supaProds.length > 0) {
        setProducts(supaProds);
        saveStorage('rk_cms_products', supaProds);
      }
    } catch (e) {}
  };

  const fetchCategoriesOnly = async () => {
    try {
      const { data: supaCats } = await supabase.from('categories').select('*');
      if (supaCats && supaCats.length > 0) {
        setCategories(supaCats);
        saveStorage('rk_cms_categories', supaCats);
      }
    } catch (e) {}
  };

  const fetchSlidesOnly = async () => {
    try {
      const { data: supaSlides } = await supabase.from('hero_slides').select('*');
      if (supaSlides && supaSlides.length > 0) {
        const normSupa = supaSlides.map(normalizeSlide);
        setSlides(normSupa);
        saveStorage('rk_cms_slides', normSupa);
      }
    } catch (e) {}
  };

  const fetchBlogsOnly = async () => {
    try {
      const { data: supaBlogs } = await supabase.from('blogs').select('*');
      if (supaBlogs && supaBlogs.length > 0) {
        setBlogs(supaBlogs);
        saveStorage('rk_cms_blogs', supaBlogs);
      }
    } catch (e) {}
  };

  const fetchAboutOnly = async () => {
    try {
      const { data: supaAboutData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'about_section')
        .maybeSingle();

      if (supaAboutData && supaAboutData.value) {
        setAboutData(supaAboutData.value);
        saveStorage('rk_cms_about', supaAboutData.value);
      }
    } catch (e) {}
  };

  // Synchronize on initial mount from localStorage / Supabase + Realtime listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProds = localStorage.getItem('rk_cms_products');
      const storedCats = localStorage.getItem('rk_cms_categories');
      const storedSlides = localStorage.getItem('rk_cms_slides');
      const storedBlogs = localStorage.getItem('rk_cms_blogs');
      const storedAbout = localStorage.getItem('rk_cms_about');

      if (storedProds) {
        try { setProducts(JSON.parse(storedProds)); } catch (e) {}
      }
      if (storedCats) {
        try { setCategories(JSON.parse(storedCats)); } catch (e) {}
      }
      if (storedSlides) {
        try {
          const parsed = JSON.parse(storedSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed.map(normalizeSlide));
          }
        } catch (e) {}
      }
      if (storedBlogs) {
        try { setBlogs(JSON.parse(storedBlogs)); } catch (e) {}
      }
      if (storedAbout) {
        try { setAboutData(JSON.parse(storedAbout)); } catch (e) {}
      }
    }

    // Initial sync for all tables
    const syncAllFromSupabase = async () => {
      await fetchProductsOnly();
      await fetchCategoriesOnly();
      await fetchSlidesOnly();
      await fetchBlogsOnly();
      await fetchAboutOnly();
    };

    syncAllFromSupabase();

    // BroadcastChannel for instant (0ms) live synchronization across all open browser tabs
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('rk_global_cms_sync');
        bc.onmessage = (event) => {
          const { key, data } = event.data || {};
          if (key === 'rk_cms_products') setProducts(data);
          else if (key === 'rk_cms_categories') setCategories(data);
          else if (key === 'rk_cms_slides') setSlides(data);
          else if (key === 'rk_cms_blogs') setBlogs(data);
          else if (key === 'rk_cms_about') setAboutData(data);
        };
      } catch (e) {}
    }

    // Subscribe to Supabase Realtime changes for instant live updates across visitors
    let channel = null;
    try {
      channel = supabase
        .channel('public-cms-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          // Skip Realtime echo if local edit was executed less than 4s ago (prevents 1s lag for local admin)
          if (Date.now() - lastLocalEditRef.current < 4000) {
            return;
          }
          if (payload.table === 'products') fetchProductsOnly();
          else if (payload.table === 'categories') fetchCategoriesOnly();
          else if (payload.table === 'hero_slides') fetchSlidesOnly();
          else if (payload.table === 'blogs') fetchBlogsOnly();
          else if (payload.table === 'site_settings') fetchAboutOnly();
        })
        .subscribe();
    } catch (e) {}

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, []);

  // Orders contain customer PII — only sync when admin is authenticated via Supabase
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      return;
    }

    const syncOrders = async () => {
      let deletedIds = [];
      if (typeof window !== 'undefined') {
        try {
          deletedIds = JSON.parse(localStorage.getItem('rk_deleted_orders') || '[]');
          const stored = localStorage.getItem('rk_cms_orders');
          if (stored) {
            const parsed = JSON.parse(stored);
            setOrders(parsed.filter(o => !deletedIds.includes(String(o.id))));
          }
        } catch (e) {}
      }

      try {
        const { data: supaOrders, error } = await supabase
          .from('orders')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) {
          console.error('[DataContext] Orders sync error:', error.message);
          return;
        }

        if (supaOrders && supaOrders.length > 0) {
          const filtered = supaOrders.filter(o => !deletedIds.includes(String(o.id)));
          setOrders(filtered);
          saveStorage('rk_cms_orders', filtered);
        }
      } catch (err) {}
    };

    syncOrders();
  }, [isAdmin]);

  // Save to Storage helper — handles QuotaExceededError gracefully
  const saveStorage = (key, data) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        if (err && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.error('[DataContext] localStorage quota exceeded for key:', key);
        } else {
          console.error('[DataContext] saveStorage error:', err);
        }
      }
    }
  };

  // Instant cross-tab broadcast synchronization
  const broadcastSync = (key, data) => {
    saveStorage(key, data);
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('rk_global_cms_sync');
        bc.postMessage({ key, data });
        bc.close();
      } catch (e) {}
    }
  };

  const keepImage = (img) => {
    return img || '';
  };

  // --- PAYLOAD FOR LOCALSTORAGE & SUPABASE ---
  const rawProduct = (p) => ({
    id: String(p.id || Date.now()),
    code: p.code || 'RK-PRODUCT',
    name: p.name || 'Machinery',
    categoryName: p.categoryName || p.category || 'Rebar Processing',
    category: p.category || 'rebar-processing',
    priceFormatted: p.priceFormatted || '₹ 1,50,000',
    priceNum: Number(p.priceNum) || 150000,
    shortDescription: p.shortDescription || p.description || '',
    description: p.description || p.shortDescription || '',
    image: keepImage(p.image),
    gallery: Array.isArray(p.gallery) ? p.gallery.map(g => keepImage(g)) : [keepImage(p.image)],
    technicalSpecs: typeof p.technicalSpecs === 'object' && p.technicalSpecs ? p.technicalSpecs : {},
    keySpecs: Array.isArray(p.keySpecs) ? p.keySpecs : [],
    features: Array.isArray(p.features) ? p.features : [],
    minOrderQty: p.minOrderQty || '1 Piece / Pieces',
    supplyAbility: p.supplyAbility || '5 Piece Per Day',
    deliveryTime: p.deliveryTime || '1 - 3 Days'
  });

  const cleanProduct = (p) => rawProduct(p);

  const rawBlog = (b) => ({
    id: String(b.id || Date.now()),
    slug: b.slug || (b.title ? b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `blog-${Date.now()}`),
    title: b.title || 'Untitled Blog',
    category: b.category || 'Technical Guide',
    author: b.author || 'R.K. Global Engineering',
    date: b.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    readTime: b.readTime || '5 min read',
    image: keepImage(b.image),
    excerpt: b.excerpt || b.title || '',
    content: b.content || '<p>Article content...</p>'
  });

  const cleanBlog = (b) => rawBlog(b);

  const rawCategory = (c) => ({
    id: String(c.id || c.slug || Date.now()),
    name: c.name || 'Category',
    slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`),
    description: c.description || '',
    image: keepImage(c.image),
    itemCount: Number(c.itemCount) || 0
  });

  const cleanCategory = (c) => rawCategory(c);

  const rawSlide = (s) => ({
    id: String(s.id || Date.now()),
    title: s.title || 'Heavy Duty Construction Machinery',
    subtitle: s.subtitle || '',
    badge: s.badge || 'OFFICIAL MANUFACTURER',
    image: keepImage(s.image),
    eyebrow: s.eyebrow || s.badge || 'OFFICIAL MANUFACTURER',
    headingLine1: s.headingLine1 || s.title || '',
    headingLine2: s.headingLine2 || '',
    description: s.description || s.subtitle || '',
    features: Array.isArray(s.features) ? s.features : [],
    btnPrimaryText: s.btnPrimaryText || 'Request Quote Now',
    btnSecondaryText: s.btnSecondaryText || 'View 2026 Catalog'
  });

  const cleanSlide = (s) => rawSlide(s);

  // --- PRODUCT CRUD (0ms Instant Local Update + Async Background Database Upsert) ---
  const addProduct = (prodData) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawProduct(prodData);
    const updated = [raw, ...products];
    setProducts(updated);
    broadcastSync('rk_cms_products', updated);

    // Save to Supabase in background
    const cleaned = cleanProduct(prodData);
    supabase.from('products').upsert([cleaned]).then(({ error }) => {
      if (error) {
        console.error('[DataContext] Background addProduct error:', error);
        if (typeof window !== 'undefined') {
          alert('Supabase Database Error:\n' + (error.message || error.hint || JSON.stringify(error)));
        }
      }
    }).catch(err => console.error('[DataContext] Background addProduct exception:', err));
  };

  const updateProduct = (updatedProd) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawProduct(updatedProd);
    const updated = products.map(p => String(p.id) === String(raw.id) ? raw : p);
    setProducts(updated);
    broadcastSync('rk_cms_products', updated);

    // Save to Supabase in background
    const cleaned = cleanProduct(updatedProd);
    supabase.from('products').upsert([cleaned]).then(({ error }) => {
      if (error) {
        console.error('[DataContext] Background updateProduct error:', error);
        if (typeof window !== 'undefined') {
          alert('Supabase Database Error:\n' + (error.message || error.hint || JSON.stringify(error)));
        }
      }
    }).catch(err => console.error('[DataContext] Background updateProduct exception:', err));
  };

  const deleteProduct = (id) => {
    lastLocalEditRef.current = Date.now();
    const targetId = String(id);
    const updated = products.filter(p => String(p.id) !== targetId);
    setProducts(updated);
    broadcastSync('rk_cms_products', updated);

    // Delete from Supabase in background
    supabase.from('products').delete().eq('id', targetId).then(({ error }) => {
      if (error) console.error('[DataContext] Background deleteProduct error:', error);
    }).catch(() => {});
  };

  // --- SLIDE CRUD (0ms Instant Local Update + Async Background Database Upsert) ---
  const addSlide = (slideData) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawSlide(slideData);
    // PREPEND NEW BANNER SO IT SHOWS FIRST AT INDEX 0 INSTANTLY
    const updated = [raw, ...slides];
    setSlides(updated);
    broadcastSync('rk_cms_slides', updated);

    const cleaned = cleanSlide(slideData);
    supabase.from('hero_slides').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Slide Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const updateSlide = (updatedSlide) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawSlide(updatedSlide);
    const updated = slides.map(s => String(s.id) === String(raw.id) ? raw : s);
    setSlides(updated);
    broadcastSync('rk_cms_slides', updated);

    const cleaned = cleanSlide(updatedSlide);
    supabase.from('hero_slides').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Slide Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const deleteSlide = (id) => {
    lastLocalEditRef.current = Date.now();
    const targetId = String(id);
    const updated = slides.filter(s => String(s.id) !== targetId);
    setSlides(updated);
    broadcastSync('rk_cms_slides', updated);

    supabase.from('hero_slides').delete().eq('id', targetId).then(({ error }) => {
      if (error) console.error('[DataContext] Background deleteSlide error:', error);
    }).catch(() => {});
  };

  // --- BLOG CRUD (0ms Instant Local Update + Async Background Database Upsert) ---
  const addBlog = (blogData) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawBlog(blogData);
    const updated = [raw, ...blogs];
    setBlogs(updated);
    broadcastSync('rk_cms_blogs', updated);

    const cleaned = cleanBlog(blogData);
    supabase.from('blogs').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Blog Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const updateBlog = (updatedBlog) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawBlog(updatedBlog);
    const updated = blogs.map(b => String(b.id) === String(raw.id) ? raw : b);
    setBlogs(updated);
    broadcastSync('rk_cms_blogs', updated);

    const cleaned = cleanBlog(updatedBlog);
    supabase.from('blogs').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Blog Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const deleteBlog = (id) => {
    lastLocalEditRef.current = Date.now();
    const targetId = String(id);
    const updated = blogs.filter(b => String(b.id) !== targetId);
    setBlogs(updated);
    broadcastSync('rk_cms_blogs', updated);

    supabase.from('blogs').delete().eq('id', targetId).then(({ error }) => {
      if (error) console.error('[DataContext] Background deleteBlog error:', error);
    }).catch(() => {});
  };

  // --- CATEGORY CRUD (0ms Instant Local Update + Async Background Database Upsert) ---
  const addCategory = (catData) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawCategory(catData);
    const updated = [raw, ...categories];
    setCategories(updated);
    broadcastSync('rk_cms_categories', updated);

    const cleaned = cleanCategory(catData);
    supabase.from('categories').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Category Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const updateCategory = (updatedCat) => {
    lastLocalEditRef.current = Date.now();
    const raw = rawCategory(updatedCat);
    const updated = categories.map(c => String(c.id) === String(raw.id) ? raw : c);
    setCategories(updated);
    broadcastSync('rk_cms_categories', updated);

    const cleaned = cleanCategory(updatedCat);
    supabase.from('categories').upsert([cleaned]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase Category Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  const deleteCategory = (id) => {
    lastLocalEditRef.current = Date.now();
    const targetId = String(id);
    const updated = categories.filter(c => String(c.id) !== targetId);
    setCategories(updated);
    broadcastSync('rk_cms_categories', updated);

    supabase.from('categories').delete().eq('id', targetId).then(({ error }) => {
      if (error) console.error('[DataContext] Background deleteCategory error:', error);
    }).catch(() => {});
  };

  // --- ABOUT US CRUD (0ms Instant Local Update + Async Background Database Upsert) ---
  const updateAbout = (newAboutData) => {
    lastLocalEditRef.current = Date.now();
    setAboutData(newAboutData);
    broadcastSync('rk_cms_about', newAboutData);

    supabase.from('site_settings').upsert([{ key: 'about_section', value: newAboutData }]).then(({ error }) => {
      if (error && typeof window !== 'undefined') {
        alert('Supabase About Error:\n' + (error.message || error.hint || JSON.stringify(error)));
      }
    }).catch(() => {});
  };

  // --- ORDERS CRUD ---
  const addOrder = async (orderData) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customerName: orderData.customerName || 'Customer',
      phone: orderData.phone || '',
      email: orderData.email || '',
      address: orderData.address || '',
      productName: orderData.productName || 'Machinery',
      productCode: orderData.productCode || '',
      productId: orderData.productId || '',
      productImage: orderData.productImage || '',
      priceFormatted: orderData.priceFormatted || '',
      quantity: orderData.quantity || '1',
      unit: orderData.unit || 'Piece / Pieces',
      totalAmount: orderData.totalAmount || orderData.priceFormatted || '',
      notes: orderData.notes || '',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'New Order',
      createdAt: Date.now()
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveStorage('rk_cms_orders', updated);

    try {
      const { error } = await supabase.from('orders').upsert([newOrder]);
      if (error) console.error('Supabase addOrder Error:', error);
    } catch (err) {}

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const updated = orders.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o);
    setOrders(updated);
    saveStorage('rk_cms_orders', updated);

    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', String(orderId));
      if (error) console.error('Supabase updateOrderStatus Error:', error);
    } catch (err) {}
  };

  const deleteOrder = async (orderId) => {
    const targetId = String(orderId);
    const updated = orders.filter(o => String(o.id) !== targetId);
    setOrders(updated);
    saveStorage('rk_cms_orders', updated);

    if (typeof window !== 'undefined') {
      try {
        const deleted = JSON.parse(localStorage.getItem('rk_deleted_orders') || '[]');
        if (!deleted.includes(targetId)) {
          deleted.push(targetId);
          localStorage.setItem('rk_deleted_orders', JSON.stringify(deleted));
        }
      } catch (e) {}
    }

    try {
      const { error } = await supabase.from('orders').delete().eq('id', targetId);
      if (error) console.error('Supabase deleteOrder Error:', error);
    } catch (err) {}
  };

  return (
    <DataContext.Provider value={{
      products,
      categories,
      slides,
      blogs,
      aboutData,
      orders,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addSlide,
      updateSlide,
      deleteSlide,
      addBlog,
      updateBlog,
      deleteBlog,
      updateAbout,
      addOrder,
      updateOrderStatus,
      deleteOrder
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
