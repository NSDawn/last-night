import { useState } from 'react';
import './App.css';
import Phone from './components/main/Phone';
import DebugTooltip from './components/debug/DebugTooltip';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Phone />
      <DebugTooltip />
    </>
  )
}

export default App;
