import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WordProvider } from './context/WordContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import WordPool from './pages/WordPool';
import TranslateDrawer from './components/TranslateDrawer';

function App() {
  return (
    <WordProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pool" element={<WordPool />} />
              <Route path="/practice" element={<Practice />} />
            </Routes>
          </main>
          <TranslateDrawer />
        </div>
      </Router>
    </WordProvider>
  );
}

export default App;
