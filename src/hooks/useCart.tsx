import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { getProductId } from "../services/products";
import { getStockId } from "../services/stock";
import { Product } from "../types";

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
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    console.log("storage cart -->", storagedCart);

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product = await getProductId(productId);
      const stockProduct = await getStockId(productId);

      const cartProduct = cart.find((product) => product.id === productId);
      console.log("product -->", product);

      const newCart = [...cart];

      if (cartProduct?.amount) {
        if (cartProduct.amount > stockProduct.amount) {
          throw new Error();
        }
      }

      if (cartProduct) {
        updateProductAmount({ productId, amount: 1 });
        return;
      }

      product.amount = 1;

      newCart.push(product);

      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
    } catch (e) {
      toast.error("Quantidade solicitada fora de estoque");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productIndex = cart.findIndex(
        (product) => product.id === productId
      );
      const newCart = [...cart];

      newCart.splice(productIndex, 1);

      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
    } catch {}
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const productIndex = cart.findIndex((item) => item.id === productId);

      if (productIndex < 0) {
        return;
      }

      const stockProduct = await getStockId(productId);

      if (cart[productIndex]?.amount + amount > stockProduct.amount) {
        throw new Error();
      }

      const newCart = [...cart];
      newCart[productIndex].amount += amount;

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
      setCart(newCart);
    } catch {
      toast.error("Quantidade solicitada fora de estoque");
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
