import { Signup } from "./Signup"
import { Login } from "./Login"
import { Dashboard } from "./Dashboard"
import {BrowserRouter, Routes, Route} from "react-router-dom"



export const Apps = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
