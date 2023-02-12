import './App.css';
import { ChatPanel } from './components/chatpane';
import { ChatWindow } from './components/chatwindow';

function App() {
  return (
    <div className="App">
      <div className='chatlist'>
        <ChatPanel></ChatPanel>
      </div>
      <div className='chatwindow'>
        <ChatWindow></ChatWindow>
      </div>
    </div>
  );
}

export default App;
