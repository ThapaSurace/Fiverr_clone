import { useEffect, createContext,useReducer, useContext } from "react"
import {AuthReducer} from "../reducer/authReducer"
import { INITIAL_STATE } from "../reducer/authReducer"

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(AuthReducer,INITIAL_STATE)

    useEffect(()=>{
        localStorage.setItem("userInfo",JSON.stringify(state.user))
    },[state.user])

    return(
        <AuthContext.Provider value={{
            user:state.user,
            isLoading:state.isLoading,
            error:state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
  };
  