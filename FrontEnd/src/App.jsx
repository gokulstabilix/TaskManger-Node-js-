import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TasksPage />} />
        {/* Additional routes like /tasks/:id can be added here */}
      </Route>
    </Routes>
  );
}

export default App;
