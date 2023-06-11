import './App.css';
import 'antd/dist/reset.css';
import PageIndex from './component/page/PageIndex';
import { createContext, useState } from 'react';

const AppContext = createContext()

function App() {
  const [user, setUser] = useState()

  return (
    <div className="App">
      <AppContext.Provider value={{user, setUser}}>
        <PageIndex />
      </AppContext.Provider>
    </div>
  );
}

export {AppContext}

export default App;
