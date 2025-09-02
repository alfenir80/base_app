// src/App.tsx
import './App.css';
import { useState } from 'react';
import Mesa from './components/Mesa';
import Modal from './components/Modal';
import Cardapio from './components/Cardapio';

type MesaType = {
  numero: number;
  status: 'disponivel' | 'ocupada';
};

type ItemMenuType = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
};

type OrderItemType = {
  id: number;
  item: ItemMenuType;
  quantidade: number;
};

const menu: ItemMenuType[] = [
  { id: 1, nome: 'Coxinha', preco: 5.0, categoria: 'Salgado' },
  { id: 2, nome: 'Brigadeiro', preco: 3.0, categoria: 'Doce' },
  { id: 3, nome: 'Refrigerante', preco: 4.0, categoria: 'Bebida' },
  { id: 4, nome: 'Pizza', preco: 20.0, categoria: 'Salgado' },
  { id: 5, nome: 'Sorvete', preco: 6.0, categoria: 'Doce' },
  { id: 6, nome: 'Suco', preco: 5.0, categoria: 'Bebida' },
]

function App() {
  const [mesas, setMesas] = useState<MesaType[]>(
    Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      status: Math.random() > 0.5 ? 'disponivel' : 'ocupada',
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<MesaType | null>(null);  
  const [orders, setOrders] = useState<OrderItemType[]>([]);

  const handAddItemToOrder = (item: ItemMenuType) => {

    const existingOrder = orders.find((order) => order.item.id === item.id);
    if (existingOrder) {
      setOrders(orders.map((order) =>
        order.item.id === item.id
          ? { ...order, quantidade: order.quantidade + 1 }
          : order
      ));
    } else {
      setOrders([...orders, { id: orders.length + 1, item, quantidade: 1 }]);
    }
  };




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
    <>
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
              <div className='modal-body'>
                <p>Status: {selectedMesa.status}</p>
                {/* Aqui você pode adicionar mais detalhes ou ações para a mesa */}
                <Cardapio itens={menu} onAddItem={handAddItemToOrder}/>
                <h3>Pedido Atual:</h3>
                {orders.length === 0 ? (
                  <p>Nenhum item adicionado.</p>
                ) : (
                  <ul>
                    {orders.map((order) => (
                      <li key={order.id}>
                        {order.item.nome} - Quantidade: {order.quantidade} - Total: R$ {(order.item.preco * order.quantidade).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Modal>
        </div>
     </>   
  );
}

export default App;