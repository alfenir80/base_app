
import { useState, useEffect } from 'react'; // Importa useEffect
import Mesa from '../components/Mesa';
import Modal from '../components/Modal';
import Cardapio from '../components/Cardapio';

// --- Interfaces e Tipos (mantidos como antes) ---
type StatusMesa = 'disponivel' | 'ocupada';

interface MesaType {
  numero: number;
  status: StatusMesa;
  order: OrderItemType[];
}

interface ItemMenuType {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

interface OrderItemType {
  id: number;
  item: ItemMenuType;
  quantidade: number;
}
// --- Fim das Interfaces ---

// --- Dados do Menu (mantidos como antes) ---
const menu: ItemMenuType[] = [
  { id: 1, nome: 'Coxinha', preco: 5.0, categoria: 'Salgado' },
  { id: 2, nome: 'Brigadeiro', preco: 3.0, categoria: 'Doce' },
  { id: 3, nome: 'Refrigerante', preco: 4.0, categoria: 'Bebida' },
  { id: 4, nome: 'Pizza', preco: 20.0, categoria: 'Salgado' },
  { id: 5, nome: 'Sorvete', preco: 6.0, categoria: 'Doce' },
  { id: 6, nome: 'Suco', preco: 5.0, categoria: 'Bebida' },
];
// --- Fim dos Dados do Menu ---

function GerenciadorPedidosPage() {
  // --- Estados ---
  const [mesas, setMesas] = useState<MesaType[]>(
    Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      status: Math.random() > 0.5 ? 'disponivel' : 'ocupada',
      order: [],
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<MesaType | null>(null);
  // --- Fim dos Estados ---

  // --- Funções de Manipulação ---
  const handleClickMesa = (numero: number) => {
    const mesaEncontrada = mesas.find((m) => m.numero === numero);

    if (mesaEncontrada) {
      // Atualiza o status da mesa e o estado geral 'mesas'
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
      // Define a mesa selecionada para o modal e abre o modal
      setSelectedMesa(mesaEncontrada); // Define a mesa que foi clicada
      setIsModalOpen(true);
    }
  };
  
  const handAddItemToOrder = (item: ItemMenuType) => {
    if (!selectedMesa) return;

    let mesaAtualizadaNoSet: MesaType | null = null; // Usaremos para atualizar selectedMesa

    setMesas((prevMesas) => {
      const updatedMesasArray = prevMesas.map((mesa) => {
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
          mesaAtualizadaNoSet = updatedMesa; // Armazena a mesa que foi modificada
          return updatedMesa;
        }
        return mesa; 
      });
      return updatedMesasArray;
    });

    // A atualização de selectedMesa será feita no useEffect para garantir sincronia
    // setSelectedMesa(mesaAtualizadaNoSet); // REMOVIDO AQUI
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMesa(null); // Limpa a mesa selecionada ao fechar
  }
  // --- Fim das Funções de Manipulação ---

  // --- EFEITO COLATERAL PARA SINCRONIZAR SELECTEDMESA COM MESAS ---
  // Este useEffect garante que 'selectedMesa' reflita o estado atual de 'mesas'
  // sempre que 'mesas' for atualizado e 'selectedMesa' ainda estiver definido.
  useEffect(() => {
    if (selectedMesa && mesas.length > 0) {
      // Encontra a mesa mais recente no array 'mesas'
      const mesaAtual = mesas.find(m => m.numero === selectedMesa.numero);
      // Atualiza selectedMesa apenas se a mesa encontrada for diferente da mesa atual no estado
      // Isso evita um loop infinito se a mesa não tiver mudado
      if (mesaAtual && JSON.stringify(mesaAtual) !== JSON.stringify(selectedMesa)) {
        setSelectedMesa(mesaAtual);
      }
    }
  }, [mesas, selectedMesa]); // Executa quando 'mesas' ou 'selectedMesa' mudam

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
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Pedido Atual:</h2>
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
          </div>
          <Cardapio menu={menu} onAddItem={handAddItemToOrder} />
        </Modal>
      )}
    </div>
  );
}

export default GerenciadorPedidosPage;