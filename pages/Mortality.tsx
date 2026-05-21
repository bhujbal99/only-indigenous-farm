
import React, { useState } from 'react';
import { Plus, Trash2, X, Save, Skull, AlertTriangle } from 'lucide-react';
import { translations } from '../translations';
import { Mortality, BirdType, Language } from '../types';
import { generateId, formatCurrency } from '../utils';

interface MortalityProps {
  mortalities: Mortality[];
  setMortalities: (mortalities: Mortality[]) => void;
  lang: Language;
}

const MortalityPage: React.FC<MortalityProps> = ({ mortalities, setMortalities, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<Mortality, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    birdId: '',
    type: BirdType.Hen,
    cause: '',
    lossValue: 0
  });

  const handleSave = () => {
    setMortalities([{ ...formData, id: generateId() }, ...mortalities]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      birdId: '',
      type: BirdType.Hen,
      cause: '',
      lossValue: 0
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setMortalities(mortalities.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Skull className="text-red-500" />
          {t.mortality}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          {t.add} Record
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b">
              <th className="px-6 py-4">{t.date}</th>
              <th className="px-6 py-4">ID / Type</th>
              <th className="px-6 py-4">{t.causeOfDeath}</th>
              <th className="px-6 py-4">{t.lossValue}</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mortalities.length > 0 ? mortalities.map((m) => (
              <tr key={m.id} className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 text-gray-600">{new Date(m.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{m.birdId}</p>
                  <p className="text-xs text-gray-400">{m.type}</p>
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500" />
                    {m.cause}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-red-600">{formatCurrency(m.lossValue, lang)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(m.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  No mortality records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">New Mortality Record</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as BirdType })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={BirdType.Hen}>Hen</option>
                    <option value={BirdType.Rooster}>Rooster</option>
                    <option value={BirdType.Chick}>Chick</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Bird ID / Batch ID</label>
                <input
                  type="text"
                  value={formData.birdId}
                  onChange={(e) => setFormData({ ...formData, birdId: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. HEN-001 or ROO-1001"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.causeOfDeath}</label>
                <input
                  type="text"
                  value={formData.cause}
                  onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. Heat stroke, Ranikhet"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.lossValue} ({t.currency})</label>
                <input
                  type="number"
                  value={formData.lossValue}
                  onChange={(e) => setFormData({ ...formData, lossValue: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                {t.cancel}
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
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

export default MortalityPage;
