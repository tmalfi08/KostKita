const express = require('express');
const router = express.Router();
const {
  getAllPembayaran,
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
} = require('../controllers/pembayaranController');

router.get('/', getAllPembayaran);
router.post('/', createPembayaran);
router.put('/:id', updatePembayaran);
router.delete('/:id', deletePembayaran);

module.exports = router;
