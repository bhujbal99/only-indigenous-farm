
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, X, Save, Bird } from 'lucide-react';
import { RoasterIcon } from '../App';
import { translations } from '../translations';
import { Rooster, Breed, HealthStatus, Language } from '../types';
import { calculateAge, generateId } from '../utils';

interface Props {
  roosters: Rooster[];
  language: Language;
  updateRoosters: (roosters: Rooster[]) => void;
}

const RoosterManagement: React.FC<Props> = ({ roosters, language, updateRoosters }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRooster, setEditingRooster] = useState<Rooster | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Rooster, 'addedAt'>>({
  id: '',
  breed: Breed.Gavaran,
  hatchDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  weight: 0,
    healthStatus: HealthStatus.Healthy,
    notes: ''
  });

  const filteredRoosters = roosters.filter(r => 
    r.breed.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    let finalId = formData.id.trim();
    if (!finalId) {
      const lastNum = roosters.length > 0 
        ? parseInt(roosters[roosters.length - 1].id.split('-')[1]) || 1000 
        : 1000;
      finalId = `ROO-${lastNum + 1}`;
    }

    if (editingRooster) {
      updateRoosters(roosters.map(r => r.id === editingRooster.id ? { ...formData, id: finalId, addedAt: r.addedAt } : r));
    } else {
      updateRoosters([...roosters, { ...formData, id: finalId, addedAt: Date.now() }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRooster(null);
    setFormData({
  id: '',
  breed: Breed.Gavaran,
  hatchDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  weight: 0,
  healthStatus: HealthStatus.Healthy,
  notes: ''
});
  };

  const handleEdit = (rooster: Rooster) => {
    setEditingRooster(rooster);
    setFormData({ ...rooster });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      updateRoosters(roosters.filter(r => r.id !== id));
    }
  };

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.Healthy: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case HealthStatus.Sick: return 'bg-red-100 text-red-700 border-red-200';
      case HealthStatus.Injured: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search roosters..."
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
          {t.add} {t.roosters}
        </button>
      </div>

      {filteredRoosters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoosters.map((rooster) => (
            <div key={rooster.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                    <RoasterIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{rooster.breed}</h3>
                    <p className="text-xs text-gray-400 font-mono">ID: {rooster.id}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(rooster.healthStatus)}`}>
                  {rooster.healthStatus.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{t.age}</p>
                  <p className="font-semibold text-gray-700">{calculateAge(rooster.hatchDate, language)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{t.weight}</p>
                  <p className="font-semibold text-gray-700">{rooster.weight} kg</p>
                </div>
                {rooster.notes && (
                  <div className="col-span-2 pt-2 border-t border-gray-50">
                    <p className="text-gray-400 text-xs mb-1">{t.notes}</p>
                    <p className="text-gray-600 text-xs line-clamp-2 italic">{rooster.notes}</p>
                  </div>
                )}

                <div>
  <p className="text-gray-400 text-xs mb-1">Quantity</p>
  <p className="font-semibold text-emerald-700">
    {rooster.quantity}
  </p>
</div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleEdit(rooster)} 
                  className="flex-1 py-2 bg-gray-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <Edit3 size={16} /> {t.edit}
                </button>
                <button 
                  onClick={() => handleDelete(rooster.id)} 
                  className="px-4 py-2 bg-gray-50 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center font-bold"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
           <Bird className="mx-auto text-gray-300 mb-4" size={48} />
           <p className="text-gray-500 font-medium">{t.noRoosterRecords}</p>
           <button 
             onClick={() => setShowModal(true)}
             className="mt-4 text-emerald-600 font-bold hover:underline"
           >
             {t.add} {t.roosters}
           </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingRooster ? t.edit : t.add} {t.roosters}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. ROO-1001"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-semibold text-gray-600">{t.weight}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
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
                  {[HealthStatus.Healthy, HealthStatus.Sick, HealthStatus.Injured].map(s => (
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
                  placeholder="Notes..."
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

export default RoosterManagement;
