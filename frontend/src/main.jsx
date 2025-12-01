import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
//import ChatProvider from "./context/ChatProvider.jsx";


const persistor=persistStore(store)

createRoot(document.getElementById("root")).render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
      <Toaster />
    </Provider>
  
);
