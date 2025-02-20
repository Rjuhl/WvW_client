import { useUser } from '../components/providers/context.js';
import { useState, useEffect, useContext } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PetCard from '../components/petCard.js';
import axios from 'axios';

export default function PetShop() {
    const { userInfo, setUserInfo } = useUser()
    const [returnMessage, setReturnMessage] = useState(null)
    const [numPets, setNumPets] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if(numPets === 0) getNumPets();
    }, [numPets]);

    const getNumPets = async () => {
        const response = await axios.get(`${process.env.REACT_APP_ENDPOINT}/numPets`);
        (response.status === 200) ? setNumPets(response.data.number) : setReturnMessage(<Alert severity="error">{response.data}</Alert>)
    }

    const displayPets = () => {
        const petCards = []
        for (let i = 0; i < numPets; i++) {
            const petCard = (
                <PetCard key={i} petId={i} returnMessage={setReturnMessage} />      
            );
            petCards.push(petCard)
        }
        return (
            <div className="shop-spells-container">
                <div className='pet-row'>
                    <Stack direction="row" spacing={2}>
                        {petCards}
                    </Stack>
                </div>
            </div>
        )
    }

    return (
        <>
        <div>
        <div className="shopRow">
            <Button variant="contained" onClick={() => navigate('/home')}>Home</Button>
            <h1 className="shop-title">Pet Shop</h1>
            <h2 className="shop-gold-cost">Gold: {userInfo.money}</h2>
        </div>
        {numPets > 0 && displayPets()}
        </div>
        <div style={{
            width: "80%",          // Only takes up 80% of the page width
            margin: "10px auto",   // Centers it and adds top/bottom spacing
            textAlign: "center"    // Centers text inside
        }}>
            {returnMessage && returnMessage}
        </div>

        </>
    )
}