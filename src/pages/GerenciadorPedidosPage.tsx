import { useState } from 'react';
import Mesa from '../components/Mesa';
import Modal from '../components/Modal';
import Cardapio from '../components/Cardapio';
import type { MesaType, ItemMenuType } from '../types';
import { menu } from '../data/menuData';

function GerenciadorPedidosPage() {
  // --- Estados ---
  const [mesas, setMesas] = useState<MesaType[]>(
    Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      status: 'disponivel', // Começam disponíveis
      order: [],
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMesaId, setSelectedMesaId] = useState<number | null>(null);
  // --- Fim dos Estados ---

  // Deriva a mesa selecionada a partir do estado principal
  const selectedMesa = mesas.find(m => m.numero === selectedMesaId) || null;

  // --- Funções de Manipulação ---
  const handleClickMesa = (numero: number) => {
    setSelectedMesaId(numero);
    setIsModalOpen(true);
  };
  
  const handAddItemToOrder = (item: ItemMenuType) => {
    if (!selectedMesaId) return;

    setMesas((prevMesas) => {
      return prevMesas.map((mesa) => {
        if (mesa.numero === selectedMesaId) {
          const existingOrderItem = mesa.order.find((order) => order.item.id === item.id);
          let updatedOrders;

          if (existingOrderItem) {
            updatedOrders = mesa.order.map((order) =>
              order.item.id === item.id
                ? { ...order, quantidade: order.quantidade + 1 }
                : order
            );
          } else {
            updatedOrders = [...mesa.order, { id: Date.now(), item, quantidade: 1 }];
          }
          
          return { 
            ...mesa, 
            order: updatedOrders,
            status: 'ocupada' // Muda para ocupada ao adicionar item
          };
        }
        return mesa; 
      });
    });
  };

  const handleLiberarMesa = () => {
    if (!selectedMesaId) return;

    setMesas((prevMesas) => 
      prevMesas.map(mesa => 
        mesa.numero === selectedMesaId 
          ? { ...mesa, status: 'disponivel', order: [] }
          : mesa
      )
    );
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMesaId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-400">Gerenciamento de Mesas e Pedidos</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {mesas.map((mesa) => (
          <Mesa 
            key={mesa.numero} 
            mesa={mesa}
            onClick={() => handleClickMesa(mesa.numero)} 
          />
        ))}
      </div>

      {isModalOpen && selectedMesa && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={`Mesa ${selectedMesa.numero} - ${selectedMesa.status === 'disponivel' ? 'Disponível' : 'Ocupada'}`}
        >
          <div className="p-4 bg-gray-800 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-300">Pedido Atual:</h2>
              {selectedMesa.order.length > 0 && (
                <button 
                  onClick={handleLiberarMesa}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold transition-colors"
                >
                  Fechar Conta
                </button>
              )}
            </div>
            
            {selectedMesa.order.length === 0 ? (
              <p className="text-gray-400">Nenhum item no pedido.</p>
            ) : (
              <ul>
                {selectedMesa.order.map((orderItem) => (
                  <li key={orderItem.id} className="border-b border-gray-700 py-2 last:border-b-0 flex justify-between items-center">
                    <span className="text-lg">{orderItem.item.nome}</span>
                    <span className="text-gray-400">x {orderItem.quantidade}</span>
                    <span className="font-bold text-green-400">R$ {(orderItem.item.preco * orderItem.quantidade).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {selectedMesa.order.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-400">
                  R$ {selectedMesa.order.reduce((acc, orderItem) => acc + (orderItem.item.preco * orderItem.quantidade), 0).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <Cardapio menu={menu} onAddItem={handAddItemToOrder} />
        </Modal>
      )}
    </div>
  );
}

export default GerenciadorPedidosPage;