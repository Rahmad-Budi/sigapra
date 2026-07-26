// =========================================================================
// 🌐 KABEL PENGHUBUNG FRONTEND -> BACKEND (API.JS)
// =========================================================================

async function panggilAPI(actionName, payload = {}) {
  try {
    const response = await fetch('/api/gas-bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: actionName, 
        ...payload 
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat memanggil API Bridge:", error);
    return { success: false, message: error.message };
  }
}
