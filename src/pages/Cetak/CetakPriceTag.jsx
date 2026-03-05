import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Barcode from 'react-barcode';

const CetakPriceTag = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    fetchData();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setItems(res.data);
    } catch (err) { console.error("Gagal mengambil data:", err); }
  };

  const handleScannerSubmit = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    const matchedItem = items.find(item => item.kode === searchInput);
    if (matchedItem) {
      setSelectedItems(prev => [...prev, matchedItem]);
      setSearchInput("");
    } else {
      setSearchInput("");
    }
  };

  const removeItem = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.pageContainer}>
      {/* PANEL KONTROL */}
      <div className="no-print" style={styles.controlPanel}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>🛒 Supermarket Price Pro</h2>
        <form onSubmit={handleScannerSubmit}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Scan Barcode Di Sini..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.inputScanner}
            autoFocus
          />
        </form>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button style={styles.btnPrint} onClick={() => window.print()}>CETAK LABEL</button>
          <button onClick={() => setSelectedItems([])} style={styles.btnReset}>Hapus Semua</button>
        </div>
      </div>

      {/* AREA LABEL 40x30mm */}
      <div className="print-section">
        {selectedItems.map((item, index) => {
          const hasGrosir = item.hargaGrosir1 > 0;
          const hasBox = item.hargaBox > 0;

          return (
            <div key={index} className="zebra-label" onClick={() => removeItem(index)}>
              {/* Nama Barang */}
              <div className="item-name">{item.nama.toUpperCase()}</div>
              
              <div className="main-content">
                {hasGrosir ? (
                  /* MODE GROSIR BERTINGKAT */
                  <div className="price-stack">
                    <div className="row-p"><span>ECER</span> <strong>{item.hargaPcs?.toLocaleString()}</strong></div>
                    <div className="row-p b-top"><span>MIN {item.qtyGrosir1}</span> <strong>{item.hargaGrosir1?.toLocaleString()}</strong></div>
                    {item.hargaGrosir2 > 0 && (
                      <div className="row-p b-top"><span>MIN {item.qtyGrosir2}</span> <strong>{item.hargaGrosir2?.toLocaleString()}</strong></div>
                    )}
                  </div>
                ) : hasBox ? (
                  /* MODE PCS & BOX CLEAN */
                  <div className="box-comparison">
                    <div className="pcs-part">
                      <span className="tiny-label">HARGA SATUAN</span>
                      <div className="big-val"><span>Rp</span>{item.hargaPcs?.toLocaleString()}</div>
                    </div>
                    <div className="box-part">
                      <div className="box-border">
                        <span className="tiny-label">HARGA PER BOX</span>
                        <div className="mid-val"><span>Rp</span>{item.hargaBox?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MODE HARGA TUNGGAL BESAR */
                  <div className="solo-price">
                    <span className="solo-rp">Rp</span>
                    <span className="solo-val">{item.hargaPcs?.toLocaleString()}</span>
                    <span className="solo-unit">/{item.satuan || 'Pcs'}</span>
                  </div>
                )}
              </div>

              {/* Footer Barcode */}
              <div className="label-footer">
                <Barcode 
                  value={item.kode} 
                  format="CODE128" 
                  width={1.2} 
                  height={15} 
                  fontSize={7}
                  margin={0}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media print {
          @page { size: 40mm 30mm; margin: 0; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 40mm; }
          .no-print { display: none !important; }
          .zebra-label {
            width: 40mm; height: 30mm;
            page-break-after: always;
            display: flex !important; flex-direction: column;
            border: none !important; padding: 1mm;
          }
        }

        .print-section { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; padding: 20px; }
        .zebra-label {
          width: 40mm; height: 30mm; background: white; border: 1px solid #ddd;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 1mm; box-sizing: border-box; cursor: pointer;
        }

        /* Nama Produk */
        .item-name {
          font-size: 7.5px; font-weight: 800; text-align: center;
          border-bottom: 0.2mm solid #000; padding-bottom: 0.5mm;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Container Tengah */
        .main-content { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; }

        /* Style Multi Harga Grosir */
        .price-stack { width: 100%; }
        .row-p { display: flex; justify-content: space-between; font-size: 7px; padding: 0.2mm 1mm; }
        .b-top { border-top: 0.1mm dashed #ccc; }
        .row-p strong { font-size: 8.5px; }

        /* Style Box Comparison */
        .box-comparison { width: 100%; display: flex; flex-direction: column; gap: 0.5mm; }
        .tiny-label { font-size: 5.5px; font-weight: bold; color: #555; }
        .big-val { font-size: 16px; font-weight: 900; line-height: 1; }
        .big-val span, .mid-val span { font-size: 7px; margin-right: 1px; }
        .box-part { border-top: 0.3mm solid #000; padding-top: 0.5mm; }
        .mid-val { font-size: 11px; font-weight: 800; }

        /* Style Single Price */
        .solo-price { display: flex; align-items: baseline; }
        .solo-rp { font-size: 9px; font-weight: bold; margin-right: 1px; }
        .solo-val { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
        .solo-unit { font-size: 6px; font-weight: bold; margin-left: 1px; color: #444; }

        .label-footer { width: 100%; display: flex; justify-content: center; transform: scaleX(0.95); }
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' },
  controlPanel: { maxWidth: '450px', margin: '0 auto 20px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' },
  inputScanner: { width: '100%', padding: '12px', border: '2px solid #3498db', borderRadius: '8px', fontSize: '16px', outline: 'none' },
  btnPrint: { flex: 2, padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnReset: { flex: 1, padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default CetakPriceTag;