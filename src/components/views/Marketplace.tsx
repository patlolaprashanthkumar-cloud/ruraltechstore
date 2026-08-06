import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, Star, Tag, Package, Plus, Minus, Trash2, X, Store, TrendingUp, ShoppingBag, Check, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  image: string;
  badge?: string;
  inStock: boolean;
  description: string;
  tags: string[];
}

interface CartItem extends Product { qty: number; }

const PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Wheat Seeds (5kg)', category: 'Agriculture', price: 450, originalPrice: 600, rating: 4.5, reviews: 128, seller: 'Kisan Bazaar', location: 'Punjab', image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Best Seller', inStock: true, description: 'High-yield certified organic wheat seeds suitable for Rabi season. Resistant to rust and powdery mildew.', tags: ['organic', 'seeds', 'wheat'] },
  { id: '2', name: 'Solar LED Lantern', category: 'Energy', price: 1299, originalPrice: 1800, rating: 4.8, reviews: 342, seller: 'GreenLight India', location: 'Gujarat', image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400', badge: '28% Off', inStock: true, description: '8-hour backup solar lantern with USB charging port. Perfect for areas with irregular electricity.', tags: ['solar', 'energy', 'lantern'] },
  { id: '3', name: 'Handloom Silk Saree', category: 'Textiles', price: 2800, rating: 4.6, reviews: 89, seller: 'Weavers Guild', location: 'Varanasi', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, description: 'Pure silk handloom saree with intricate zari work. Directly sourced from master weavers.', tags: ['silk', 'handloom', 'saree'] },
  { id: '4', name: 'Drip Irrigation Kit (1 acre)', category: 'Agriculture', price: 3500, originalPrice: 4200, rating: 4.7, reviews: 215, seller: 'AgroTech Solutions', location: 'Maharashtra', image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'New', inStock: true, description: 'Complete drip irrigation setup for 1 acre. Includes pipes, drippers, filters and installation guide.', tags: ['irrigation', 'farming', 'water'] },
  { id: '5', name: 'Organic Honey (500g)', category: 'Food', price: 380, originalPrice: 450, rating: 4.9, reviews: 567, seller: 'Honey Hills', location: 'Uttarakhand', image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Top Rated', inStock: true, description: '100% pure wildflower honey from the Himalayan foothills. No additives, no preservatives.', tags: ['honey', 'organic', 'food'] },
  { id: '6', name: 'POS Machine (Portable)', category: 'Business', price: 4999, originalPrice: 6500, rating: 4.4, reviews: 93, seller: 'FinTech Hub', location: 'Delhi', image: 'https://images.pexels.com/photos/4968384/pexels-photo-4968384.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'GST Invoice', inStock: true, description: 'Portable 4G-enabled POS machine supporting all UPI, cards and wallets. 12-month warranty.', tags: ['pos', 'payment', 'business'] },
  { id: '7', name: 'Bamboo Craft Set', category: 'Handicraft', price: 750, rating: 4.3, reviews: 44, seller: 'Tribal Crafts', location: 'Assam', image: 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: false, description: 'Handcrafted bamboo decorative items set including vases, trays and wall decor pieces.', tags: ['bamboo', 'craft', 'handmade'] },
  { id: '8', name: 'Medicinal Herb Kit', category: 'Healthcare', price: 595, originalPrice: 750, rating: 4.6, reviews: 178, seller: 'Ayur Farms', location: 'Kerala', image: 'https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Ayurvedic', inStock: true, description: 'Starter kit with 10 medicinal herb plants (Tulsi, Neem, Ashwagandha, etc.) in biodegradable pots.', tags: ['herbs', 'ayurvedic', 'plants'] },
];

const CATEGORIES = ['All', 'Agriculture', 'Energy', 'Textiles', 'Food', 'Business', 'Healthcare', 'Handicraft'];

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOndc, setShowOndc] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())))
  );

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      return ex ? prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => { setShowCart(false); setOrderPlaced(false); }, 3000);
  };

  const inCart = (id: string) => cart.some(c => c.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">E-Commerce Marketplace</h2>
          <p className="text-gray-500 text-sm mt-0.5">Discover rural products directly from local sellers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowOndc(true)} className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
            <Store className="w-4 h-4" /> Sell on ONDC
          </button>
          <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors">
            <ShoppingCart className="w-4 h-4" /> Cart
            {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: PRODUCTS.length, icon: Package, color: 'blue' },
          { label: 'Categories', value: CATEGORIES.length - 1, icon: Filter, color: 'teal' },
          { label: 'Avg Rating', value: '4.6', icon: Star, color: 'amber' },
          { label: 'Sellers', value: '12+', icon: Store, color: 'green' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 flex items-center gap-3`}>
              <Icon className={`w-7 h-7 text-${s.color}-500`} />
              <div>
                <p className={`text-xl font-bold text-${s.color}-900`}>{s.value}</p>
                <p className={`text-xs text-${s.color}-600 font-medium`}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${category === cat ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="relative">
              <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              {p.badge && <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{p.badge}</span>}
              {!p.inStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-gray-700 text-sm font-bold px-3 py-1 rounded-full">Out of Stock</span></div>}
            </div>
            <div className="p-3 space-y-2">
              <div>
                <span className="text-xs text-orange-600 font-medium">{p.category}</span>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight mt-0.5 line-clamp-2">{p.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews})</span>
              </div>
              <div className="text-xs text-gray-500">{p.seller} · {p.location}</div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-base font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
                  {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-1.5">₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelected(p)} className="p-1.5 text-gray-400 hover:text-orange-500 border border-gray-200 rounded-lg transition-colors">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button disabled={!p.inStock} onClick={() => addToCart(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!p.inStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : inCart(p.id) ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                    {inCart(p.id) ? <Check className="w-3.5 h-3.5" /> : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShoppingBag className="w-14 h-14 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <img src={selected.image} alt={selected.name} className="w-full h-52 object-cover" />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-orange-600 font-medium">{selected.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <p className="text-sm text-gray-600">{selected.description}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{selected.rating} ({selected.reviews} reviews)</span>
                <span>{selected.seller} · {selected.location}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{t}</span>)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{selected.price.toLocaleString('en-IN')}</span>
                  {selected.originalPrice && <span className="text-sm text-gray-400 line-through ml-2">₹{selected.originalPrice.toLocaleString('en-IN')}</span>}
                </div>
                <button disabled={!selected.inStock} onClick={() => { addToCart(selected); setSelected(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${!selected.inStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                  <ShoppingCart className="w-4 h-4" /> {selected.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-orange-500" /> Shopping Cart</h3>
              <button onClick={() => setShowCart(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Order Placed!</h4>
                <p className="text-gray-500 text-sm">Your order has been placed successfully. You'll receive a confirmation shortly.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                <ShoppingCart className="w-14 h-14 text-gray-200" />
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <button onClick={() => setShowCart(false)} className="text-orange-600 font-semibold text-sm hover:underline">Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors self-start"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 p-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span><span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={placeOrder} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Place Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ONDC Seller Modal */}
      {showOndc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white text-center">
              <Store className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-xl font-bold">Sell on ONDC Network</h3>
              <p className="text-blue-200 text-sm mt-1">Open Network for Digital Commerce</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                {['Register as a seller on India\'s open e-commerce network', 'Zero platform fees for first 6 months', 'Access to millions of buyers across India', 'GST billing & logistics support included', 'Training & onboarding support provided'].map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-green-600" /></div>
                    <p className="text-sm text-gray-700">{b}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setShowOndc(false)} className="py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Maybe Later</button>
                <button onClick={() => setShowOndc(false)} className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
