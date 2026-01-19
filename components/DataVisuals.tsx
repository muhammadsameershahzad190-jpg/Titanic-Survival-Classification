
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Passenger } from '../types';

interface Props {
  data: Passenger[];
}

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'];

const DataVisuals: React.FC<Props> = ({ data }) => {
  // Survival by Class
  const survivalByClass = useMemo(() => {
    const classes = [1, 2, 3];
    return classes.map(c => {
      const classPass = data.filter(p => p.Pclass === c);
      const survived = classPass.filter(p => p.Survived === 1).length;
      return {
        name: `Class ${c}`,
        survived,
        died: classPass.length - survived
      };
    });
  }, [data]);

  // Survival by Gender
  const survivalByGender = useMemo(() => {
    const genders = ['male', 'female'];
    return genders.map(g => {
      const genderPass = data.filter(p => p.Sex === g);
      const survived = genderPass.filter(p => p.Survived === 1).length;
      return {
        name: g.charAt(0).toUpperCase() + g.slice(1),
        value: survived
      };
    });
  }, [data]);

  // Age vs Fare vs Survival
  const scatterData = useMemo(() => {
    return data
      .filter(p => p.Age !== null)
      .map(p => ({
        age: p.Age,
        fare: p.Fare,
        survived: p.Survived,
        status: p.Survived === 1 ? 'Survived' : 'Died'
      }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">Survival by Ticket Class</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={survivalByClass}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="survived" fill="#22c55e" radius={[4, 4, 0, 0]} name="Survived" />
              <Bar dataKey="died" fill="#ef4444" radius={[4, 4, 0, 0]} name="Died" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">Survival Distribution (Gender)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={survivalByGender}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {survivalByGender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '8px'}} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">Age vs. Fare Correlation</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="age" name="Age" unit="y" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="fare" name="Fare" unit="$" label={{ value: 'Fare', angle: -90, position: 'insideLeft' }} axisLine={false} tickLine={false} />
              <ZAxis range={[20, 20]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Died" data={scatterData.filter(s => s.survived === 0)} fill="#ef4444" shape="circle" />
              <Scatter name="Survived" data={scatterData.filter(s => s.survived === 1)} fill="#22c55e" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataVisuals;
