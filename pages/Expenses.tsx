
import React, { useState } from 'react';
import { Plus, Trash2, X, Save, Wheat, Tag } from 'lucide-react';
import { translations } from '../translations';
import { Expense, Language } from '../types';
import { generateId, formatCurrency } from '../utils';

interface ExpensesProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  lang: Language;
}

const ExpensesPage: React.FC<ExpensesProps> = ({ expenses, setExpenses, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'Feed',
    quantity: '',
    cost: 0
  });

  const handleSave = () => {
    setExpenses([{ ...formData, id: generateId() }, ...expenses]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Feed',
      quantity: '',
      cost: 0
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wheat className="text-blue-500" />
            {t.expenses}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Total Lifetime Spend: <span className="font-bold text-gray-700">{formatCurrency(totalExpense, lang)}</span></p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t.add} Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {expenses.length > 0 ? expenses.map((exp) => (
          <div key={exp.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Tag size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800">{exp.type}</p>
                <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()} • {exp.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold text-blue-600">{formatCurrency(exp.cost, lang)}</span>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400">No expense logs found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">New Expense Entry</h3>
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
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.feedType} / Category</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Starter Feed, Waterers, Electricity"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.quantity}</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 50kg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.cost} ({t.currency})</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                {t.cancel}
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
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

export default ExpensesPage;
