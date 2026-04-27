import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronRight, Check } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveOnboardingData } = useAppContext();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    gender: '',
    activityLevel: '',
    height: 170, // cm
    weight: 70, // kg
    dob: { day: 1, month: 1, year: 2000 },
    goal: '',
    diet: ''
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  
  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculateTargets = () => {
    const { gender, weight, height, dob, activityLevel, goal } = formData;
    const age = new Date().getFullYear() - dob.year;
    
    // Mifflin-St Jeor
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'male' ? 5 : -161;

    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'athlete': 1.9
    };
    
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
    
    let calories = tdee;
    if (goal === 'lose') calories -= 500;
    if (goal === 'gain') calories += 300;
    
    calories = Math.round(calories);
    
    // Macro split: 30% P, 40% C, 30% F
    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.40) / 4);
    const fats = Math.round((calories * 0.30) / 9);

    return { calories, protein, carbs, fats };
  };

  const completeOnboarding = () => {
    const targets = calculateTargets();
    saveOnboardingData({ ...formData, targets });
    navigate('/');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="slide-enter-active">
            <h2>What's your gender?</h2>
            <div className="mt-6">
              {['male', 'female', 'other'].map(g => (
                <div 
                  key={g}
                  className={`card selectable-card ${formData.gender === g ? 'selected' : ''}`}
                  onClick={() => updateForm('gender', g)}
                  style={{ textTransform: 'capitalize', fontSize: '18px', textAlign: 'center' }}
                >
                  {g}
                </div>
              ))}
            </div>
            <button className="btn mt-8" onClick={nextStep} disabled={!formData.gender}>Continue <ChevronRight /></button>
          </div>
        );
      case 2:
        return (
          <div className="slide-enter-active">
            <h2>How many workouts do you do per week?</h2>
            <div className="mt-6">
              {[
                {id: 'sedentary', label: '0 — Sedentary'},
                {id: 'light', label: '1–2 — Lightly active'},
                {id: 'moderate', label: '3–4 — Moderately active'},
                {id: 'active', label: '5–6 — Very active'},
                {id: 'athlete', label: '7+ — Athlete'},
              ].map(a => (
                <div 
                  key={a.id}
                  className={`card selectable-card ${formData.activityLevel === a.id ? 'selected' : ''}`}
                  onClick={() => updateForm('activityLevel', a.id)}
                >
                  {a.label}
                </div>
              ))}
            </div>
            <button className="btn mt-8" onClick={nextStep} disabled={!formData.activityLevel}>Continue <ChevronRight /></button>
          </div>
        );
      case 3:
        return (
          <div className="slide-enter-active">
            <h2>Height & Weight</h2>
            <div className="mt-6 text-center">
              <label style={{display:'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>Height ({formData.height} cm)</label>
              <input 
                type="range" min="100" max="250" value={formData.height} 
                onChange={(e) => updateForm('height', Number(e.target.value))} 
                style={{width: '100%', marginBottom: '32px'}}
              />
              
              <label style={{display:'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>Weight ({formData.weight} kg)</label>
              <input 
                type="range" min="30" max="200" value={formData.weight} 
                onChange={(e) => updateForm('weight', Number(e.target.value))} 
                style={{width: '100%'}}
              />
            </div>
            <button className="btn mt-8" onClick={nextStep}>Continue <ChevronRight /></button>
          </div>
        );
      case 4:
        return (
          <div className="slide-enter-active">
            <h2>Date of birth & Goal</h2>
            <div className="mt-6">
              <label style={{display:'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>Year of Birth</label>
              <input 
                type="number" min="1920" max={new Date().getFullYear()} 
                value={formData.dob.year} 
                onChange={(e) => updateForm('dob', {...formData.dob, year: Number(e.target.value)})}
                className="card" style={{width: '100%', marginBottom: '24px'}}
              />

              <label style={{display:'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>Goal</label>
              {[
                {id: 'lose', label: 'Lose weight'},
                {id: 'maintain', label: 'Maintain weight'},
                {id: 'gain', label: 'Gain weight / Muscle'},
                {id: 'health', label: 'Improve health'}
              ].map(g => (
                <div 
                  key={g.id}
                  className={`card selectable-card ${formData.goal === g.id ? 'selected' : ''}`}
                  onClick={() => updateForm('goal', g.id)}
                >
                  {g.label}
                </div>
              ))}
            </div>
            <button className="btn mt-8" onClick={nextStep} disabled={!formData.goal}>Continue <ChevronRight /></button>
          </div>
        );
      case 5:
        return (
          <div className="slide-enter-active">
            <h2>Do you follow a specific diet?</h2>
            <div className="mt-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {['Classic', 'Pescatarian', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-free', 'Other'].map(d => (
                <div 
                  key={d}
                  className={`card selectable-card ${formData.diet === d ? 'selected' : ''}`}
                  onClick={() => updateForm('diet', d)}
                  style={{ marginBottom: 0, textAlign: 'center' }}
                >
                  {d}
                </div>
              ))}
            </div>
            <button className="btn mt-8" onClick={nextStep} disabled={!formData.diet}>Continue <ChevronRight /></button>
          </div>
        );
      case 6:
        const targets = calculateTargets();
        return (
          <div className="slide-enter-active text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={32} />
              </div>
            </div>
            <h2>Setup Complete</h2>
            <p className="mt-2">We've calculated your personalized targets.</p>
            
            <div className="mt-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{targets.calories}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily Calories</div>
              </div>
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{targets.protein}g</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Protein</div>
              </div>
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{targets.carbs}g</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Carbs</div>
              </div>
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{targets.fats}g</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fats</div>
              </div>
            </div>

            <button className="btn mt-8" onClick={completeOnboarding}>Go to Dashboard</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {Array.from({length: totalSteps}).map((_, i) => (
          <div key={i} style={{ 
            height: '4px', 
            flex: 1, 
            backgroundColor: i < step ? 'var(--primary)' : 'var(--border-color)',
            borderRadius: '2px',
            transition: 'background-color 0.3s'
          }} />
        ))}
      </div>
      {renderStep()}
    </div>
  );
}
