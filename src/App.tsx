import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import ComparePage from './pages/ComparePage';
import DocumentsPage from './pages/DocumentsPage';
import TrackerPage from './pages/TrackerPage';
import AboutPage from './pages/AboutPage';
import CasesPage from './pages/CasesPage';
import NotFoundPage from './pages/NotFoundPage';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
