import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FabrikaList from './components/FabrikaList';
import ProduktiList from './components/ProduktiList';
import PunetoretList from './components/PunetoretList';
import KlientiList from './components/KlientiList';
import PorosiaList from './components/PorosiaList';
import StokuList from './components/StokuList';
import PagesaList from './components/PagesaList';
import FaturaList from './components/FaturaList';
import DergesaList from './components/DergesaList';
import RaportiList from './components/RaportiList';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fabrikat':
        return <FabrikaList />;
      case 'produktet':
        return <ProduktiList />;
      case 'punetoret':
        return <PunetoretList />;
      case 'klientet':
        return <KlientiList />;
      case 'porosite':
        return <PorosiaList />;
      case 'stoku':
        return <StokuList />;
      case 'pagesat':
        return <PagesaList />;
      case 'faturat':
        return <FaturaList />;
      case 'dergesat':
        return <DergesaList />;
      case 'raportet':
        return <RaportiList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

