import { useAppContext } from '../context/AppContext';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const { userData, meals, removeMeal, user } = useAppContext();
  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === new Date().toDateString());
  
  const consumed = todayMeals.reduce((acc, meal) => {
    acc.calories += meal.calories || 0;
    acc.protein += meal.protein || 0;
    acc.carbs += meal.carbs || 0;
    acc.fats += meal.fats || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const targets = userData?.targets || { calories: 2000, protein: 150, carbs: 200, fats: 65 };
  
  const left = {
    calories: Math.max(0, targets.calories - consumed.calories),
    protein: Math.max(0, targets.protein - consumed.protein),
    carbs: Math.max(0, targets.carbs - consumed.carbs),
    fats: Math.max(0, targets.fats - consumed.fats)
  };

  const circumference = 2 * Math.PI * 40;
  const calPercent = Math.min(100, (consumed.calories / targets.calories) * 100);
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDay = new Date().getDay(); // 0 is Sunday
  const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Good morning,</p>
        <h1 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>{user?.displayName || 'Prashad'}</h1>
      </header>

      {/* Week Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{d}</span>
            <div style={{ 
              width: i === adjustedDay ? '32px' : '24px', 
              height: i === adjustedDay ? '32px' : '24px',
              borderRadius: '50%',
              backgroundColor: i === adjustedDay ? 'var(--text-primary)' : 'transparent',
              color: i === adjustedDay ? '#fff' : 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: i === adjustedDay ? 'bold' : 'normal',
              border: i !== adjustedDay ? '1px dashed var(--border-color)' : 'none'
            }}>
              {i === adjustedDay ? new Date().getDate() : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Summary Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 24px', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{left.calories}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Calories left</div>
        </div>
        
        {/* Calorie Ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="8" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🔥
          </div>
        </div>
      </div>

      {/* Macro Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        {[{label: 'Protein', left: left.protein, icon: '🍗'}, {label: 'Carbs', left: left.carbs, icon: '🌾'}, {label: 'Fat', left: left.fats, icon: '🥑'}].map(macro => (
          <div key={macro.label} className="card" style={{ padding: '16px 12px', marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{macro.left}g</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{macro.label} left</div>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--bg-color)', 
              margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
            }}>
              {macro.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recently Logged */}
      <h3 style={{ marginBottom: '16px' }}>Recently logged</h3>
      {todayMeals.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px 20px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>You haven't uploaded any food</div>
          <p>Start tracking today's meals by taking a quick picture.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {todayMeals.map(meal => (
            <div key={meal.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '16px', marginBottom: 0 }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                🍲
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{meal.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fats}g F
                </div>
              </div>
              <button onClick={() => removeMeal(meal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
