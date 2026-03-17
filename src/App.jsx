import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/Clientes/ClientesPage';
import CampanhasPage from './pages/Campanhas/CampanhasPage';
import TransacoesPage from './pages/Transacoes/TransacoesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/campanhas" element={<CampanhasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
