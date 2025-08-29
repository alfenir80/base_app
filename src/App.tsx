// src/App.tsx
import './App.css';
import { useState } from 'react';
import Mesa from './components/Mesa';
import Modal from './components/Modal';

type MesaType = {
  numero: number;
  status: 'disponivel' | 'ocupada';
};

function App() {
  const [mesas, setMesas] = useState<MesaType[]>(
    Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      status: Math.random() > 0.5 ? 'disponivel' : 'ocupada',
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<MesaType | null>(null);  


  const handleClickMesa = (numero: number) => {
    const mesa = mesas.find((m) => m.numero === numero);
    if (mesa) {
      setSelectedMesa(mesa);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMesa(null);
  }

  return (
    <div className="container-geral">
      <h1>Gerenciamento de Mesas</h1>
      <div className="lista-mesas">
        {mesas.map((mesa) => (
          <Mesa
            key={mesa.numero}
            numero={mesa.numero}
            status={mesa.status}
            onClick={() => handleClickMesa(mesa.numero)}
          />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMesa ? `Mesa ${selectedMesa.numero}` : ''}
      >
        {selectedMesa && (
          <div>
            <p>Status: {selectedMesa.status}</p>
            {/* Aqui você pode adicionar mais detalhes ou ações para a mesa */}
          </div>
        )}
      </Modal>
    </div>

  );
}

export default App;