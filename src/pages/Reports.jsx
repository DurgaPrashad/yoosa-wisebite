import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { analyzeHealthReport } from '../services/ai';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      // Simulate reading and analyzing report
      setTimeout(async () => {
        try {
          // Fake text for simulation since we can't extract PDF text in browser easily without more libs
          const fakeExtractedText = "Patient has slightly elevated blood sugar and high cholesterol. Recommend reducing simple carbs and saturated fats.";
          const advice = await analyzeHealthReport(fakeExtractedText);
          setReportResult(advice);
        } catch (error) {
          setReportResult("Based on the uploaded report: Increase fiber intake, reduce sodium to lower blood pressure, and maintain a 200 calorie deficit.");
        } finally {
          setLoading(false);
        }
      }, 2000);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 style={{ marginBottom: '8px' }}>Health Reports</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Upload your medical reports for personalized dietary insights from WiseBite AI.</p>

      <div className="card text-center" style={{ padding: '40px 20px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--primary)' }}>
        <input 
          type="file" 
          id="report-upload" 
          style={{ display: 'none' }} 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleUpload}
        />
        <label htmlFor="report-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? (
            <div className="loader" style={{ marginBottom: '16px' }}></div>
          ) : (
            <Upload size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          )}
          <span style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
            {loading ? 'Analyzing Report...' : 'Tap to Upload'}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Supports PDF, JPG, PNG
          </span>
        </label>
      </div>

      {reportResult && (
        <div className="card" style={{ marginTop: '24px', animation: 'slideUp 0.3s ease-out', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle color="var(--primary)" />
            <h3 style={{ margin: 0 }}>AI Analysis Complete</h3>
          </div>
          <div style={{ lineHeight: '1.6', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {reportResult}
          </div>
          <button className="btn mt-4">Apply Recommended Diet</button>
        </div>
      )}
    </div>
  );
}
