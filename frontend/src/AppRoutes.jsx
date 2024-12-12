import { Route, Routes } from 'react-router-dom';
import { PublicLayout, Dashboard, WatchVideo } from './pages';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Dashboard /></PublicLayout>} />
      <Route path="/video/:title" element={<PublicLayout><WatchVideo /></PublicLayout>} />
      <Route path="*" element={<PublicLayout><Dashboard /></PublicLayout>} />
    </Routes>
  );
}

export default AppRoutes;
