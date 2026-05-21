
import React, { useState } from 'react';
import { Plus, Trash2, X, Save, Egg } from 'lucide-react';
import { translations } from '../translations';
import { EggProduction, Language } from '../types';
import { generateId } from '../utils';

interface EggProductionProps {
  eggs: EggProduction[];
  setEggs: (eggs: EggProduction[]) => void;
  lang: Language;
}

const EggProductionPage: React.FC<EggProductionProps> = ({ eggs, setEggs, lang }) => {
  const t = translations[lang];
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<Omit<EggProduction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    collected: 0,
    damaged: 0,
    notes: ''
  });

  const handleSave = () => {
    setEggs([{ ...formData, id: generateId() }, ...eggs]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      collected: 0,
      damaged: 0,
      notes: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setEggs(eggs.filter(e => e.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Egg className="text-amber-500" />
          {t.eggProduction}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          {t.add} Log
        </button>
      </div>

      <div className="space-y-4">
        {eggs.length > 0 ? eggs.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <Egg className="text-amber-600" size={32} />
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.date}</p>
                <p className="font-semibold text-gray-800">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.collected}</p>
                <p className="text-lg font-bold text-emerald-600">{entry.collected}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.damaged}</p>
                <p className="text-lg font-bold text-red-600">{entry.damaged}</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Net</p>
                <p className="text-lg font-bold text-gray-800">{entry.collected - entry.damaged}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(entry.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400">No egg records yet. Start recording today's harvest!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Log Egg Production</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.date}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.collected}</label>
                  <input
                    type="number"
                    value={formData.collected}
                    onChange={(e) => setFormData({ ...formData, collected: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.damaged}</label>
                  <input
                    type="number"
                    value={formData.damaged}
                    onChange={(e) => setFormData({ ...formData, damaged: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.notes}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 h-24 resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                {t.cancel}
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
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

export default EggProductionPage;
