
import React, { useState } from 'react';
import { Plus, Trash2, X, Save, IndianRupee, User } from 'lucide-react';
import { translations } from '../translations';
import { Sale, Language } from '../types';
import { generateId, formatCurrency } from '../utils';

interface SalesProps {
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  lang: Language;
}

const SalesPage: React.FC<SalesProps> = ({ sales, setSales, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<Sale, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    product: 'Eggs',
    quantity: 1,
    amount: 0,
    customerName: ''
  });

  const handleSave = () => {
    setSales([{ ...formData, id: generateId() }, ...sales]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: 'Eggs',
      quantity: 1,
      amount: 0,
      customerName: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <IndianRupee className="text-emerald-500" />
            {t.sales}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Lifetime Revenue: <span className="font-bold text-emerald-700">{formatCurrency(totalSales, lang)}</span></p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t.add} Sale
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b">
                <th className="px-6 py-4">{t.date}</th>
                <th className="px-6 py-4">{t.product}</th>
                <th className="px-6 py-4">{t.quantity}</th>
                <th className="px-6 py-4">{t.customer}</th>
                <th className="px-6 py-4">{t.amount}</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length > 0 ? sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      sale.product === 'Eggs' ? 'bg-amber-100 text-amber-700' :
                      sale.product === 'Birds' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sale.product}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{sale.quantity}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-800 font-medium">{sale.customerName || 'Walk-in'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">{formatCurrency(sale.amount, lang)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(sale.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No sales recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">New Sale Entry</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.date}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.product}</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value as any })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Eggs">Eggs</option>
                    <option value="Birds">Birds</option>
                    <option value="Chicks">Chicks</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.quantity}</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.customer}</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Customer name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.amount} ({t.currency})</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                {t.cancel}
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <Save size={18} />
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
