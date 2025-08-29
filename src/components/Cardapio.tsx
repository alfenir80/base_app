import React from "react";
import './Cardapio.css';

type ItemMenuType = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

interface CardapioProps {
  itens: ItemMenuType[];
}

const Cardapio: React.FC<CardapioProps> = ({ itens }) => {
  return (
    <div className="cardapio">
        <h3>Cardápio</h3>
        <ul>
          {itens.map((item) => (
            <li key={item.id}>
              {item.nome} - R$ {item.preco.toFixed(2)} ({item.categoria})
            </li>
          ))}
        </ul>
    </div>
  );
}

export default Cardapio;