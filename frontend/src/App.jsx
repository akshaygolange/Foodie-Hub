import React from 'react'
import { Toaster } from "react-hot-toast";

import AppRoutes from './routes/AppRoutes'


const App = () => {
  return (
   <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    <AppRoutes/>

   </>
  )
}

export default App
