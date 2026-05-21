
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, X, Save, Syringe, Calendar } from 'lucide-react';
import { translations } from '../translations';
import { Medicine, Language } from '../types';
import { generateId } from '../utils';

interface MedicineProps {
  medicines: Medicine[];
  setMedicines: (medicines: Medicine[]) => void;
  lang: Language;
}

const MedicinePage: React.FC<MedicineProps> = ({ medicines, setMedicines, lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    name: '',
    dosage: '',
    givenTo: '',
    nextDueDate: '',
    notes: ''
  });

  const filtered = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.givenTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingMedicine) {
      setMedicines(medicines.map(m => m.id === editingMedicine.id ? { ...formData, id: m.id } : m));
    } else {
      setMedicines([{ ...formData, id: generateId() }, ...medicines]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: '',
      dosage: '',
      givenTo: '',
      nextDueDate: '',
      notes: ''
    });
  };

  const handleEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({ ...med });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search medications..."
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
          {t.add} {t.medicine}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? filtered.map((med) => (
          <div key={med.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Syringe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{med.name}</h3>
                <p className="text-sm text-gray-500">{t.givenTo}: <span className="font-semibold">{med.givenTo}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-sm">
                <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">{t.dosage}</p>
                <p className="font-semibold text-gray-700">{med.dosage}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">{t.nextDue}</p>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <Calendar size={14} />
                  {med.nextDueDate || 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(med)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(med.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400">No medical records found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{editingMedicine ? t.edit : t.add} {t.medicine}</h3>
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.nextDue}</label>
                  <input
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.medicineName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Lasota Vaccine"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.dosage}</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 2 drops"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">{t.givenTo}</label>
                  <input
                    type="text"
                    value={formData.givenTo}
                    onChange={(e) => setFormData({ ...formData, givenTo: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Hen ID or Batch"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">{t.notes}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none"
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

export default MedicinePage;
