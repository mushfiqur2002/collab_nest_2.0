
import { Route, Routes } from 'react-router-dom'
import './globals.css'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import { Applications, CreatePost, Home, People } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import Project from './_root/pages/Project'
import ProjectDtls from './_root/pages/ProjectDtls'
import PrivateLayout from './_root/PrivateLayout'
function App() {

  return (
    <main className='flex w-full h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout isAuntenticated={false} />}>
          <Route path='sign-in' element={<SignInForm />} />
          <Route path='sign-up' element={<SignUpForm />} />
        </Route>

        {/* private routes */}
        <Route element={<PrivateLayout isAuntenticated={false} />}>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='/all-users' element={<People />}></Route>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/application' element={<Applications />} />
            <Route path='/project' element={<Project />} />
          </Route>

          <Route path='/projects/:id' element={<ProjectDtls />} />
        </Route>

      </Routes>
    </main>
  )
}

export default App
