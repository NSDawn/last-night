import { useState } from 'react';
import './App.css';
import Phone from './components/main/Phone';
import DebugTooltip from './components/debug/DebugTooltip';
import Comic from './components/main/Comic';
import { useGlobal } from './GlobalContextHandler';
import Menu from './components/main/Menu';
import AudioManager from "./components/elements/AudioManager"

function App() {
  const G = useGlobal();
  const [gameState, _] = G.gameState;

  return (
    <>
      {gameState === "menu" ?
        <Menu />
      : <>
      <Comic />
      <Phone />
      {/* <DebugTooltip /> */}
      </>}
    </>
  )
}

export default App;
