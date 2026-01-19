
import React, { useState } from 'react';
import { Passenger, PredictionResult } from '../types';
import { predictSurvival } from '../services/geminiService';
import { Loader2, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const PassengerForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Passenger>>({
    Pclass: 1,
    Sex: 'female',
    Age: 25,
    Fare: 50,
    SibSp: 0,
    Parch: 0
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictSurvival(formData);
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Predict Individual Survival
        </h2>
        <p className="text-slate-400 text-sm mt-1">Input passenger characteristics to simulate likelihood of survival.</p>
      </div>
      
      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.Pclass}
                onChange={(e) => setFormData({...formData, Pclass: Number(e.target.value)})}
              >
                <option value={1}>1st Class (Elite)</option>
                <option value={2}>2nd Class</option>
                <option value={3}>3rd Class (Economy)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.Sex}
                onChange={(e) => setFormData({...formData, Sex: e.target.value})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.Age || ''}
                onChange={(e) => setFormData({...formData, Age: Number(e.target.value)})}
                min="0" max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fare ($)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.Fare || ''}
                onChange={(e) => setFormData({...formData, Fare: Number(e.target.value)})}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Siblings/Spouses</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.SibSp || 0}
                onChange={(e) => setFormData({...formData, SibSp: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Parents/Children</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.Parch || 0}
                onChange={(e) => setFormData({...formData, Parch: Number(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Prediction Model"}
          </button>
        </form>

        <div className="bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200">
          {!prediction && !loading && (
            <div className="text-slate-400">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Run a prediction to see AI analysis results.</p>
            </div>
          )}

          {loading && (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          )}

          {prediction && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {prediction.survived ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Likely Survived</h3>
                  <div className="px-4 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-6">
                    {(prediction.probability * 100).toFixed(1)}% Confidence
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Likely Perished</h3>
                  <div className="px-4 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full mb-6">
                    {(prediction.probability * 100).toFixed(1)}% Confidence
                  </div>
                </div>
              )}
              
              <div className="text-left space-y-4">
                <p className="text-slate-600 italic">"{prediction.reasoning}"</p>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.keyFeatures.map((f, i) => (
                      <span key={i} className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-md font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
