import { useContext, useState, useEffect } from "react";
import { useUser } from '../components/providers/context.js';
import useBaseHooks from "../hooks/allHooks.js";
import axios from 'axios';

export default function AdminPage() {
    const numFlags = 20
    const { userInfo, setUserInfo } = useUser()
    const [spellName, setSpellName] = useState('')
    const [spellClass, setSpellClass] = useState('')
    const [spellType, setSpellType] = useState('')
    const [manaCost, setManaCost] = useState('')
    const [goldCost, setGoldCost] = useState('')
    const [ability, setAbility] = useState('')
    const [abilityDieRoll, setAbilityDieRoll] = useState('')
    const [description, setDescription] = useState('')
    const [flags, setFlags] = useState('')
    const [returnMessage, setReturnMessage] = useState('')
    const [testResponse, setTestResponse] = useState('')
    const [code, setCode] = useState('')
    const [id, setId] = useState(-1)

    const [petId, setPetId] = useState(-1);
    const [petName, setPetName] = useState('');
    const [petCost, setPetCost] = useState(-1);
    const [petFilePath, setPetFilePath] = useState('');
    const [petReturnMessage, setPetReturnMessage] = useState('')

    useBaseHooks()

    const handleFlagInput = () => {
        /* flags should be of form [[index1:val1], [index2:val2], ... [indexn, valn]] */
        let partsOfFlags = flags.split(",")        
        let flagArray = Array(numFlags).fill(0)
        partsOfFlags.forEach(function (item, i) {
            if (item != ''){
                let [indx, val] = item.split(":")
                flagArray[Number(indx)] = Number(val)
            }
        })

        return flagArray
    }

    const handleDieInput = (input) => {
        /* Die input should be of the form #d# aka 1d6 */
        let [num, die] = input.split('d')
        return [Number(num), Number(die)]
    }

    const handelPetSubmission = async () => {
        const params = {
            id: petId,
            name: petName,
            cost: petCost,
            filePath: petFilePath,
            code: code
        }

        await axios.post(`${process.env.REACT_APP_ENDPOINT}/addpet`, params)
        .then(res => setPetReturnMessage(<p className="success">{res.data}</p>))
        .catch(e => setPetReturnMessage(<p className="failure">{e.message}</p>))
    }

    const handleSubmission = async () => {
        const flagArray = handleFlagInput()
        const [numDie, Die] = handleDieInput(abilityDieRoll)
        const params = {
            name: spellName,
            id: id,
            type: spellType,
            class: spellClass,
            manaCost: manaCost,
            goldCost: goldCost,
            abilityBase: ability,
            abilityDie: Die,
            abilityNumDie: numDie,
            flags: flagArray,
            description: description,
            code: code
        }

        await axios.post(`${process.env.REACT_APP_ENDPOINT}/addspell`, params)
        .then(res => setReturnMessage(<p className="success">{res.data}</p>))
        .catch(e => setReturnMessage(<p className="failure">{e.message}</p>))
       
    }

    const handleTest = async () => {
        const response = await axios.get(`${process.env.REACT_APP_ENDPOINT}/test`, {})
        response.status === 200 ? setTestResponse(JSON.stringify(response.data)) : setTestResponse('Test API failed')
    }

    const loadPage = () => {
        if (userInfo.admin) {
            return (
                <>
                 <div className="admin-page-container">
                    {/* <div className="test-api-container">
                        <h2>Test API</h2>
                        <button className="test-api-button" onClick={ () => handleTest()}>Test</button>
                        <p></p>
                        {testResponse}
                    </div> */}
                    <div className="admin-column-container">
                        <h1 className="admin-column-item">Spell Creation</h1>
                        <label className="admin-column-item">Spell Name</label>
                        <input className="admin-column-item" type="text" id="name" onChange={(e) => setSpellName(e.target.value)}></input>

                        <label className="admin-column-item">Spell Id</label>
                        <input className="admin-column-item" type="text" id="id" onChange={(e) => setId(e.target.value)}></input>

                        <label className="admin-column-item">Spell Type (0,1,2 = Attack/Block/Passive)</label>
                        <input className="admin-column-item" type="text" id="spellType" onChange={(e) => setSpellType(e.target.value)}></input>

                        <label className="admin-column-item">Spell Class (0,1,2,3 = Fire/Water/Electric/Basic)</label>
                        <input className="admin-column-item" type="text" id="spellClass" onChange={(e) => setSpellClass(e.target.value)}></input>

                        <label className="admin-column-item">Mana Cost</label>
                        <input className="admin-column-item" type="text" id="manaCost" onChange={(e) => setManaCost(e.target.value)}></input>

                        <label className="admin-column-item">Gold Cost</label>
                        <input className="admin-column-item" type="text" id="goldCost" onChange={(e) => setGoldCost(e.target.value)}></input>

                        <label className="admin-column-item">Ability</label>
                        <input className="admin-column-item" type="text" id="ability" onChange={(e) => setAbility(e.target.value)}></input>

                        <label className="admin-column-item">Ability die roll</label>
                        <input className="admin-column-item" type="text" id="abilityDieRoll" onChange={(e) => setAbilityDieRoll(e.target.value)}></input>

                        <label className="admin-column-item">Description</label>
                        <input className="admin-column-item" type="text" id="description" onChange={(e) => setDescription(e.target.value)}></input>

                        <label className="admin-column-item">Flags</label>
                        <input className="admin-column-item" type="text" id="flags" onChange={(e) => setFlags(e.target.value)}></input>

                        <label className="admin-column-item">Code</label>
                        <input className="admin-column-item" type="text" id="code" onChange={(e) => setCode(e.target.value)}></input>

                        {returnMessage}
                        <button className="admin-column-item" onClick={() => handleSubmission()}>Submit Spell</button>
                    </div>

                    <div className="admin-column-container">
                        <h1 className="admin-column-item">Pet Creation</h1>
                        <label className="admin-column-item">Pet Id</label>
                        <input className="admin-column-item" type="text" id="petId" onChange={(e) => setPetId(e.target.value)}></input>

                        <label className="admin-column-item">Name</label>
                        <input className="admin-column-item" type="text" id="petName" onChange={(e) => setPetName(e.target.value)}></input>

                        <label className="admin-column-item">Pet Cost</label>
                        <input className="admin-column-item" type="text" id="petCost" onChange={(e) => setPetCost(e.target.value)}></input>

                        <label className="admin-column-item">File Path</label>
                        <input className="admin-column-item" type="text" id="petFilePath" onChange={(e) => setPetFilePath(e.target.value)}></input>

                        <label className="admin-column-item">Code</label>
                        <input className="admin-column-item" type="text" id="code" onChange={(e) => setCode(e.target.value)}></input>

                        {petReturnMessage}
                        <button className="admin-column-item" onClick={() => handelPetSubmission()}>Submit Pet</button>
                    </div>
                </div>
                </>
            )
        }

        return <h1>Account is not an admin. Access Denied</h1>
    }

    return (
        <>
        {loadPage()}
        </>
    )
}