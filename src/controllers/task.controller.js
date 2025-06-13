import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const localFilePath = req.file?.path;

  if (!title || !localFilePath) {
    throw new ApiError(400, "Title and image are required");
  }

  const cloudImage = await uploadOnCloudinary(localFilePath);
  if (!cloudImage?.url) {
    throw new ApiError (400, "Image upload failed");
  }

  const task = await Task.create({
    title,
    description,
    image: cloudImage.url,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { search = "", sort = "createdAt", order = "desc" } = req.query;

  const query = {
    createdBy: req.user._id,
    title: { $regex: search, $options: "i" },
  };

  const tasks = await Task.find(query)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, tasks));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const localFilePath = req.file?.path;

  const task = await Task.findById(id);
  if (!task || task.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(404, "Task not found");
  }

  if (localFilePath) {
    await deleteFromCloudinary(task.image);
    const cloudImage = await uploadOnCloudinary(localFilePath);
    if (!cloudImage?.url) {
      throw new ApiError(400, "Image upload failed");
    }
    task.image = cloudImage.url;
  }

  if (title) task.title = title;
  if (description) task.description = description;

  await task.save();
  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task || task.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(404, "Task not found");
  }

  await deleteFromCloudinary(task.image);
  await Task.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export { createTask, getTasks, updateTask, deleteTask };
