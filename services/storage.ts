
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { Job } from '../types';

// Job Schema and Model
const jobSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  city: { type: String },
  role: { type: String },
  description: { type: String },
  urgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const JobModel = mongoose.models.Job || mongoose.model('Job', jobSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://saudijob39_db_user:samad2425@saudijob.nussq53.mongodb.net/saudijob?retryWrites=true&w=majority';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
}

connectDB();
  
  await writeJobs(filtered); // This line is part of the old incrementViews function
  return true; // This line is part of the old incrementViews function

// MongoDB-based storage functions

export async function readJobs() {
  await connectDB();
  return await JobModel.find({});
}

export async function addJob(jobData) {
  await connectDB();
  const job = new JobModel(jobData);
  await job.save();
  return job;
}

export async function updateJob(id, data) {
  await connectDB();
  const job = await JobModel.findByIdAndUpdate(id, data, { new: true });
  return job;
}

export async function deleteJob(id) {
  await connectDB();
  const result = await JobModel.findByIdAndDelete(id);
  return !!result;
}

export async function incrementViews(id) {
  await connectDB();
  await JobModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
}
}

// The old incrementViews function has been replaced with the new MongoDB-based implementation
