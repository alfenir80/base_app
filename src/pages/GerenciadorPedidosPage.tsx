
import { useState } from 'react';
import './GerenciadorPedidosPage.css'
import Mesa from '../components/Mesa';
import Modal from '../components/Modal';
import Cardapio from '../components/Cardapio';

type MesaType = {
  numero: number;
  status: 'disponivel' | 'ocupada';
  order: OrderItemType[];
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
];

function GerenciadorPedidosPage() {
  const [mesas, setMesas] = useState<MesaType[]>(
    Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      status: Math.random() > 0.5 ? 'disponivel' : 'ocupada',
      order: [],
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<MesaType | null>(null);

  const handleClickMesa = (numero: number) => {
    const mesaEncontrada = mesas.find((m) => m.numero === numero);

    if (mesaEncontrada) {
        setMesas((prevMesas) =>
          prevMesas.map((m) =>
            m.numero === numero
              ? {
                  ...m,
                  status: m.status === 'disponivel' ? 'ocupada' : 'disponivel',
                }
              : m
          )
        );
    }
    
    setSelectedMesa(mesaEncontrada || null);
    setIsModalOpen(true);
  };

  const handAddItemToOrder = (item: ItemMenuType) => {
    if (!selectedMesa) return;

    // Use uma variável para armazenar a nova versão da mesa que está sendo atualizada
    let updatedSelectedMesa: MesaType | null = null;

    setMesas(
      mesas.map((mesa) => {
        if (mesa.numero === selectedMesa.numero) {
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
          
          const updatedMesa = { ...mesa, order: updatedOrders };
          updatedSelectedMesa = updatedMesa; // <--- Armazena a nova mesa aqui
          return updatedMesa;
        }
        return mesa;
      })
    );

    // ATUALIZAMOS O ESTADO 'selectedMesa' COM A NOVA VERSÃO
    setSelectedMesa(updatedSelectedMesa);   
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMesa(null);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Pedidos</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {mesas.map((mesa) => (
          <Mesa key={mesa.numero} numero={mesa.numero} status={mesa.status} onClick={() => handleClickMesa(mesa.numero)} />
        ))}
      </div>

      {isModalOpen && selectedMesa && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Mesa ${selectedMesa.numero} - ${selectedMesa.status === 'disponivel' ? 'Disponível' : 'Ocupada'}`}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Pedido Atual:</h2>
            {selectedMesa.order.length === 0 ? (
              <p>Nenhum item no pedido.</p>
            ) : (
              <ul>
                {selectedMesa.order.map((orderItem) => (
                  <li key={orderItem.id}>
                    {orderItem.item.nome} x {orderItem.quantidade} - R$ {(orderItem.item.preco * orderItem.quantidade).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Cardapio itens={menu} onAddItem={handAddItemToOrder} />
        </Modal>
      )}
    </div>
  );
}

export default GerenciadorPedidosPage;