import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import QueryContext from './context/QueryContext'
import AuthProvider from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import AlertMessage from './components/shared/AlertMessage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryContext>
      <AuthProvider>
        <AlertProvider>
          <div className='flex flex-center flex-col w-full h-full'>
            <AlertMessage />
            <App />
          </div>
        </AlertProvider>
      </AuthProvider>
    </QueryContext>
  </BrowserRouter>
)
