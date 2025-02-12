import { useState, useEffect, useContext } from "react"
import { useNavigate } from 'react-router-dom';
import useOnlineStatus from "../hooks/onlineStatus.js"
import Spell from "../components/spell"
import Context from '../components/providers/context.js'
import axios from 'axios'
import useNavigationGuard from "../hooks/useNavigationGuard.js"
import { Button, Stack } from "@mui/material";

// NEED TO UPDATE TOTAL SPELLS WHEN ADDING MORE SPELLS 
const TOTAL_SPELLS = 22
export default function Shop() {
    const baseNumRows = 2
    const [numRows, setNumRows] = useState(baseNumRows)
    const [userInfo, setUserInfo] = useContext(Context)
    const [numSpells, setNumSpells] = useState(TOTAL_SPELLS - userInfo.spellsOwned.length)
    const [selectedSpell, setSelectedSpell] = useState(null)
    const [buttonsVisable, setButtonsVisable] = useState(false)
    const navigate = useNavigationGuard();

    useOnlineStatus()

    useEffect(() => {
        setNumSpells(TOTAL_SPELLS - userInfo.spellsOwned.length)
    }, [userInfo])


    const getSpellPartitions = () => {
        let spellPartition = []
        let currentSpellRow = []
        const spellsInRow = Math.ceil(numSpells / numRows)
        const spellsInShop = [...Array(TOTAL_SPELLS).keys()].filter((x) => !(userInfo.spellsOwned.includes(x)))
        for (let i = 0; i < numSpells; i++) {
            if (currentSpellRow.length === spellsInRow) {
                spellPartition.push(currentSpellRow)
                currentSpellRow = []
            }
            if (!userInfo.spellsOwned.includes(i.toString())) {
                currentSpellRow.push(spellsInShop[i])
            }
        }
        
        if (spellPartition.length > 0) {spellPartition.push(currentSpellRow)}
        return spellPartition
    }

    const selectSpell = (spellId) => {
        setSelectedSpell(spellId)
        setButtonsVisable(true)
    }

    const getSpellCost = async (spellId) => {
        const spell = await axios.get(`${process.env.REACT_APP_ENDPOINT}/spell`, {params: {id: spellId}})
        .catch(e => console.log(e))
        const price = spell.data.spell.goldCost
        return price
    }

    const buySpell = async (spellId) => {
        const spellCost = await getSpellCost(spellId)
        if (spellCost > userInfo.money) {
            alert("You do not have enough gold to purchase this spell")
        } else {
            const params = {username:userInfo.username, password:userInfo.password, spellId:spellId}
            const res = await axios.post(`${process.env.REACT_APP_ENDPOINT}/buySpell`, params)
            if (res.status === 200) {
                setUserInfo(res.data)
            } else {
                console.log(res.data)
            }

        }

        setSelectedSpell(null)
        setButtonsVisable(false)
    }

    const unselectSpell = () => {
        setSelectedSpell(null)
        setButtonsVisable(false)
    }


    const spellButton = (spellId, index) => {
        return (
            <div key={index} className="spellForSale">
              <button className="spellForSaleButton" onClick={() => selectSpell(spellId)}>
                <Spell key={spellId} spellId={spellId} showCost={true} />
              </button>
              {buttonsVisable && selectedSpell === spellId && (
                <div className="spawned-buttons-container">
                    <div className="spawned-buttons">
                        <Button variant="contained" onClick={() => buySpell(spellId)}> Buy </Button>
                        <Button variant="outlined" onClick={() => unselectSpell()}> X </Button>
                    </div>
                </div>
              )}
            </div>
          )
    }

    const displaySpells = () => {
        const spellPartition = getSpellPartitions()
        return (
            <div className="shop-spells-container">
                {spellPartition.map((spells, index) => 
                    <div key={index} className="spell-row">
                        {spells.map((spell, index) => spellButton(spell, index))}
                    </div>
                )}
            </div>
        )
    }


    return (
        <>
        <div className="shopRow">
            <Button variant="contained" onClick={() => navigate('/home')}>Home</Button>
            <h1 className="shop-title">Shop</h1>
            <h2 className="shop-gold-cost">Gold: {userInfo.money}</h2>
        </div>
        <div className="numrows-container">
            <label>Rows: </label>
            {numRows}
            <Button variant="outlined" onClick={() => setNumRows(Math.min(numRows + 1, 5))}>+</Button>
            <Button variant="outlined" onClick={() => setNumRows(Math.max(numRows - 1, 2))}>-</Button>
        </div>
        {displaySpells()}
        </>
    )
}