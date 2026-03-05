const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  jenis: String,
  satuan: String,
  hargaPcs: { type: Number, default: 0 },
  // Skema Grosir
  qty2: { type: Number, default: 0 },
  harga2: { type: Number, default: 0 },
  qty3: { type: Number, default: 0 },
  harga3: { type: Number, default: 0 },
  // Skema Satuan Bertingkat
  hargaRenteng: { type: Number, default: 0 },
  hargaBox: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);