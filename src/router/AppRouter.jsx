import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import RegistrarConsumoPage from '../pages/RegistrarConsumoPage';
import ConsumosListPage from '../pages/ConsumosListPage';
import TrasladosPage from '../pages/TrasladosPage';
import ReportesPage from '../pages/ReportesPage';
import UsuariosPage from '../pages/UsuariosPage';
import MaquinariaAdminPage from '../pages/MaquinariaAdminPage';
import RecepcionCombustiblePage from '../pages/RecepcionCombustiblePage';
import StockPage from '../pages/StockPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute> {/* 2. Envolver la página protegida */}<DashboardPage /></ProtectedRoute>}/>
      <Route path="/consumos/registrar" element={<ProtectedRoute><RegistrarConsumoPage /></ProtectedRoute>} />
      <Route path="/consumos" element={<ProtectedRoute><ConsumosListPage /></ProtectedRoute>} />
      <Route path="/traslados" element={<ProtectedRoute><TrasladosPage /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute><ReportesPage /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} />
      <Route path="/admin/maquinaria" element={<ProtectedRoute><MaquinariaAdminPage /></ProtectedRoute>} />
      <Route path="/recepciones/registrar" element={<ProtectedRoute><RecepcionCombustiblePage /></ProtectedRoute>} />
      <Route path="/reportes/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
    </Routes>
  );
}
export default AppRouter;