import Header from './components/Header.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-container">
        <AnalysisPage />
      </main>
      <footer className="app-footer">
        © Solar & Wind Deployment Intelligence Platform
      </footer>
    </div>
  );
}

export default App;
