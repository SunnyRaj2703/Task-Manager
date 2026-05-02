import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setSession = (token, userData) => {
    if (token) {
      localStorage.setItem("ttm_token", token)
      localStorage.setItem("ttm_user", JSON.stringify(userData))
      setUser(userData)
      return
    }
    localStorage.removeItem("ttm_token")
    localStorage.removeItem("ttm_user")
    setUser(null)
  }

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload)
    setSession(response.data.token, response.data.user)
    return response.data
  }

  const signup = async (payload) => {
    const response = await api.post("/auth/signup", payload)
    setSession(response.data.token, response.data.user)
    return response.data
  }

  const logout = () => {
    setSession(null)
    navigate("/login")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("ttm_user")
    const token = localStorage.getItem("ttm_token")
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
