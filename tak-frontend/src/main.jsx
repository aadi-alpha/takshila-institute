
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { BranchIdProvider } from './Context/BranchContext.jsx'

createRoot(document.getElementById('root')).render(
    <BranchIdProvider >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </BranchIdProvider>


)
// staff salary 
// students fees (payment mode) date month amt 
// teachers record taechers data (  )
// students attendance ///

// super admin ( register  branch admins  and can delete those admins  ) (login)
// admin do all works enter teachers receptionists and view students edit students of his branch salary record fees record ( ) attendance (login)
// receptionists  login( do all works  enter teachers and view students edit students of his branch salary record fees record ( ) attendance ( ) )
// teachers only record and paymnet status  
// students  (no login)  only record 
