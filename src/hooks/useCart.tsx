import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@rocketshoes: cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product = await api
        .get<Product>(`/products/${productId}`)
        .then((response) => response.data);
      const cartProduct = cart.find((product) => product.id === productId);
      console.log("product -->" , product)
      const newCart = [...cart];

      // add no cart se nao existir

      if(cartProduct) {
        //update
          updateProductAmount({ productId, amount: 1 });
          return 
      }
      
      //add product 

      product.amount = 1
      

      newCart.push(product);
      
      
      setCart(newCart);
      //localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))

      
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      
      const productIndex = cart.findIndex(product => product.id === productId)
      const newCart = [...cart]
     
      newCart.splice(productIndex, 1)
      
      
      setCart(newCart)





    } catch {
      // TODO
    }
  };

  const updateProductAmount = ({ productId, amount }: UpdateProductAmount) => {
    try {
      const productIndex = cart.findIndex((item) => item.id == productId);
      

      if(productIndex < 0) {
        return 
      }
      

      const newCart = [...cart]
      newCart[productIndex].amount+= amount ;

      setCart(newCart)
      
      //localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))

      
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
