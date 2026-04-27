import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, LineChart, Sparkles, FileText, User, Plus, X, Camera, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const { addMeal } = useAppContext();

  const handleSimulateCapture = () => {
    // Simulate AI identifying food
    setSimulatedResult({
      name: "Grilled Chicken Salad",
      calories: 320,
      protein: 35,
      carbs: 12,
      fats: 15
    });
  };

  const confirmAdd = () => {
    addMeal(simulatedResult);
    setShowAddModal(false);
    setSimulatedResult(null);
  };

  return (
    <>
      <div style={{ flex: 1, paddingBottom: '80px', overflowY: 'auto' }}>
        <Outlet />
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setShowAddModal(true)}>
        <Plus className="fab-icon" />
      </button>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/progress" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LineChart size={24} />
          <span>Progress</span>
        </NavLink>
        <div style={{ width: '56px' }}></div> {/* Spacer for FAB */}
        <NavLink to="/ai" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Sparkles size={24} />
          <span>Health AI</span>
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={24} />
          <span>Reports</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px' }}>Log Meal</h3>
              <button onClick={() => {setShowAddModal(false); setSimulatedResult(null);}} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--text-secondary)" />
              </button>
            </div>

            {!simulatedResult ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button className="card selectable-card" onClick={handleSimulateCapture} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '12px' }}>
                  <Camera size={32} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>Take Photo</span>
                </button>
                <button className="card selectable-card" onClick={handleSimulateCapture} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '12px' }}>
                  <ImageIcon size={32} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>Upload Gallery</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="card text-center" style={{ border: '2px solid var(--primary)', backgroundColor: 'rgba(0, 230, 118, 0.05)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{simulatedResult.name}</div>
                  <div style={{ fontSize: '24px', color: 'var(--primary-dark)', fontWeight: 'bold', marginBottom: '16px' }}>
                    {simulatedResult.calories} kcal
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <div><b>P:</b> {simulatedResult.protein}g</div>
                    <div><b>C:</b> {simulatedResult.carbs}g</div>
                    <div><b>F:</b> {simulatedResult.fats}g</div>
                  </div>
                </div>
                <button className="btn mt-4" onClick={confirmAdd}>Log Food</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
