
import '../components/Mesa.css';

type StatusMesa = 'disponivel' | 'ocupada' ;

interface MesaProps {
    numero: number;
    status?: StatusMesa;
    onClick?: () => void;
}

function Mesa({ numero, status, onClick}: MesaProps) {
    
    const statusClass = status ? `mesa-${status}` : '';

    return (
        <div className={`mesa ${statusClass}`} onClick={onClick}>
            <p className='numero-mesa'>Mesa {numero}</p>
            <span className='status-mesa'>Status: {status}</span>
        </div>
    );
}

export default Mesa;