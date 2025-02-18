import CharacterStats from "../components/charcterComponents/characterStats"
import CharacterCustomization from "../components/charcterComponents/characterCustomization"
import { useUser } from "../components/providers/context.js"
import axios from 'axios'
import Converter from "../utils/converter"
import { useContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from "@mui/material"
import useBaseHooks from "../hooks/allHooks.js";


export default function CharCreation() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useUser()
    const [userClass, setUserClass] = useState(0)
    const [returnMessage, setReturnMessage] = useState('')
    const converter = new Converter()

    useBaseHooks();

    useEffect(() => {
        updateUserContext()
    }, [userClass])

    const updateUserContext = () => {
        userInfo["class"] = userClass
        setUserInfo(userInfo)
    }

    const handSubmitProfileResponse = (res) => {
        if (res.status === 201) {
            return <p className="success">{res.data}</p>
        }
        navigate('/home') 
    }

    const submitProfile = async (e) => {
        e.preventDefault()

        const params = {
            userInfo: userInfo
        }

        await axios.post(`${process.env.REACT_APP_ENDPOINT}/submitprofile`, params)
        .then(res => setReturnMessage(handSubmitProfileResponse(res)))
        .catch(e => setReturnMessage(<p className="failure">{e.message}</p>))
    }
    
    return (
        <>
        <div className="charCreationPage">
            <div className="charCreationUserDiv">
               
                    <Stack 
                    spacing={1} 
                    justifyContent="center" 
                    sx={{ padding: 4 }}
                    >
                    <h1 className="medium-header">{userInfo.username}</h1>
                    <h2 className="medium-header">Type: {converter.spellClassToString(userClass)}</h2>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => setUserClass(0)}>Fire</Button>
                        <Button variant="outlined" onClick={() => setUserClass(1)}>Water</Button>
                        <Button variant="outlined" onClick={() => setUserClass(2)}>Electric</Button>
                    </Stack>
                    <Button variant="contained" onClick={submitProfile}>Finished Customization</Button>
                    {returnMessage}
                    </Stack>
                    
               
                <div className="charCreationUserBottomDiv">
                    <CharacterStats />
                </div>
            </div>
            <CharacterCustomization />
        </div>
        </>
    )
}