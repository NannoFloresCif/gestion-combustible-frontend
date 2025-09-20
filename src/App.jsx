import AppRouter from './router/AppRouter';
import Header from './components/Header';

function App() {
  return (
    <div className="app-container">
      
          {/* Reemplaza el <header> anterior por el nuevo componente */}
          <Header />
          <main className="main-content">
            <AppRouter />
          </main>
    </div>
  );
}

export default App
