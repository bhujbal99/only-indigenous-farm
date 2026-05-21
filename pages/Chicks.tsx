
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, X, Save, Layers } from 'lucide-react';
import { translations } from '../translations';
import { Chick, Breed, HealthStatus, Language } from '../types';
import { calculateAge, generateId } from '../utils';

interface ChicksProps {
  chicks: Chick[];
  setChicks: (chicks: Chick[]) => void;
  lang: Language;
}

const Chicks: React.FC<ChicksProps> = ({ chicks, setChicks, lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChick, setEditingChick] = useState<Chick | null>(null);

  const [formData, setFormData] = useState<Omit<Chick, 'id'>>({
    breed: Breed.Gavaran,
    hatchDate: new Date().toISOString().split('T')[0],
    quantity: 10,
    healthStatus: HealthStatus.Healthy,
    notes: ''
  });

  const filteredChicks = chicks.filter(c => 
    c.breed.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingChick) {
      setChicks(chicks.map(c => c.id === editingChick.id ? { ...formData, id: c.id } : c));
    } else {
      setChicks([...chicks, { ...formData, id: generateId() }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChick(null);
    setFormData({
      breed: Breed.Gavaran,
      hatchDate: new Date().toISOString().split('T')[0],
      quantity: 10,
      healthStatus: HealthStatus.Healthy,
      notes: ''
    });
  };

  const handleEdit = (chick: Chick) => {
    setEditingChick(chick);
    setFormData({ ...chick });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setChicks(chicks.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search chick batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          {t.add} {t.chicks}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChicks.length > 0 ? filteredChicks.map((chick) => (
          <div key={chick.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] flex items-center justify-center transition-transform group-hover:scale-110">
              <Layers className="text-blue-300 ml-4 mb-4" size={32} />
            </div>
            
            <div className="mb-4">
              <span className="text-xs font-mono text-gray-400">BATCH #{chick.id}</span>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {chick.breed}
                <span className="text-sm font-normal text-gray-500">({chick.quantity} pcs)</span>
              </h3>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.age}</span>
                <span className="font-semibold text-gray-800">{calculateAge(chick.hatchDate, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.status}</span>
                <span className={`font-bold ${
                  chick.healthStatus === HealthStatus.Healthy ? 'text-emerald-600' : 'text-red-600'
                }`}>{chick.healthStatus}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(chick)} className="flex-1 py-2 bg-gray-50 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-bold text-sm">
                <Edit3 size={16} /> {t.edit}
              </button>
              <button onClick={() => handleDelete(chick.id)} className="px-4 py-2 bg-gray-50 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center font-bold">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
             <Layers className="mx-auto text-gray-300 mb-4" size={48} />
             <p className="text-gray-400">No chick batches found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingChick ? t.edit : t.add} {t.chicks}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.breed}</label>
                  <select
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value as Breed })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(Breed).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.quantity}</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.hatchDate}</label>
                <input
                  type="date"
                  value={formData.hatchDate}
                  onChange={(e) => setFormData({ ...formData, hatchDate: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.status}</label>
                <div className="flex gap-2">
                  {Object.values(HealthStatus).map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, healthStatus: s })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                        formData.healthStatus === s 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'border-gray-100 bg-gray-50 text-gray-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.notes}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
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

export default Chicks;
