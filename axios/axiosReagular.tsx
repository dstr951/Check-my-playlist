import axios, { AxiosInstance } from 'axios'


const axiosRegular:(token:string) => AxiosInstance = (token: string) => {
   const instance = axios.create({
        baseURL:"http://localhost:3001/proxy/",
        headers: {'Authorization': 'Bearer ' + token}
    }) 
    instance.interceptors.response.use((req) =>{return req},(err) => {
        console.log(err)
        if(!err.response) return Promise.reject(err)
        if(err.response.status === 401) location.replace('/')
        return Promise.reject(err)
    })

    return instance
}



export default axiosRegular