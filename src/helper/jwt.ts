import jwt from "jsonwebtoken"
import { UserType } from "../interface/user";


const generateToken = (payroll: UserType) => {
    try{
        const token =  jwt.sign(payroll, process.env.JWT_SECRET!, {expiresIn: '1h'})
        return token
    }catch(error){
        console.error(error)
        throw error
    }
}
export const generatePhoneToken = (payroll: {phone: string}) => {
    try{
        const token =  jwt.sign(payroll, process.env.JWT_SECRET!, {expiresIn: '1h'})
        return token
    }catch(error){
        console.error(error)
        throw error
    }
}

export const verifiedToken = (token: string) => {
   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded
    
   }catch(error){
        console.error(error)
        throw error
   }
}

export default generateToken