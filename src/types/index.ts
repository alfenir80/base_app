export type StatusMesa = 'disponivel' | 'ocupada';

export interface ItemMenuType {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

export interface OrderItemType {
  id: number;
  item: ItemMenuType;
  quantidade: number;
}

export interface MesaType {
  numero: number;
  status: StatusMesa;
  order: OrderItemType[];
}
