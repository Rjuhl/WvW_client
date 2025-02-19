import { Button, Alert } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useRef, useState } from "react";
import { useUser } from "./providers/context";
import createPetCanvas from "../utils/drawPetCanvas";
import axios from "axios";

export default function PetCard(props) {
    const id = props.petId || 0;
    const setReturnMessage = props.returnMessage;
    const { userInfo, setUserInfo } = useUser();
    const canvasRef = useRef(null);
    const [petInfo, setPetInfo] = useState(null);

    useEffect(() => {
        if (!petInfo) getPetInfo(id);
    }, [])

    useEffect(() => {
        if (petInfo) {
            createPetCanvas(petInfo.filePath, 250).then((newCanvas) => {
                if (canvasRef.current) {
                    canvasRef.current.innerHTML = ""; 
                    canvasRef.current.appendChild(newCanvas);
                }
            }).catch(err => console.error(err));
        }
    }, [petInfo]);

    const getPetInfo = async (id) => {
        const pet = await axios.get(`${process.env.REACT_APP_ENDPOINT}/pet`, { params: { id: id } });
        setPetInfo(pet.data.pet);
    }

    const handleClick = async (pet, endpoint) => {
        const params = {
            username: userInfo.username,
            password: userInfo.password,
            pet: pet
        }
        const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/${endpoint}`, params);
        if (response.status === 200) {
            setUserInfo(response.data);
            setReturnMessage(<Alert severity="success" >Success</Alert>);
        } else {
            setReturnMessage(<Alert severity="error">{response.data}</Alert>);
        }
    }

    const displayButton = () => {
        if (userInfo.petsOwned.includes(id)) {
            if (userInfo.petEquiped === id) {
                return <Button variant="outlined" className="petButton" onClick={() => handleClick(-1, "equipPet")}> Unequip </Button>
            } else {
                return <Button variant="outlined" className="petButton" onClick={() => handleClick(id, "equipPet")}> Equip </Button>
            }     
        } else {
            if (userInfo.petsUnlocked.includes(id)) {
                return <Button variant="contained" className="petButton" onClick={() => handleClick(id, "buyPet")}> Purchase </Button>
            } else {
                return <Button disabled variant="contained" className="petButton"> Purchase </Button>
            }
        }
    }

    const displayCost = () => {
        if (petInfo && userInfo.petsUnlocked.includes(id)) {
            if (userInfo.petsOwned.includes(id)) {
                return <h2 className="shop-gold-cost"></h2>
            } 
            return <h2 className="shop-gold-cost">{petInfo.cost}</h2>
        }
        return <LockIcon color="action"/>
    }

    return (
        <>
        <div className="petComponent">
            <div className="petIconContainer">
                {displayCost()}
            </div>
            <h1 className="petTitle">{petInfo && petInfo.name}</h1>
            <div ref={canvasRef} style={{ width: "300px", height: "300px" }}></div>
            <div className="petButtonContainer">
                {displayButton()}
            </div>
        </div>
        </>
    )
}