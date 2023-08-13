import React, { createContext, useState } from 'react'

export const UserContext = createContext()
export default function AppContext({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setLoading] = useState(false)

  return (
    <UserContext.Provider value={{user, setUser, isLoading, setLoading}}>
      {children}
    </UserContext.Provider>
  )
}
