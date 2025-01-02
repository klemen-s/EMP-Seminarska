import { CartState, CartAction } from "@/types";


export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD": {
            let duplicatedItem = false;

            const newCart = state.items.map((cartItem) => {
                if (
                    cartItem.id === action.product.id &&
                    cartItem.size === action.product.size &&
                    cartItem.color == action.product.color
                ) {
                    duplicatedItem = true;
                    return { ...cartItem, quantity: cartItem.quantity + 1 };
                } else {
                    return { ...cartItem };
                }
            });

            if (!duplicatedItem) {
                newCart.push({ ...action.product });
            }

            const newTotalAmount = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return { items: newCart, totalAmount: newTotalAmount };
        }
        case "REMOVE": {
            const removeItemIndex = state.items.findIndex(
                (cartItem) =>
                    cartItem.id === action.product.id &&
                    cartItem.size === action.product.size &&
                    cartItem.color === action.product.color
            );

            const newCart = [...state.items];
            newCart.splice(removeItemIndex, 1);

            const newTotalAmount = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            return { items: newCart, totalAmount: newTotalAmount };
        }
        case "CHECKOUT": {
            return { items: [], totalAmount: 0 };
        }
        case "DB_FETCH": {
            const newTotalAmount = action.products!.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            return { items: action.products!, totalAmount: newTotalAmount }
        }
        default: {
            throw new Error("Unknown action: " + action.type);
        }
    }
};