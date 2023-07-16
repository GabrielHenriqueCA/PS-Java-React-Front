import { Link } from "react-router-dom"
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
        <h2> 
            <Link to={'/'}> Banco Supera </Link>
        </h2>
        <ul>
            <li>
                 <Link to={'/'}> Inicio</Link>
            </li>
            <li>
                <Link to={'/newAccount'} className="new-btn"> Nova Conta</Link>
            </li>
            <li>
                <Link to={'/newTransaction'} className="new-btn" > Nova Transação</Link>
            </li>
            <li>
                <Link to={'/filterTransaction'} className="new-btn" > Filtrar Transações</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar