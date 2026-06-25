import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

// Configuração do WebSocket (Socket.io)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Rota de teste básica
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SaaS Gerenciador de Pedidos API rodando!' });
});

// Eventos de WebSocket
io.on('connection', (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Simula o Garçom enviando um pedido e avisando a cozinha
  socket.on('novo_pedido', (data) => {
    console.log('Novo pedido recebido:', data);
    // Emite para a tela da cozinha
    socket.broadcast.emit('atualizacao_cozinha', data);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
