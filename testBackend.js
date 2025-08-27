import axios from "axios";

const API_URL = "https://ehipay-backend-production.up.railway.app";

async function testBackend() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log("✅ Backend response:", response.data);
  } catch (error) {
    console.error("❌ Error connecting to backend:", error.message);
  }
}

testBackend();
