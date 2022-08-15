import { useAuth } from "hooks/useAuth";
import Router from "next/router";
import { useEffect, useState } from "react"
import type { PageAuth } from "types/Page"
import apolloClient from "utils/apolloClient";
import {
    GET_USER
} from 'services/UserService';

export const AuthenticatedRoute = ({ Component, ...rest} : any) => {
    const authSettings : PageAuth = Component.Auth;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { UserData, setUserData, signOut } = useAuth();

    const fetchUserData = () => {
        var userId = window.sessionStorage.getItem("token");
        apolloClient.query({
            query: GET_USER,
            variables: {
                userId: userId
            }
        }).then((res) => {
            if(!res.error){
                var user = {
                    id: res.data.user.id,
                    nickname: res.data.user.nickname
                }
                setUserData(user);
                setIsLoading(false);
                setIsAuthenticated(true);
            }else{
                setIsAuthenticated(false);
                signOut();
            }
        }).catch((err) => {
            setIsAuthenticated(false);
            signOut();
        })
    }

    useEffect(()=>{
        var userToken = window.sessionStorage.getItem("token");

        if(!userToken){
            if(authSettings.role !== "Anonymous"){
                Router.push("/");
            }else{
                setIsLoading(false);
                setIsAuthenticated(true);
            }
        }else{
            if(authSettings.role === "Anonymous"){
                Router.push(authSettings.redirect);
            }
            else if(!UserData){
                fetchUserData();
            }else{
                setIsLoading(false);
                setIsAuthenticated(true);   
            }
        }
        
    },[UserData, authSettings.redirect, authSettings.role, setUserData, signOut]);
    
    if (isLoading) {
        return <div> Loading... </div>;
    }

    if(isAuthenticated){
        return <Component {...rest} />;
    }else{
        return <div>Unauthorized Page...</div>
    }
}