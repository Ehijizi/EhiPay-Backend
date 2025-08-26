import net from "net";

const server = net.createServer(() => {});
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`✅ Port ${PORT} is available and server is listening!`);
});

server.on("error", (err) => {
  console.error("❌ Error binding to port:", err.message);
});
