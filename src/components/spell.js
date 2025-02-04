import { useContext, useState } from "react"
import Converter from "../utils/converter"
import SpellsContext from "./providers/spellContext"
/* Spell is designed to wrapped in a button but this isnt strictly necessary */

export default function Spell(props) {
    const spellId = props.spellId || 0;
    const showCost = props.showCost || false;
    const [spellContext, setSpellContext] = useContext(SpellsContext);
    const [spellObj, setSpellObj] = useState(spellContext[spellId]);
    const converter = new Converter();

    const costElement = () => {
        if (showCost) {
            return (
                <>
                <label>Cost: {spellObj.goldCost}</label>
                </>
            )
        }
        return (<></>)
    }

    return (
        <div className="spellComponent">
            <div className="spellHeader">
                <h1>{spellObj.name}</h1>
                <div className="spellCost">{costElement()}</div>
            </div>
            <div className="spellClassInfo">
                <div className="spellInfoLeft">
                    <div>Spell Class: {converter.spellClassToString(spellObj.class)}</div>
                    <div>Spell Type: {converter.spellTypeToString(spellObj.type)}</div>
                    <div>Mana Cost: {spellObj.manaCost}</div>
                </div>
                <div className="spellDetailsRight">X = {spellObj.abilityBase} + {spellObj.abilityNumDie}d{spellObj.abilityDie}</div>
            </div>
            <div className="spellDescription">
                <p>{spellObj.description}</p>
            </div>
        </div>
    )
}