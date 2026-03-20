import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/campanhas', label: 'Campanhas' },
  { to: '/transacoes', label: 'Transações' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-title">Casinha Clube</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>CasinhaClubeDB</span>
      </div>
    </aside>
  );
}
