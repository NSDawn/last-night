import { useState } from 'react';
import './App.css';
import Phone from './components/main/Phone';
import DebugTooltip from './components/debug/DebugTooltip';
import Comic from './components/main/Comic';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Comic />
      <Phone />
      <DebugTooltip />
    </>
  )
}

export default App;
