import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDashboardStore } from '../store/dashboardStore';
import { ChartWidget } from '../components/ChartWidget';
import { Filter, Calendar, Globe2, TrendingUp, TrendingDown, Info, Languages } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { pages } = useDashboardStore();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [regionFilter, setRegionFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const page = pages.find(p => p.id === pageId);

  if (!page) {
    if (pages.length > 0) {
      return <Navigate to={`/dashboard/${pages[0].id}`} replace />;
    }
    return <div className="p-8 text-slate-500">No pages found. Contact admin.</div>;
  }

  const getSectionLabel = (section: string) => {
    switch(section) {
      case 'internal': return 'Internal Operations Dashboard';
      case 'external': return 'Product Insights Dashboard';
      case 'overview': return 'Executive Overview';
      default: return 'Dashboard';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Output': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Input': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Guardrail': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const activeFilters = {
    region: regionFilter,
    product: productFilter,
    time: timeFilter,
    language: languageFilter
  };

  return (
    <div className="flex-1 bg-slate-50/50 h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{page.title}</h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              {getSectionLabel(page.section)}
            </p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              showFilters 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-8 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Global Filters</h3>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe2 size={16} className="text-slate-400" />
                </div>
                <select 
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none min-w-[160px]"
                >
                  <option value="">All Regions</option>
                  <option value="LATAM">LATAM</option>
                  <option value="MENA">MENA</option>
                  <option value="APAC">APAC</option>
                  <option value="NA">North America</option>
                  <option value="EMEA">EMEA</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-slate-400" />
                </div>
                <select 
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none min-w-[160px]"
                >
                  <option value="">All Products</option>
                  <option value="TTAM">TTAM</option>
                  <option value="Starling">Starling</option>
                  <option value="LarkBase">Lark Base</option>
                  <option value="Ads">Ads</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-slate-400" />
                </div>
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none min-w-[160px]"
                >
                  <option value="">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="180">Last 6 Months</option>
                  <option value="ytd">Year to Date</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Languages size={16} className="text-slate-400" />
                </div>
                <select 
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none min-w-[160px]"
                >
                  <option value="">All Languages</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* KPIs Section */}
        {page.kpis && page.kpis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {page.kpis.map(kpi => (
              <div key={kpi.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeColor(kpi.type)} mb-3`}>
                      {kpi.type} Metric
                    </span>
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      {kpi.title}
                      {kpi.description && (
                        <div className="group/tooltip relative cursor-help">
                          <Info size={14} className="text-slate-400 hover:text-slate-600" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                            {kpi.description}
                          </div>
                        </div>
                      )}
                    </h3>
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
                  {kpi.trend && (
                    <span className={`flex items-center text-sm font-semibold ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {kpi.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                      {kpi.trend}
                    </span>
                  )}
                </div>
                {/* Decorative background accent */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {page.widgets.map(widget => (
            <ChartWidget key={widget.id} widget={widget} filters={activeFilters} />
          ))}
        </div>
      </div>
    </div>
  );
};
