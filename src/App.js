import './App.css';
import Router from './components/router'
import { UserProvider } from './components/providers/context'
import Online from './components/providers/online'
import { GameProvider }  from './components/providers/gameContext';
import SpellsContext from './components/providers/spellContext';
import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [spellContext, setSpellContext] = useState(null)
  const [online, setOnline] = useState(false)

  useEffect(() => {
    if (!spellContext) {
      createSpellContext();
    }
  }, [])

  const createSpellContext = async () => {
    let newSpellContext = {}; // Ensure it starts as an object

    try {
        const numSpells = await axios.get(`${process.env.REACT_APP_ENDPOINT}/numSpells`);
        if (numSpells.status !== 200) throw new Error("Failed to fetch spell count");

        for (let i = 0; i < numSpells.data.number; i++) {
            const spell = await axios.get(`${process.env.REACT_APP_ENDPOINT}/spell`, { params: { id: i } });
            if (!spell || !spell.data) throw new Error("Failed to fetch spell");
            newSpellContext[i] = spell.data.spell;
        }

        setSpellContext(newSpellContext);
        console.log("Spell context initialized:", newSpellContext);
    } catch (error) {
        console.error("Error creating spell context:", error);
    }
  };

  return ( spellContext && 
    <Online.Provider value={[online, setOnline]}>
      <UserProvider>
        <GameProvider>
          <SpellsContext.Provider value={[spellContext, setSpellContext]}>
            <Router />
          </SpellsContext.Provider>
        </GameProvider>
      </UserProvider>
    </Online.Provider>
  );
}

export default App;
