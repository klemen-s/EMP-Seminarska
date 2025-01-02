import { ReactNode } from 'react';

interface ProductProps {
    productName: string;
    imageUrl: string;
    id: string;
    price: number;
    marginTop?: number
}

interface Product {
    id: string;
    imageUrl: string;
    productName: string;
    price: number;
    sizes: string[];
    productType: string;
    colors: string[];
}

interface ShoppingCartItemProps {
    id: string,
    imageUrl: string;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    color: string,
}

interface AuthState {
    isSignout: boolean;
    userToken: string | null;
    isLoading: boolean;
    userId?: string | null;
}

interface AuthAction {
    type: string
    token?: string;
    data?: { jwt: string; userId: string, name: string, email: string };
}

interface AuthProviderProps {
    children: ReactNode;
}

interface CartState {
    items: { id: string; name: string; imageUrl: string; quantity: number; color: string; size: string, price: number }[];
    totalAmount: number;
}

interface CartAction {
    type: string;
    product?: any;
    products?: any[]
}

interface CartProviderProps {
    children: ReactNode;
}

interface JsonError {
    Error: string
}

export type {
    ProductProps,
    Product,
    ShoppingCartItemProps,
    AuthState,
    AuthAction,
    AuthProviderProps,
    CartState,
    CartAction,
    CartProviderProps,
    JsonError
};

