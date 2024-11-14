import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from '../models/User.Model.js'


export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError("401", "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken")

        if (!user) {
            // discuss about frontEnd
            throw new ApiError("401", "Invalid Acess Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.mesaage || "Invalid Access Token")

    }

})  