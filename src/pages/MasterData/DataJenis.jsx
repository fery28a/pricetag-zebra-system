import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataJenis = () => {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    const res = await axios.get('http://10.10.10.100:3000/api/jenis');
    setList(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    await axios.post('http://10.10.10.100:3000/api/jenis', { nama: input });
    setInput("");
    fetchList();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus jenis ini?")) {
      await axios.delete(`http://10.10.10.100:3000/api/jenis/${id}`);
      fetchList();
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏷️ Master Jenis Barang</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          style={styles.input}
          placeholder="Nama Jenis Baru..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button style={styles.btnAdd} type="submit">Tambah</button>
      </form>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th>Nama Jenis</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item._id} style={styles.tr}>
                <td>{item.nama}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleDelete(item._id)} style={styles.btnDel}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  btnAdd: { padding: '10px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { backgroundColor: '#2c3e50', color: 'white', textAlign: 'left', height: '45px' },
  tr: { borderBottom: '1px solid #eee', height: '45px' },
  btnDel: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default DataJenis;
