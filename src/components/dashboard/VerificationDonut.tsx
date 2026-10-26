import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const VerificationDonut: React.FC = () => {
  const data = [
    { name: 'Verified Compliant', value: 152, color: '#16A34A', percentage: '61.3%' },
    { name: 'Pending Review', value: 48, color: '#2563EB', percentage: '19.4%' },
    { name: 'Needs Correction', value: 30, color: '#F59E0B', percentage: '12.1%' },
    { name: 'Flagged for Human Review', value: 18, color: '#DC2626', percentage: '7.2%' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow flex flex-col h-full">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Verification Status</h3>
        <p className="text-xs text-slate-500 mt-0.5">Distribution across active institutional reviews</p>
      </div>

      <div className="relative w-full h-48 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-2 rounded shadow-lg border border-slate-700">
                      <span className="font-semibold block">{item.name}</span>
                      <span className="text-slate-300 font-mono">
                        {item.value} applications ({item.percentage})
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">248</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            Total Dossiers
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 font-medium truncate text-[11px]">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-slate-900 text-[11px] shrink-0 pl-1">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
