import { createContext, Dispatch } from "react";
import { AuthState, AuthAction } from "@/types";

const initialState: AuthState = {
    isSignout: false,
    userToken: null,
    isLoading: true,
    userId: null
};

export const AuthContext = createContext<AuthState>(initialState);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | null>(null);
