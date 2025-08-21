
import '../components/Mesa.css';

type StatusMesa = 'disponivel' | 'ocupada' ;

interface MesaProps {
    numero: number;
    status?: StatusMesa;
}

function Mesa({ numero, status }: MesaProps) {
    
    const statusClass = status ? `mesa-${status}` : '';

    return (
        <div className={`mesa ${statusClass}`}>
            <p className='numero-mesa'>Mesa {numero}</p>
            <span className='status-mesa'>Status: {status}</span>
        </div>
    );
}

export default Mesa;