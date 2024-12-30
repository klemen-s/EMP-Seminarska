import { AuthState, AuthAction } from "@/types";

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "RESTORE_TOKEN": {
            return { ...state, userToken: action.token || null, isLoading: false };
        }
        case "SIGN_IN": {
            return {
                ...state,
                isSignout: false,
                userToken: action.data?.jwt || null,
                userId: action.data?.userId || null,
            };
        }
        case "SIGN_OUT":
            return {
                ...state,
                isSignout: true,
                userToken: null,
                userId: null,
            };
        default: {
            throw new Error("Unknown action: " + action.type);
        }
    }
};
