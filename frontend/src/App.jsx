import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { store } from './app/store';
import { ThemeProvider } from './hooks/useThemeToggle';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#18181b',
                color: '#ffffff',
                fontSize: '0.875rem',
                borderRadius: '6px',
                border: '1px solid #27272a'
              },
              // Dark mode toasts
              success: {
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
                },
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
