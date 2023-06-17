import React, { createContext, useState } from 'react'

export const UserContext = createContext()
export default function AppContext({ children }) {
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}
