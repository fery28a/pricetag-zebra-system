const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// KONEKSI DATABASE
mongoose.connect("mongodb://localhost:27017/pricetag_db")
  .then(() => console.log("✅ MongoDB Terkoneksi"))
  .catch(err => console.error("❌ Gagal Koneksi:", err));

// --- MODELS ---
const Jenis = mongoose.model('Jenis', new mongoose.Schema({ nama: String }));
const Satuan = mongoose.model('Satuan', new mongoose.Schema({ nama: String }));

const Product = mongoose.model('Product', new mongoose.Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  jenis: String,
  satuan: String,
  // Harga Utama
  hargaPcs: { type: Number, default: 0 },
  // Grosir Level 1
  qtyGrosir1: { type: Number, default: 0 },
  hargaGrosir1: { type: Number, default: 0 },
  // Grosir Level 2
  qtyGrosir2: { type: Number, default: 0 },
  hargaGrosir2: { type: Number, default: 0 },
  // Grosir Level 3
  qtyGrosir3: { type: Number, default: 0 },
  hargaGrosir3: { type: Number, default: 0 },
  // Opsi Box
  hargaBox: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}));

// --- API ROUTES ---

// Dropdown Data
app.get('/api/jenis', async (req, res) => res.json(await Jenis.find()));
app.get('/api/satuan', async (req, res) => res.json(await Satuan.find()));

// Produk CRUD
app.get('/api/products', async (req, res) => {
  const data = await Product.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Berhasil disimpan" });
  } catch (err) {
    res.status(400).json({ message: "Gagal simpan! Kode mungkin duplikat." });
  }
});

app.put('/api/products/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Berhasil diupdate" });
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Berhasil dihapus" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));