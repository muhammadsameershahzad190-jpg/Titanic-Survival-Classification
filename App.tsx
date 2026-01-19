
import React, { useState, useEffect, useMemo } from 'react';
import { TITANIC_DATASET } from './data/titanic';
import { analyzeTitanicData } from './services/geminiService';
import DataVisuals from './components/DataVisuals';
import PassengerForm from './components/PassengerForm';
import { 
  Activity, 
  BarChart3, 
  Database, 
  BrainCircuit, 
  FileText, 
  Ship,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prediction' | 'raw-data'>('dashboard');
  const [insight, setInsight] = useState<string>('Analyzing patterns...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dynamic Metrics
  const metrics = useMemo(() => {
    const total = TITANIC_DATASET.length;
    const survivors = TITANIC_DATASET.filter(p => p.Survived === 1).length;
    const survivalRate = ((survivors / total) * 100).toFixed(1);
    const avgAge = (TITANIC_DATASET.reduce((acc, p) => acc + (p.Age || 0), 0) / TITANIC_DATASET.filter(p => p.Age !== null).length).toFixed(1);
    
    return {
      total,
      survivalRate,
      avgAge,
      features: 7
    };
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzeTitanicData(TITANIC_DATASET);
        setInsight(result || 'Unable to generate insights at this time.');
      } catch (err) {
        setInsight('Error loading AI insights. Please check your network connection.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-slate-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Titanic Discovery</h1>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">ML Analysis Workbench</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1 p-1 bg-slate-50 rounded-lg border border-slate-100">
              {[
                { id: 'dashboard', label: 'Analytics', icon: Activity },
                { id: 'prediction', label: 'Survival Predictor', icon: BrainCircuit },
                { id: 'raw-data', label: 'Data Explorer', icon: Database },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/google/genai" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                Docs <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Sample Population', value: metrics.total, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Observed Survival %', value: `${metrics.survivalRate}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Average Age', value: metrics.avgAge, icon: Ship, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Input Features', value: metrics.features, icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${kpi.bg} p-2.5 rounded-lg`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{kpi.label}</h3>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Demographic Correlations
                    </h2>
                  </div>
                  <div className="p-4">
                    <DataVisuals data={TITANIC_DATASET} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-900 text-white p-1 rounded-2xl shadow-xl border border-slate-800 h-full flex flex-col">
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> AI Pattern Analysis
                    </h2>
                  </div>
                  <div className="p-6 flex-grow">
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-3 bg-white/5 rounded-full animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                        ))}
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-strong:text-emerald-400 leading-relaxed text-sm">
                        {insight}
                      </div>
                    )}
                  </div>
                  <div className="p-6 mt-auto">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Model Version</p>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <BrainCircuit className="w-4 h-4 text-emerald-500" /> gemini-3-pro-preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prediction' && (
          <div className="max-w-4xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PassengerForm />
          </div>
        )}

        {activeTab === 'raw-data' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Historical Record Set</h2>
                <p className="text-xs text-slate-500">Browsing processed passenger metadata used for training.</p>
              </div>
              <div className="text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-tighter">
                N={TITANIC_DATASET.length} OBJS
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest font-bold border-b border-slate-200">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Survival Status</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Fare Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TITANIC_DATASET.map((p) => (
                    <tr key={p.PassengerId} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{p.PassengerId}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{p.Name}</p>
                        <p className="text-xs text-slate-500 capitalize">{p.Sex} • {p.Age ? `${p.Age}yrs` : 'Age unknown'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {p.Survived === 1 ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-black uppercase border border-emerald-100">
                            <Activity className="w-2.5 h-2.5" /> Survived
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-black uppercase border border-slate-200">
                             Lost
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-4 rounded-full ${i < (4 - p.Pclass) ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        Ticket: <span className="text-slate-700 font-medium">{p.Ticket}</span><br/>
                        Port: <span className="text-slate-700 font-medium">{p.Embarked}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">${p.Fare.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of dataset preview</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-slate-300" />
              <span className="text-slate-900 font-bold tracking-tight">TitanicML Platform</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-bold">LATEST</span>
            </div>
            <p className="text-slate-400 text-xs text-center md:text-right">
              Historical analysis project powered by Google Gemini 3.0.<br/>
              © 2025 ML Research Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
