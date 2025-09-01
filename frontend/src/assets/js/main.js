// EndPoints
export const endpointLogin = 'http://127.0.0.1:8000/login'
export const endpointRegister = 'http://127.0.0.1:8000/register'
export const endpointSearch = 'http://127.0.0.1:8000/search/?keyword='
export const endpointProducts = 'http://127.0.0.1:8000/products'
export const endpointUsers = 'http://127.0.0.1:8000/users'
export const endpointShops = 'http://127.0.0.1:8000/shops'
export const endpointDeleteShop = (id) => `http://127.0.0.1:8000/shops/${id}`
export const endpointUpdateShop = (id) => `http://127.0.0.1:8000/shops/${id}`
export const endpointUpdateShopWithImage = (id) => `http://127.0.0.1:8000/shops/upload/${id}`


