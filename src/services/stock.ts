import { Stock } from "../types"
import { api } from "./api"

let stockProducts = []


export const  getStock = async  ()  => {
    if(stockProducts.length === 0 ) {

        return  stockProducts = await  api.get<Stock[]>('/stock').then(response => response.data)
    }
    
    
    return []
}

export const getStockItem = async  (id: number) => {
   const itemStock =  await api.get<Stock>(`/stock/${id}`).then(response => response.data)
    return itemStock
}


