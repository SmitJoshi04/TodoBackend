import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user.isAdmin) {
      throw new ApiError(403, "You don't have permission to access this resource");
    }
    
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
}; 