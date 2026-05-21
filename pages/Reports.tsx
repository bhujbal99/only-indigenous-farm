import * as XLSX from 'xlsx';

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { translations } from '../translations';
import { FarmState, Language } from '../types';
import { formatCurrency } from '../utils';

interface ReportsProps {
  data: FarmState;
  lang: Language;
}

const Reports: React.FC<ReportsProps> = ({ data, lang }) => {
  const t = translations[lang];

  // Income vs Expenses Logic
  const financialData = useMemo(() => {
    const monthlyData: Record<string, { month: string, income: number, expense: number }> = {};
    
    data.sales.forEach(sale => {
      const date = new Date(sale.date);
      const month = date.toLocaleString(lang === 'en' ? 'en-US' : 'mr-IN', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
      monthlyData[month].income += sale.amount;
    });

    data.expenses.forEach(exp => {
      const date = new Date(exp.date);
      const month = date.toLocaleString(lang === 'en' ? 'en-US' : 'mr-IN', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
      monthlyData[month].expense += exp.cost;
    });

    return Object.values(monthlyData);
  }, [data.sales, data.expenses, lang]);

  // Egg Production Trend
  const eggData = useMemo(() => {
    return data.eggProduction
      .slice(-10)
      .map(e => ({
        date: new Date(e.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'mr-IN', { day: 'numeric', month: 'short' }),
        count: e.collected
      }));
  }, [data.eggProduction, lang]);

  // Expense Distribution
  const expensePieData = useMemo(() => {
    const categories: Record<string, number> = {};
    data.expenses.forEach(exp => {
      categories[exp.type] = (categories[exp.type] || 0) + exp.cost;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [data.expenses]);

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const exportToExcel = () => {
  const reportData = [
    {
      LifetimeRevenue: data.sales.reduce((a, b) => a + b.amount, 0),
      TotalEggs: data.eggProduction.reduce((a, b) => a + b.collected, 0),
      OverallMortality: data.mortalities.length,
      MedicinesGiven: data.medicines.length,
      TotalExpenses: data.expenses.reduce((a, b) => a + b.cost, 0)
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(reportData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Farm Report');

  XLSX.writeFile(workbook, 'Farm_Report.xlsx');
};

 return (
  <>
    <div className="flex justify-end mb-4">
      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Export Excel
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">  {/* Monthly Profitability */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">{t.expenses} vs {t.sales}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => formatCurrency(value, lang)}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="income" name={t.sales} fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name={t.expenses} fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Egg Production Trend */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">{t.eggProduction} Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={eggData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Expense Distribution</h3>
        <div className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensePieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Summary Card */}
      <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center">
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-bold opacity-80">Total Statistics Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-70">Lifetime Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(data.sales.reduce((a, b) => a + b.amount, 0), lang)}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Total Eggs Laid</p>
              <p className="text-2xl font-bold">{data.eggProduction.reduce((a, b) => a + b.collected, 0)}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Overall Mortality</p>
              <p className="text-2xl font-bold">{data.mortalities.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Medicines Given</p>
              <p className="text-2xl font-bold">{data.medicines.length}</p>
            </div>
          </div>
        </div>
        <BarChart3 className="absolute -bottom-10 -right-10 text-emerald-600 opacity-20" size={240} />
      </div>

    </div>
  </>
  );
};

export default Reports;
