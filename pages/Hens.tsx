
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, X, Save, AlertCircle } from 'lucide-react';
import { translations } from '../translations';
import { Hen, Breed, HealthStatus, Language } from '../types';
import { calculateAge, generateId } from '../utils';

interface HensProps {
  hens: Hen[];
  setHens: (hens: Hen[]) => void;
  lang: Language;
}

const Hens: React.FC<HensProps> = ({ hens, setHens, lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHen, setEditingHen] = useState<Hen | null>(null);

  // Form State
 const [formData, setFormData] = useState<Omit<Hen, 'id'>>({
  breed: Breed.Gavaran,
  hatchDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  healthStatus: HealthStatus.Healthy,
  notes: ''
});

  const filteredHens = hens.filter(h => 
    h.breed.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingHen) {
      setHens(hens.map(h => h.id === editingHen.id ? { ...formData, id: h.id } : h));
    } else {
      setHens([...hens, { ...formData, id: generateId() }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHen(null);
   setFormData({
  breed: Breed.Gavaran,
  hatchDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  healthStatus: HealthStatus.Healthy,
  notes: ''
});
  };

  const handleEdit = (hen: Hen) => {
    setEditingHen(hen);
    setFormData({ ...hen });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setHens(hens.filter(h => h.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search hens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          {t.add} {t.hens}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">{t.breed}</th>
                <th className="px-6 py-4">{t.age}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHens.length > 0 ? filteredHens.map((hen) => (
                <tr key={hen.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{hen.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{hen.breed}</td>
                  <td className="px-6 py-4 text-gray-600">{calculateAge(hen.hatchDate, lang)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      hen.healthStatus === HealthStatus.Healthy ? 'bg-emerald-100 text-emerald-700' :
                      hen.healthStatus === HealthStatus.Sick ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t[hen.healthStatus.toLowerCase()] || hen.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700">
  {hen.quantity}
</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(hen)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(hen.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No hens found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingHen ? t.edit : t.add} {t.hens}
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.values(Breed).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.hatchDate}</label>
                  <input
                    type="date"
                    value={formData.hatchDate}
                    onChange={(e) => setFormData({ ...formData, hatchDate: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
  <label className="text-sm font-semibold text-gray-600">
    Quantity
  </label>

  <input
    type="number"
    min="1"
    value={formData.quantity}
    onChange={(e) =>
      setFormData({
        ...formData,
        quantity: Number(e.target.value)
      })
    }
    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
  />
</div>
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
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
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
                  placeholder="Any extra info..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
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

export default Hens;
