import './App.css';
import 'antd/dist/reset.css';
import AppContext from './context/AppContext';
import PageIndex from './component/PageIndex';

function App() {
  return (
    <div className="App">
      <AppContext>
        <PageIndex />
      </AppContext>
    </div>
  );
}
export default App;
