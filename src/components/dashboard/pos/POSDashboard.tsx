import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, ScanBarcode, Edit, ShoppingCart, Trash2, ShoppingBasket, Tag, 
  Banknote, CreditCard, QrCode, Split, Eye, Clock, Zap, CheckCircle2, X, 
  Printer, Mail, MessageSquare, Minus, Barcode, Bell, Receipt
} from 'lucide-react';
import Sidebar from '../Sidebar';

const productsData = [
  {id:1, name:'Paracetamol 500mg', brand:'Calpol', cat:'Tablet', price:32.50, stock:240, unit:'Strip of 10', barcode:'8901030887543', exp:'06/2026'},
  {id:2, name:'Azithromycin 500mg', brand:'Azee', cat:'Tablet', price:128.00, stock:64, unit:'Strip of 6', barcode:'8901030887544', exp:'09/2025'},
  {id:3, name:'Cough Syrup 100ml', brand:'Benadryl', cat:'Syrup', price:115.00, stock:38, unit:'Bottle', barcode:'8901030887545', exp:'12/2025'},
  {id:4, name:'Insulin Glargine', brand:'Lantus', cat:'Injection', price:1450.00, stock:12, unit:'Vial 10ml', barcode:'8901030887546', exp:'03/2026'},
  {id:5, name:'Diclofenac Gel', brand:'Volini', cat:'Ointment', price:165.00, stock:54, unit:'Tube 30g', barcode:'8901030887547', exp:'11/2026'},
  {id:6, name:'Digital Thermometer', brand:'Omron', cat:'Device', price:299.00, stock:22, unit:'1 Piece', barcode:'8901030887548', exp:'-'},
  {id:7, name:'Vitamin D3 60K', brand:'Uprise', cat:'Supplement', price:78.00, stock:120, unit:'Strip of 4', barcode:'8901030887549', exp:'08/2026'},
  {id:8, name:'Cetirizine 10mg', brand:'Cetzine', cat:'Tablet', price:28.00, stock:300, unit:'Strip of 10', barcode:'8901030887550', exp:'05/2026'},
  {id:9, name:'ORS Powder', brand:'Electral', cat:'Supplement', price:22.00, stock:180, unit:'Sachet', barcode:'8901030887551', exp:'02/2026'},
  {id:10, name:'BP Monitor', brand:'Omron HEM', cat:'Device', price:2199.00, stock:8, unit:'1 Piece', barcode:'8901030887552', exp:'-'},
  {id:11, name:'Amoxicillin 250mg', brand:'Mox', cat:'Tablet', price:64.00, stock:140, unit:'Strip of 10', barcode:'8901030887553', exp:'07/2025'},
  {id:12, name:'Cough Lozenges', brand:'Strepsils', cat:'Tablet', price:42.00, stock:95, unit:'Pack of 8', barcode:'8901030887554', exp:'10/2026'},
];

const catIcon: Record<string, string> = {Tablet:'💊',Syrup:'🧴',Injection:'💉',Ointment:'🧪',Device:'🩺',Supplement:'🌿'};

type CartItem = typeof productsData[0] & { qty: number };

export default function POSDashboard({ setView }: { setView: (view: 'dashboard' | 'medicine' | 'inventory' | 'pos') => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [discountPct, setDiscountPct] = useState(5);
  const [couponCode, setCouponCode] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');

  const [showScanner, setShowScanner] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  useEffect(() => {
    let t: any;
    if (toastMsg) {
      t = setTimeout(() => setToastMsg(''), 2200);
    }
    return () => clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        checkout();
      }
      if (e.key === 'Escape') {
        setShowScanner(false);
        setShowReceipt(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, discountPct, payMethod]);

  const filteredProducts = productsData.filter(p => 
    (activeCat === 'all' || p.cat === activeCat) &&
    (p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))
  );

  const addToCart = (id: number) => {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...p, qty: 1 }];
    });
    setToastMsg(`Added ${p.name}`);
  };

  const changeQty = (id: number, d: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id === id) {
          return { ...c, qty: c.qty + d };
        }
        return c;
      }).filter(c => c.qty > 0);
    });
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setToastMsg('Cart cleared');
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setToastMsg('Enter a coupon code'); return; }
    if (code === 'HEALTH10') { setDiscountPct(10); setToastMsg('Coupon HEALTH10 applied · 10% off'); }
    else if (code === 'SAVE20') { setDiscountPct(20); setToastMsg('Coupon SAVE20 applied · 20% off'); }
    else setToastMsg('Invalid coupon code');
  };

  const handleManualScan = () => {
    const code = manualBarcode.trim();
    const p = productsData.find(x => x.barcode === code) || productsData[Math.floor(Math.random()*productsData.length)];
    addToCart(p.id);
    setManualBarcode('');
    setShowScanner(false);
  };

  const checkout = () => {
    if (cart.length === 0) { setToastMsg('Cart is empty'); return; }
    setShowReceipt(true);
    setToastMsg('Payment successful · Invoice generated ✓');
    setTimeout(() => {
      setCart([]);
    }, 800);
  };

  const holdBill = () => {
    if (cart.length === 0) { setToastMsg('Nothing to hold'); return; }
    setToastMsg(`Bill held · Token #${Math.floor(Math.random()*999)}`);
    setCart([]);
  };

  // Calculations
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = sub * discountPct / 100;
  const taxable = sub - disc;
  const cgst = taxable * 0.06;
  const sgst = taxable * 0.06;
  const gross = taxable + cgst + sgst;
  const rounded = Math.round(gross);
  const roundDiff = rounded - gross;
  
  const invNo = 'INV-' + Date.now().toString().slice(-8);

  return (
    <div className="flex bg-[#f2f5f9] font-sans text-slate-800">
      <style>{`
        .scan-pulse { animation: scan 1.6s ease-in-out infinite; }
        @keyframes scan { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,160,107,.5); } 50% { box-shadow: 0 0 0 8px rgba(34,160,107,0); } }
        .product-card { transition: all .15s ease; }
        .product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -8px rgba(16,24,40,.18); }
        .cat-chip.active { background: #22a06b; color: #fff; border-color: #22a06b; }
        .pay-btn { display: flex; flex-direction: column; items-center; gap: 4px; padding: 10px 4px; border-radius: 10px; background: #fff; border: 1px solid #e2e8f0; font-size: 11px; font-weight: 600; color: #4a5b6f; transition: all .15s; cursor: pointer; }
        .pay-btn:hover { border-color: #22a06b; color: #136645; }
        .pay-btn.active { background: #22a06b; color: #fff; border-color: #22a06b; box-shadow: 0 4px 10px -4px rgba(34,160,107,.6); }
        .receipt-font { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        .dash-border { border-top: 1px dashed #94a3b8; }
        .scroll-hide::-webkit-scrollbar { width: 6px; height: 6px; }
        .scroll-hide::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
      `}</style>
      
      <Sidebar currentView="pos" setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:h-screen lg:overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22a06b] text-white grid place-items-center font-bold text-lg shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">MediPOS</div>
              <div className="text-xs text-slate-500 -mt-0.5">Apollo Pharmacy · Main Branch</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 bg-[#eef9f5] text-[#136645] rounded-lg font-medium">
              <span className="w-2 h-2 rounded-full bg-[#22a06b] scan-pulse"></span> Online
            </div>
            <button className="relative w-10 h-10 grid place-items-center rounded-lg hover:bg-slate-100 transition">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/40?img=12" className="w-full h-full object-cover" alt="User" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold leading-tight text-slate-800">Dr. R. Mehta</div>
                <div className="text-xs text-slate-500">Cashier · #4521</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-4 p-4 lg:p-5 lg:overflow-hidden">
          
          {/* Left Panel */}
          <section className="flex flex-col gap-4 lg:overflow-hidden min-h-[400px] lg:min-h-0 lg:h-full shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Search by medicine, salt or brand..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#22a06b] text-sm font-medium transition"
                  />
                </div>
                <button onClick={() => setShowScanner(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition">
                  <ScanBarcode className="w-5 h-5" /> Scan
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#eef9f5] text-[#136645] rounded-xl font-medium text-sm hover:bg-[#d6f1e6] transition">
                  <Plus className="w-5 h-5" /> New
                </button>
              </div>
              
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scroll-hide">
                {['all', 'Tablet', 'Syrup', 'Injection', 'Ointment', 'Device', 'Supplement'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCat(cat)}
                    className={`cat-chip flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${activeCat === cat ? 'active' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat === 'all' ? 'All Items' : `${catIcon[cat] || ''} ${cat}s`}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-800">Products</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{filteredProducts.length} items</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scroll-hide pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => addToCart(p.id)} className="product-card cursor-pointer bg-white border border-slate-200 rounded-xl p-3 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 grid place-items-center bg-[#eef9f5] rounded-lg text-xl">{catIcon[p.cat] || '💊'}</div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.stock < 20 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                          {p.stock} left
                        </span>
                      </div>
                      <div className="font-semibold text-sm leading-tight line-clamp-2 text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 mb-2">{p.brand} · {p.unit}</div>
                      <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100">
                        <div className="font-bold text-[#136645]">₹{p.price.toFixed(2)}</div>
                        <button className="w-7 h-7 bg-[#22a06b] text-white rounded-lg grid place-items-center hover:bg-[#168155]">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel - Cart */}
          <aside className="bg-white rounded-2xl shadow-sm flex flex-col lg:h-full lg:overflow-hidden shrink-0 min-h-[500px]">
            <div className="p-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</div>
                <span className="text-xs text-[#22a06b] font-medium cursor-pointer hover:underline">+ Change</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4cb88b] to-[#168155] grid place-items-center text-white font-semibold">RS</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate text-slate-800">Rajesh Sharma</div>
                  <div className="text-xs text-slate-500 truncate">+91 98765 43210 · ⭐ 1,240 pts</div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 p-2"><Edit className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#22a06b]" />
                <h2 className="font-semibold text-slate-800">Current Bill</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef9f5] text-[#136645] font-semibold">{cart.reduce((s,c)=>s+c.qty,0)} items</span>
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/30 scroll-hide">
              {cart.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <ShoppingBasket className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="font-semibold text-slate-700">Cart is empty</div>
                  <div className="text-xs text-slate-500 mt-1">Scan or click a product to begin</div>
                </div>
              ) : (
                cart.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-[#aee3cd] transition-colors">
                    <div className="w-10 h-10 grid place-items-center bg-[#eef9f5] rounded-lg text-xl shrink-0">{catIcon[c.cat] || '💊'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate text-slate-800">{c.name}</div>
                      <div className="text-xs text-slate-500">₹{c.price.toFixed(2)} × {c.qty}</div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
                      <button onClick={() => changeQty(c.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-700 hover:bg-slate-200 shadow-sm transition-transform active:scale-90"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-6 text-center text-sm font-semibold">{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-700 hover:bg-slate-200 shadow-sm transition-transform active:scale-90"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-bold text-sm text-slate-800">₹{(c.price * c.qty).toFixed(2)}</div>
                      <button onClick={() => removeItem(c.id)} className="text-red-400 hover:text-red-600 text-xs mt-0.5">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code" 
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#22a06b]"
                  />
                </div>
                <button onClick={handleApplyCoupon} className="px-4 py-2 text-sm font-semibold bg-[#eef9f5] border border-[#aee3cd] text-[#136645] rounded-lg hover:bg-[#d6f1e6] transition">Apply</button>
              </div>
              
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{sub.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Discount ({discountPct}%)</span><span className="text-red-500">−₹{disc.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax (12%)</span><span>₹{(cgst + sgst).toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-dashed border-slate-300"><span>Round off</span><span>{(roundDiff >= 0 ? '+' : '−')}₹{Math.abs(roundDiff).toFixed(2)}</span></div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-semibold text-slate-800">Total Payable</span>
                  <span className="text-2xl font-bold text-[#168155]">₹{rounded.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setPayMethod('Cash')} className={`pay-btn ${payMethod === 'Cash' ? 'active' : ''}`}><Banknote className="w-5 h-5 mb-1" /><span>Cash</span></button>
                  <button onClick={() => setPayMethod('Card')} className={`pay-btn ${payMethod === 'Card' ? 'active' : ''}`}><CreditCard className="w-5 h-5 mb-1" /><span>Card</span></button>
                  <button onClick={() => setPayMethod('UPI')} className={`pay-btn ${payMethod === 'UPI' ? 'active' : ''}`}><QrCode className="w-5 h-5 mb-1" /><span>UPI</span></button>
                  <button onClick={() => setPayMethod('Split')} className={`pay-btn ${payMethod === 'Split' ? 'active' : ''}`}><Split className="w-5 h-5 mb-1" /><span>Split</span></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button onClick={checkout} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button onClick={holdBill} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition">
                  <Clock className="w-4 h-4" /> Hold
                </button>
              </div>
              
              <button 
                onClick={checkout} 
                className="w-full mt-3 py-3.5 bg-gradient-to-r from-[#22a06b] to-[#168155] hover:from-[#168155] hover:to-[#136645] text-white rounded-xl font-bold text-base shadow-[0_8px_20px_-6px_rgba(34,160,107,0.5)] flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-5 h-5" /> Quick Checkout
                <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono font-medium">(F9)</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800"><ScanBarcode className="w-5 h-5 text-[#22a06b]" /> Barcode Scanner</h3>
              <button onClick={() => setShowScanner(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="relative bg-slate-900 rounded-xl aspect-video overflow-hidden grid place-items-center shadow-inner">
              <div className="absolute inset-6 border-2 border-[#22a06b]/40 rounded-lg"></div>
              <div className="absolute left-6 right-6 h-[1px] bg-red-500 shadow-[0_0_10px_2px_red] scan-pulse" style={{top:'50%'}}></div>
              <Barcode className="w-24 h-24 text-white/10" />
              <div className="absolute bottom-3 left-0 right-0 text-center text-white/50 text-xs">Align barcode within frame</div>
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Or enter manually</label>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="e.g. 890123456" 
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22a06b] font-mono text-sm shadow-sm"
                />
                <button onClick={handleManualScan} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition shadow-sm">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-slate-800"><Receipt className="w-5 h-5 text-[#22a06b]" /> Invoice Preview</h3>
              <button onClick={() => setShowReceipt(false)} className="p-1.5 rounded-lg hover:bg-slate-200 transition text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="receipt-font overflow-y-auto p-6 text-xs text-slate-800 bg-white">
              <div className="text-center mb-4">
                <div className="font-bold text-base tracking-widest text-[#136645]">APOLLO PHARMACY</div>
                <div className="text-slate-500 mt-1">Main Branch · MG Road, Bengaluru</div>
                <div className="text-slate-500">Tel: +91 80 1234 5678 · GSTIN: 29ABCDE1234F1Z5</div>
              </div>
              <div className="dash-border my-3 border-b border-slate-300 border-dashed"></div>
              <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                <div className="text-slate-500">Invoice:</div><div className="text-right font-medium">{invNo}</div>
                <div className="text-slate-500">Date:</div><div className="text-right">{new Date().toLocaleString('en-IN', { hour12: true })}</div>
                <div className="text-slate-500">Cashier:</div><div className="text-right">Dr. R. Mehta</div>
                <div className="text-slate-500">Customer:</div><div className="text-right">Rajesh Sharma</div>
              </div>
              <div className="dash-border my-3 border-b border-slate-300 border-dashed"></div>
              <div className="flex justify-between font-bold text-slate-900"><span>ITEM</span><span>AMT</span></div>
              <div className="dash-border my-2 border-b border-slate-300 border-dashed"></div>
              
              {cart.map(c => (
                <div key={c.id} className="mb-2">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="flex justify-between text-slate-600 mt-0.5">
                    <span>{c.qty} × ₹{c.price.toFixed(2)}</span>
                    <span>₹{(c.qty * c.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              <div className="dash-border my-3 border-b border-slate-300 border-dashed"></div>
              <div className="grid grid-cols-2 gap-y-1">
                <div className="text-slate-600">Subtotal</div><div className="text-right text-slate-900">₹{sub.toFixed(2)}</div>
                <div className="text-slate-600">Discount ({discountPct}%)</div><div className="text-right text-slate-900">−₹{disc.toFixed(2)}</div>
                <div className="text-slate-600">CGST 6%</div><div className="text-right text-slate-900">₹{cgst.toFixed(2)}</div>
                <div className="text-slate-600">SGST 6%</div><div className="text-right text-slate-900">₹{sgst.toFixed(2)}</div>
              </div>
              <div className="dash-border my-2 border-b border-slate-300 border-dashed"></div>
              <div className="flex justify-between font-bold text-sm text-slate-900 mt-2">
                <span>TOTAL</span><span>₹{rounded.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1 text-slate-500">
                <span>Paid via</span><span className="font-medium text-slate-700">{payMethod}</span>
              </div>
              <div className="dash-border mt-4 mb-3 border-b border-slate-300 border-dashed"></div>
              <div className="text-center text-slate-500">
                <div className="font-semibold text-slate-800">★ Thank you for visiting! ★</div>
                <div className="mt-1">Get well soon · Stay healthy</div>
                <div className="mt-4 flex justify-center">
                  <div className="px-3 py-1.5 border-2 border-slate-800 flex items-center justify-center w-full max-w-[200px]">
                    <Barcode className="w-full h-8" />
                  </div>
                </div>
                <div className="mt-1 text-[10px] tracking-widest font-bold">{invNo}</div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-100 transition shadow-sm text-slate-700">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-100 transition shadow-sm text-slate-700">
                <Mail className="w-4 h-4" /> Email
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-[#22a06b] text-white rounded-xl font-semibold text-sm hover:bg-[#168155] transition shadow-sm shadow-[#22a06b]/30">
                <MessageSquare className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 text-white px-5 py-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#4cb88b]" /> {toastMsg}
        </div>
      )}

    </div>
  );
}
