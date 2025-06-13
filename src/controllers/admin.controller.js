import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    isAdmin: false,
  }).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = true;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User blocked successfully"));
});

const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = false;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User unblocked successfully"));
});

export { getAllUsers, blockUser, unblockUser };
