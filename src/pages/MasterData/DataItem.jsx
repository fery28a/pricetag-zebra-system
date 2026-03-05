import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataItem = () => {
  const [items, setItems] = useState([]);
  const [listJenis, setListJenis] = useState([]);
  const [listSatuan, setListSatuan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    kode: '', nama: '', jenis: '', satuan: '',
    hargaPcs: 0,
    qtyGrosir1: 0, hargaGrosir1: 0,
    qtyGrosir2: 0, hargaGrosir2: 0,
    qtyGrosir3: 0, hargaGrosir3: 0,
    hargaBox: 0
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  const fetchData = async () => {
    const res = await axios.get('http://10.10.10.100:3000/api/products');
    setItems(res.data);
  };

  const fetchDropdowns = async () => {
    const resJenis = await axios.get('http://localhost:5000/api/jenis');
    const resSatuan = await axios.get('http://localhost:5000/api/satuan');
    setListJenis(resJenis.data);
    setListSatuan(resSatuan.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/${currentId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/products', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item._id);
    setFormData(item);
    setShowModal(true);
  };

  const filteredItems = items.filter(item => 
    item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>📦 Master Data Item</h2>
        <button style={styles.btnTambah} onClick={() => { setIsEdit(false); setFormData(initialForm); setShowModal(true); }}>
          + Tambah Barang
        </button>
      </div>

      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Cari Kode atau Nama Item (Scan Barcode)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Kode</th>
              <th style={styles.th}>Nama</th>
              <th style={styles.th}>Jenis</th>
              <th style={styles.th}>Harga Pcs</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item._id} style={styles.tr}>
                <td style={styles.td}>{item.kode}</td>
                <td style={styles.td}><strong>{item.nama}</strong></td>
                <td style={styles.td}>{item.jenis}</td>
                <td style={styles.td}>Rp {item.hargaPcs.toLocaleString()}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(item)} style={styles.btnEdit}>✏️</button>
                  <button onClick={async () => { if(window.confirm("Hapus?")) { await axios.delete(`http://localhost:5000/api/products/${item._id}`); fetchData(); }}} style={styles.btnHapus}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{isEdit ? '✏️ Edit Produk' : '➕ Tambah Produk'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formSection}>
                <input placeholder="Kode Item" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} style={styles.input} disabled={isEdit} required />
                <input placeholder="Nama Item" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} style={styles.input} required />
                <div style={styles.row}>
                  <select value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})} style={styles.input} required>
                    <option value="">-- Pilih Jenis --</option>
                    {listJenis.map(j => <option key={j._id} value={j.nama}>{j.nama}</option>)}
                  </select>
                  <select value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} style={styles.input} required>
                    <option value="">-- Pilih Satuan --</option>
                    {listSatuan.map(s => <option key={s._id} value={s.nama}>{s.nama}</option>)}
                  </select>
                </div>
              </div>

              <div style={styles.formSection}>
                <label style={styles.label}>Harga Satuan & Grosir</label>
                <div style={styles.priceGrid}>
                  <div>
                    <small>Harga Pcs</small>
                    <input type="number" value={formData.hargaPcs} onChange={e => setFormData({...formData, hargaPcs: Number(e.target.value)})} style={styles.input} />
                  </div>
                  <div style={styles.row}>
                    <div style={{flex:1}}><small>Min Qty 1</small><input type="number" value={formData.qtyGrosir1} onChange={e => setFormData({...formData, qtyGrosir1: Number(e.target.value)})} style={styles.input} /></div>
                    <div style={{flex:2}}><small>Harga Grosir 1</small><input type="number" value={formData.hargaGrosir1} onChange={e => setFormData({...formData, hargaGrosir1: Number(e.target.value)})} style={styles.input} /></div>
                  </div>
                  <div style={styles.row}>
                    <div style={{flex:1}}><small>Min Qty 2</small><input type="number" value={formData.qtyGrosir2} onChange={e => setFormData({...formData, qtyGrosir2: Number(e.target.value)})} style={styles.input} /></div>
                    <div style={{flex:2}}><small>Harga Grosir 2</small><input type="number" value={formData.hargaGrosir2} onChange={e => setFormData({...formData, hargaGrosir2: Number(e.target.value)})} style={styles.input} /></div>
                  </div>
                  <div style={styles.row}>
                    <div style={{flex:1}}><small>Min Qty 3</small><input type="number" value={formData.qtyGrosir3} onChange={e => setFormData({...formData, qtyGrosir3: Number(e.target.value)})} style={styles.input} /></div>
                    <div style={{flex:2}}><small>Harga Grosir 3</small><input type="number" value={formData.hargaGrosir3} onChange={e => setFormData({...formData, hargaGrosir3: Number(e.target.value)})} style={styles.input} /></div>
                  </div>
                </div>
              </div>

              <div style={{...styles.formSection, backgroundColor: '#fffbe6', border: '1px solid #ffe58f'}}>
                <label style={styles.label}>📦 Harga Box (Opsional)</label>
                <input type="number" value={formData.hargaBox} onChange={e => setFormData({...formData, hargaBox: Number(e.target.value)})} style={styles.input} />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnBatal}>Batal</button>
                <button type="submit" style={styles.btnSimpan}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '20px', width: '100%', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  btnTambah: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  searchContainer: { marginBottom: '20px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  tableWrapper: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  tr: { transition: '0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', width: '95%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
  formSection: { padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '15px', backgroundColor: '#fafafa' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '10px' },
  row: { display: 'flex', gap: '10px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  btnSimpan: { padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnBatal: { padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px' },
  btnEdit: { marginRight: '5px', backgroundColor: '#f1c40f', border: 'none', padding: '8px', borderRadius: '5px' },
  btnHapus: { backgroundColor: '#e74c3c', border: 'none', padding: '8px', borderRadius: '5px', color: 'white' }
};

export default DataItem;
