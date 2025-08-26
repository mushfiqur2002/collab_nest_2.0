
import { Route, Routes } from 'react-router-dom'
import './globals.css'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import { Applications, CreatePost, Home, People } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import Project from './_root/pages/Project'
function App() {

  return (
    <main className='flex dark-4 w-full h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='sign-in' element={<SignInForm />} />
          <Route path='sign-up' element={<SignUpForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />}/>
          <Route path='/all-users' element={<People/>}></Route>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/application' element={<Applications />} />
          <Route path='/project' element={<Project/>} />
        </Route>

      </Routes>
    </main>
  )
}

export default App
