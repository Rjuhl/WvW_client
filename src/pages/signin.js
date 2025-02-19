import { useRef, useState, useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../components/providers/context.js'
import axios from 'axios';
import useBaseHooks from "../hooks/allHooks.js";
import { Box, Stack, TextField, Button, Typography, Paper, Alert} from "@mui/material";

export default function SignIn() {
    const location = useLocation();
    const errorMessage = location.state ? <Alert variant="outlined" severity="error">
      Error: please sign in again
    </Alert> : "";
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [accessCode, setAccessCode] = useState('')
    const [adminCode, setAdminCode] = useState('')
    const [returnMessage, setReturnMessage] = useState(errorMessage)
    const { userInfo, setUserInfo } = useUser()
    console.log("UserInfo:", userInfo);
    const navigate = useNavigate();

    useBaseHooks();

    const buttonRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && buttonRef.current) {
                buttonRef.current.click();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault()

        const params = {
            username: username,
            password: password,
            accessCode: accessCode,
            adminCode: adminCode
        }
        const res = await axios.post(`${process.env.REACT_APP_ENDPOINT}/signup`, params)
        .then(res => res)
        .catch(e => setReturnMessage(<Alert variant="outlined" severity="error">{e.message}</Alert>))
        if (res.status === 201) {
          setReturnMessage(<Alert variant="outlined" severity="error">{res.data}</Alert>);
        } else {
          setReturnMessage(<Alert variant="outlined" severity="success">{res.data}</Alert>);
        }
    }

    const handleLoginIn = async (e) => {
        e.preventDefault()

        const handleLoginResponse = (res) => {
            if (res.status === 201) {
                return <Alert variant="outlined" severity="error">{res.data}</Alert>
            }
            setUserInfo(res.data.user)
            navigate(`/${res.data.route}`)
        }

        const params = {params: {
            username: username,
            password: password
        }}

        await axios.get(`${process.env.REACT_APP_ENDPOINT}/login`, params)
        .then(res => setReturnMessage(handleLoginResponse(res)))
        .catch(e => setReturnMessage(<p className="failure">{e.message}</p>))
    }

    return (
        <>
        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ 
            backgroundColor: "#f5f5f5", 
            backgroundImage: "url('/wizard.png')",
            backgroundSize: "40%",
            backgroundPosition: "left center", 
            backgroundRepeat: "no-repeat"
          }}
        >
          
          <Paper 
            elevation={4} 
            sx={{
              padding: 4,
              borderRadius: 3,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
              backgroundColor: "white", // Neutral, no color form
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Wizards V Warlocks DEMO
            </Typography>
            
            <Stack spacing={2} component="form">
              <TextField 
                label="User Name" 
                variant="outlined" 
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField 
                label="Password" 
                type="password"
                variant="outlined" 
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField 
                label="Access Code" 
                variant="outlined" 
                fullWidth
                onChange={(e) => setAccessCode(e.target.value)}
              />
              <TextField 
                label="Admin Code" 
                variant="outlined" 
                fullWidth
                onChange={(e) => setAdminCode(e.target.value)}
              />
    
              {/* Buttons Row */}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="contained" 

                  fullWidth 
                  onClick={handleLoginIn}
                  ref={buttonRef}
                >
                  Login
                </Button>
              </Stack>
    
              {/* Return Message Display */}
              {returnMessage && returnMessage}
            </Stack>
          </Paper>
        </Box>
        </>
      );
    };