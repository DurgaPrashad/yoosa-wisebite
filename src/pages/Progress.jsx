import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';

export default function Progress() {
  const { userData } = useAppContext();
  
  // Dummy data for weekly progress
  const data = [
    { name: 'Mon', calories: 1800, target: 2000 },
    { name: 'Tue', calories: 2100, target: 2000 },
    { name: 'Wed', calories: 1950, target: 2000 },
    { name: 'Thu', calories: 2050, target: 2000 },
    { name: 'Fri', calories: 1900, target: 2000 },
    { name: 'Sat', calories: 2400, target: 2000 },
    { name: 'Sun', calories: 1500, target: 2000 },
  ];

  const weightLog = [
    { date: 'Today', weight: userData?.weight || 70 },
    { date: 'Yesterday', weight: (userData?.weight || 70) + 0.2 },
    { date: '3 days ago', weight: (userData?.weight || 70) + 0.5 },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 style={{ marginBottom: '24px' }}>Your Progress</h2>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: '16px', borderRadius: '50%' }}>
          🔥
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5 Day Streak</div>
          <div style={{ color: 'var(--text-secondary)' }}>You're on fire! Keep it up.</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Weekly Calories</h3>
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ margin: '24px 0 16px' }}>Weight Log</h3>
      <div className="card">
        {weightLog.map((log, i) => (
          <div key={i} style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '12px 0',
            borderBottom: i < weightLog.length - 1 ? '1px solid var(--border-color)' : 'none'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>{log.date}</span>
            <span style={{ fontWeight: 'bold' }}>{log.weight.toFixed(1)} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}
