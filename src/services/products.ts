import { ProductFormatted } from "../pages/Home";
import { Product } from "../types";
import { api } from "./api";

let products: ProductFormatted[] = [];
export const getProductsList = async () => {
  if (products.length === 0) {
    products = await api
      .get<ProductFormatted[]>("/products")
      .then((Response) => Response.data);
  }

  return products;
};

export const getProductId = async (productId: number) =>
  await api
    .get<Product>(`/products/${productId}`)
    .then((Response) => Response.data);
