import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { WritePage } from './pages/WritePage';
import { PostPage } from './pages/PostPage';
import { CategoryPage } from './pages/CategoryPage';
import { EditPage } from './pages/EditPage';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
