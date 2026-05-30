import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'

const getServerUrl = () => {
  const envServerUrl = import.meta.env.VITE_SERVER_URL?.trim()

  if (envServerUrl) {
    return envServerUrl.replace(/\/$/, "")
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8000"
    }

    return "https://talentlens-ai-5ore.onrender.com"
  }

  return "https://talentlens-ai-5ore.onrender.com"
}

export const ServerUrl = getServerUrl()

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()

  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>



    </Routes>
  )
}

export default App
