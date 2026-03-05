import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import Halaman
import DataItem from './pages/MasterData/DataItem';
import DataJenis from './pages/MasterData/DataJenis';
import DataSatuan from './pages/MasterData/DataSatuan';
import CetakPriceTag from './pages/Cetak/CetakPriceTag';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Listener untuk mendeteksi perubahan ukuran layar (HP vs Desktop)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Komponen Sidebar / Navigasi
  const Sidebar = () => (
    <div style={{
      ...styles.sidebar,
      width: isMobile ? '100%' : '250px',
      height: isMobile ? 'auto' : '100vh',
      position: isMobile ? 'relative' : 'fixed',
      flexDirection: isMobile ? 'row' : 'column',
      overflowX: isMobile ? 'auto' : 'hidden'
    }}>
      <div style={styles.logoArea}>
        <h2 style={styles.logoText}>UD AMANAH</h2>
      </div>
      
      <nav style={{ 
        ...styles.nav, 
        flexDirection: isMobile ? 'row' : 'column',
        gap: isMobile ? '10px' : '0'
      }}>
        <div style={styles.navGroup}>
          {!isMobile && <span style={styles.navLabel}>MASTER DATA</span>}
          <Link to="/master/item" style={styles.navLink}>📦 {isMobile ? 'Item' : 'Data Item'}</Link>
          <Link to="/master/jenis" style={styles.navLink}>🏷️ {isMobile ? 'Jenis' : 'Data Jenis'}</Link>
          <Link to="/master/satuan" style={styles.navLink}>📏 {isMobile ? 'Satuan' : 'Data Satuan'}</Link>
        </div>

        <div style={styles.navGroup}>
          {!isMobile && <span style={styles.navLabel}>TRANSAKSI</span>}
          <Link to="/cetak" style={{...styles.navLink, backgroundColor: '#e67e22'}}>🖨️ {isMobile ? 'Cetak' : 'Cetak Price Tag'}</Link>
        </div>
      </nav>
    </div>
  );

  return (
    <Router>
      <div style={styles.appContainer}>
        <Sidebar />
        
        <main style={{
          ...styles.mainContent,
          marginLeft: isMobile ? '0' : '250px',
          width: isMobile ? '100%' : 'calc(100% - 250px)',
          padding: isMobile ? '10px' : '20px'
        }}>
          <Routes>
            <Route path="/" element={
              <div style={styles.welcomeBox}>
                <h1>Selamat Datang, Fery!</h1>
                <p>Kelola data toko dan cetak price tag dengan mudah.</p>
              </div>
            } />
            <Route path="/master/item" element={<DataItem />} />
            <Route path="/master/jenis" element={<DataJenis />} />
            <Route path="/master/satuan" element={<DataSatuan />} />
            <Route path="/cetak" element={<CetakPriceTag />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// FULLSCREEN & RESPONSIVE STYLES
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f4f7f6',
    margin: 0,
    padding: 0,
    overflowX: 'hidden'
  },
  sidebar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    zIndex: 1000,
    boxSizing: 'border-box',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  },
  logoArea: {
    padding: '20px',
    textAlign: 'center',
    borderBottom: '1px solid #34495e'
  },
  logoText: { margin: 0, fontSize: '20px', letterSpacing: '1px' },
  nav: {
    display: 'flex',
    padding: '10px',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'inherit', // Mengikuti parent (sidebar)
  },
  navLabel: {
    fontSize: '11px',
    color: '#95a5a6',
    padding: '15px 10px 5px 10px',
    fontWeight: 'bold'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px 15px',
    fontSize: '14px',
    borderRadius: '6px',
    transition: '0.3s',
    display: 'block',
    whiteSpace: 'nowrap'
  },
  mainContent: {
    boxSizing: 'border-box',
    minHeight: '100vh',
    transition: 'all 0.3s ease'
  },
  welcomeBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    textAlign: 'center',
    marginTop: '20px'
  }
};

export default App;
