import Router from "next/router";
import { useState, useContext, createContext } from "react";
import apolloClient from 'utils/apolloClient'
import {
    DELETE_USER
} from 'services/UserService'

interface UserData {
    id: string,
    nickname: string
}

interface AuthContext {
    UserData: UserData | null,
    setUserData: Function,
    signOut: Function
}

const defaultAuthContext : AuthContext= {
    UserData: null,
    setUserData: () => {},
    signOut: () => {}
}

const authContext = createContext<AuthContext>(defaultAuthContext);

export const useAuth = () : AuthContext => {
    return useContext(authContext);
}

export const AuthProvider = (props : any) => {
    const Provider = authContext.Provider;
    const [UserData, setUserData] = useState<UserData | null>(null);

    const signOut = () => {
        var userId = window.sessionStorage.getItem("token");
        return new Promise<void>((resolve, reject) => {
            apolloClient.mutate({
                mutation: DELETE_USER,
                variables: {
                    deleteUserId: userId
                }
            }).then((res) => {
                if(!res.errors && res.data && res.data.deleteUser){
                    setUserData(null);
                    window.sessionStorage.removeItem("token");
                    Router.push("/");
                    resolve();
                }else{
                    reject();
                }
            })
            .catch((err) => {
                reject();
            })
        })
    }
    
    return <Provider value={{UserData, setUserData, signOut}}>{props.children}</Provider>;
}