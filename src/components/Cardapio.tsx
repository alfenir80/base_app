import React from "react";

type ItemMenuType = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

interface CardapioProps {
  menu: ItemMenuType[]; 
  onAddItem: (item: ItemMenuType) => void;
}

const Cardapio: React.FC<CardapioProps> = ({ menu , onAddItem}) => {
  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-md">
        <h3 className="text-2xl font-semibold mb-4 text-blue-300">Cardápio</h3>
        <ul>
          {menu.map((item) => (
            <li 
              key={item.id} 
              onClick={() => onAddItem(item)}
              className="flex justify-between items-center bg-gray-700 p-4 mb-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors duration-200"
            >
              <span>{item.nome}</span>
              <span className="font-bold text-green-400">R$ {item.preco.toFixed(2)}</span>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default Cardapio;