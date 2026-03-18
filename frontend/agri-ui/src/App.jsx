import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoilAnalysis from './pages/SoilAnalysis';
import DiseaseDetection from './pages/DiseaseDetection';

function App() {
  return (
    <BrowserRouter>
      {/* Premium Dark Gradient Background replacing the global LiquidEther */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, background: '#0A0D0B' }}></div>
      <div style={{ position: 'fixed', top: '-50%', left: '-20%', width: '140vw', height: '140vh', zIndex: -1, background: 'radial-gradient(circle at 50% 0%, rgba(39, 174, 96, 0.12) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/soil" element={<SoilAnalysis />} />
          <Route path="/disease" element={<DiseaseDetection />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;