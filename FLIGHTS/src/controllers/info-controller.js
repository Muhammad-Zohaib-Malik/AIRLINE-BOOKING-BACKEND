import {StatusCodes} from 'http-status-codes'

export const info=async(req,res)=>{
  return res.status(StatusCodes.OK).json({
    success:true,
    message:"api is live",
    error:{},
    data:{}
  })
}