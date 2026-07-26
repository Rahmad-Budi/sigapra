// File: api/gas-bridge.js
// Ini jalan di SERVER Vercel, jadi aman dari inspect element browser.

export default async function handler(req, res) {
  // Kita cuma terima request POST dari frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 1. Ambil URL dan Token dari Environment Variables Vercel
    const GAS_URL = process.env.GAS_API_URL;
    const SECRET_TOKEN = process.env.GAS_SECRET_TOKEN;

    if (!GAS_URL || !SECRET_TOKEN) {
      throw new Error("Konfigurasi Vercel Environment Variables belum diset, Bro!");
    }

    // 2. Ambil data yang dikirim dari file api.js di frontend
    const clientPayload = req.body;

    // 3. Gabungkan data frontend dengan Token Rahasia
    const securePayload = {
      ...clientPayload,
      token: SECRET_TOKEN // Token diselipkan di sisi server
    };

    // 4. Teruskan request ke Google Apps Script
    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(securePayload)
    });

    if (!gasResponse.ok) {
      throw new Error(`Gagal komunikasi dengan GAS. Status: ${gasResponse.status}`);
    }

    // 5. Tangkap balasan dari GAS dan kirim balik ke Frontend
    const data = await gasResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("❌ Error di Vercel Bridge:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
