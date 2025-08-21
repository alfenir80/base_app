import './App.css';
import React from 'react';
import Mesa from './components/Mesa';

function App() {

  const mesas = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="container">
      <h1>Restaurante</h1>
      <div className="lista-mesas">
        {mesas.map((numero, index) => (
          <Mesa key={numero} numero={numero} 
            status={index % 2 === 0 ? 'ocupada' : 'disponivel'}/>
        ))}
      </div>
    </div>
  );
}

export default App;