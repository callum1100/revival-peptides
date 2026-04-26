'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CartItem, CartState, Product } from './types';

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; selectedDosage: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' };

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number, selectedDosage?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id && item.selectedDosage === action.selectedDosage
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.quantity,
        };
        return { ...state, items: updated, isOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity, selectedDosage: action.selectedDosage }],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.product.id !== action.productId) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId ? { ...item, quantity: Math.max(1, action.quantity) } : item
        ),
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

const initialState: CartState = { items: [], isOpen: false };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((product: Product, quantity = 1, selectedDosage?: string) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, selectedDosage: selectedDosage || product.dosage });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, toggleCart, openCart, closeCart, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
