import { createContext, Dispatch } from "react";
import { CartState, CartAction } from "@/types";

const initialState: CartState = {
    items: [],
    totalAmount: 0,
};

export const CartContext = createContext<CartState>(initialState);
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);


