
import { Route, Routes } from 'react-router-dom'
import './globals.css'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import { Applications, CreatePost, Home, People } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import Project from './_root/pages/Project'
import PrivateLayout from './_root/PrivateLayout'
import ProjectDashboardLayout from './_root/ProjectDashboardLayout'
import ProjectDashBoard from './components/shared/ProjectDashBoard'
import ProjectTaskBoard from './components/shared/ProjectTaskBoard'
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

          {/* main layout  */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='/all-users' element={<People />}></Route>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/application' element={<Applications />} />
            <Route path='/project' element={<Project />} />
          </Route>

          {/* project dashboard layout  */}
          <Route element={<ProjectDashboardLayout />}>
            <Route index path='/projects' element={<ProjectDashBoard />} />
            <Route path='/projects/tasks' element={< ProjectTaskBoard />} />
          </Route>
        </Route>

      </Routes>
    </main>
  )
}

export default App
