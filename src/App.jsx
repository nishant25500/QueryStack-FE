import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionDetails from './pages/QuestionDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}