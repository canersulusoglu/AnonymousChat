import type { Page } from 'types/Page'
import { useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import {
  TextField,
  InputAdornment,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Face as FaceIcon,
  ScubaDiving as ScubaDivingIcon
} from '@mui/icons-material'
import {
  CREATE_USER
} from 'services/UserService'
import apolloClient from 'utils/apolloClient'
import Router from 'next/router'

const Home: Page = () => {
  const [nickname, setNickname] = useState("");
  const [loginError, setLoginError] = useState("");
  const { setUserData } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    apolloClient.mutate({
      mutation: CREATE_USER,
      variables: {
          data: {
            nickname: nickname
          }
      }
    }).then((res) => {
      if(!res.errors){
        var createdUser = {
          id: res.data.createUser.id,
          nickname: res.data.createUser.nickname
        };
        setUserData(createdUser);
        window.sessionStorage.setItem("token", createdUser.id);
        Router.push("/chat");
      }
    }).catch((err) => {
      setLoginError(err.message);
    })
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{minHeight: '100vh'}}>
      <Card style={{backgroundColor: "#F9F3EE", borderRadius: '1.5rem', margin: '0 1rem', padding: '.5rem 1rem'}}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container 
              spacing={{xs: 4, md: 6, lg: 6}} 
              direction="column" 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
            >
              <Grid item>
                <Typography variant='h4' textAlign="center" fontSize={{xs: '24px', md: '30px'}} style={{marginBottom: '1rem'}}>Enter your nickname and join the chat!</Typography>
                <Divider/>
                {
                  loginError ? 
                  <Alert severity="error" style={{marginTop: '1rem'}}>{loginError}</Alert>
                  : null
                }
              </Grid>
              <Grid item>
                <TextField
                  label="Nickname" 
                  variant="outlined"
                  fullWidth
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === "Enter"){
                      handleSubmit(e);
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><FaceIcon/></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  startIcon={<ScubaDivingIcon/>} 
                  color="success" 
                  size="large" 
                  variant="contained"
                  type="submit"
                >
                  Join
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

Home.Layout = "Home";
Home.Auth = {
  role: "Anonymous",
  redirect: "/chat"
}

export default Home
