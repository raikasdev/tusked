import { useEffect, useState } from 'preact/hooks';

import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import IndexPage from './pages/IndexPage';

// Always import default theme (to avoid "blinking")
import './themes/aves/theme.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
]);

// TODO: save instance data to somewhere, for max character length
export function App() {
  const [theme] = useState('aves');

  useEffect(() => {
    document.body.dataset.theme = theme;

    if (theme === 'aves') return; // Default theme is already imported
    import(`./themes/${theme}/theme.scss`); // Dynamically import new theme
  }, [theme]);

  return (
    <div className="app-inner">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}
