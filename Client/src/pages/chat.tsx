import type { Page } from 'types/Page'
import { useEffect, useState } from 'react'
import styles from 'styles/pages/ChatPage.module.css'
import { useAuth } from 'hooks/useAuth'
import {
    Box,
    Grid,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Divider,
    Typography,
    IconButton,
    Button,
    Paper,
    Alert
} from '@mui/material'
import {
    Send as SendIcon,
    Logout as LogoutIcon
} from '@mui/icons-material'
import {
    MessageLeft,
    MessageRight
} from 'components'
import apolloClient from 'utils/apolloClient'
import {
    USERS_COUNT,
    SUBSCRIPTION_USER_COUNT,
    DELETE_USER
} from 'services/UserService'
import {
    CREATE_MESSAGE,
    SUBSCRIPTION_MESSAGE_CREATED
} from 'services/MessageService'

const ChatPage : Page = () => {
    const { UserData, signOut } = useAuth();
    const [message, setMessage] = useState("");

    const [getUsersCountLoading, setGetUsersCountLoading] = useState(true);
    const [getUsersCountError, setGetUsersCountError] = useState<string>();
    const [sendMessageError, setSendMessageError] = useState<boolean>(false);

    const [chatUserCount, setChatUserCount] = useState(0);
    const [chatMessages, setChatMessages] = useState<Array<any>>([]);

    useEffect(() => {
        return () => {
            // When user close tab or browser, will logout from the chat.
            window.addEventListener("beforeunload", function(e) {
                e.preventDefault();
                (e || window.event).returnValue; // Gecko + IE
        
                apolloClient.mutate({
                    mutation: DELETE_USER,
                    variables: {
                        deleteUserId: window.sessionStorage.getItem("token")
                    }
                }).then((res) => {
                    if(!res.errors && res.data && res.data.deleteUser){
                        window.sessionStorage.removeItem("token");
                    }
                })
                return; // Webkit, Safari, Chrome
            });
       }
    });

    useEffect(() => {
        // Loads count of users
        apolloClient.query({
            query: USERS_COUNT
        })
        .then((res) => {
            if(!res.error){
                setChatUserCount(res.data.usersCount)
                setGetUsersCountLoading(false);
            }else{
                setGetUsersCountError(res.error.message);
            }
        })
        .catch((err) => {
            setGetUsersCountError(err);
        })

        // Subscribe count of users
        var observerSubscriptionUserCount = apolloClient.subscribe({
            query: SUBSCRIPTION_USER_COUNT
        })
        var subscriptionUserCount = observerSubscriptionUserCount.subscribe(({ data }) => {
            setChatUserCount(data.userCount);
        })

        // Subscribe to sending messages
        var observerSubscriptionMessageCreated = apolloClient.subscribe({
            query: SUBSCRIPTION_MESSAGE_CREATED
        })
        var subscriptionMessageCreated = observerSubscriptionMessageCreated.subscribe((res) => {
            setChatMessages(prevState => {
                return [
                    res.data.messageCreated,
                    ...prevState
                ];
            })
            setMessage("");
        })
    
        return () => {
            // Unsubscribe
            subscriptionUserCount.unsubscribe();
            subscriptionMessageCreated.unsubscribe();
        }
    }, [])

    const sendMessage = () => {
        if(message !== ""){
            var userId = UserData?.id;
            apolloClient.mutate({
                mutation: CREATE_MESSAGE,
                variables: {
                    data: {
                        userId: userId,
                        message: message,
                    }
                }
            })
            .then((res) => {
                if(res.errors && !res.data.createMessage){
                    setSendMessageError(true);
                }else{
                    setSendMessageError(false);
                }
            })
            .catch((err) => {
                setSendMessageError(true);
            })
        }
    }

    const logOut = async (e) => {
        await signOut();
    }
    

    if(getUsersCountLoading || !UserData) return <div>Loading...</div>
    if(getUsersCountError) return <div>Error: {getUsersCountError}</div>

    return(
        <Box display="flex" justifyContent="center" alignItems="center" style={{minHeight: '100vh'}}>
            <Card style={{backgroundColor: "#F9F3EE", borderRadius: '1.5rem', margin: '0 1rem', padding: '.5rem 1rem'}}>
                <CardContent>
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid item container xs={12} alignItems="center" rowSpacing={{xs: 1, md: 2}}>
                            <Grid item xs={6}>
                                <Typography variant='h4' fontSize={{xs: '24px', md: '30px'}}>{UserData?.nickname}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" justifyContent="end">
                                <Button onClick={logOut} endIcon={<LogoutIcon/>} variant="outlined" color="error" size="small">Log Out</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" display="flex" justifyContent="end">{chatUserCount} users online.</Typography>
                            {
                                sendMessageError ? 
                                <Alert severity="error">An error occured while sendin the message.</Alert>
                                : null
                            }
                            <Paper className={styles.messagesBody}>
                                {
                                    chatMessages.map((message, index) => {
                                        if(message.user.id === UserData!.id){
                                            return(
                                                <MessageRight
                                                    key={index}
                                                    timestamp={new Date(Number(message.timestamp)).toLocaleString()}
                                                    message={message.message}
                                                />
                                            );
                                        }else{
                                            return(
                                                <MessageLeft
                                                    key={index}
                                                    displayName={message.user.nickname}
                                                    timestamp={new Date(Number(message.timestamp)).toLocaleString()}
                                                    message={message.message}
                                                />
                                            )
                                        }
                                    })
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter"){
                                            sendMessage()
                                        }
                                    }}
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    onClick={sendMessage}
                                                    color="info"
                                                >
                                                    <SendIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

ChatPage.Layout = "Chat";
ChatPage.Auth = {
    role: "User",
    redirect: "/"
}

export default ChatPage;