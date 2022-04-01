
import  {ProductFormatted}  from "../pages/Home";
import { Product, ProductList } from "../types";
import { api } from "./api";




let batata: ProductFormatted[] = []
export  const listProducts =  async () => {
    if(batata.length == 0) {
        batata = await api.get<ProductFormatted[]>('/products').then(Response => Response.data)
       
    }

    return batata
}

export const getProductId = async  (productId: number) => await api.get<Product>(`/products/${productId}`).then(Response => Response.data)
