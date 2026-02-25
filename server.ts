import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as storage from './services/storage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(cors());
app.use(express.json());

// Global error handler (production ready)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// API Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await storage.readJobs();
    // Auto-expire jobs older than 15 days
    const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);
    const activeJobs = jobs.filter(job => {
      const createdAt = job.createdAt ? new Date(job.createdAt).getTime() : 0;
      return createdAt > fifteenDaysAgo;
    });
    // Sort by createdAt descending
    activeJobs.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    res.json(activeJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    // Map fields to match schema
    const newJob = {
      name: jobData.fullName || jobData.name,
      phone: jobData.phoneNumber || jobData.phone,
      email: jobData.email,
      city: jobData.city,
      role: jobData.jobRole || jobData.role,
      description: jobData.description,
      urgent: jobData.isUrgent || jobData.urgent,
      views: 0
    };
    const created = await storage.addJob(newJob);
    res.status(201).json({
      ...created.toObject(),
      id: created._id,
      postedAt: created.createdAt ? new Date(created.createdAt).getTime() : Date.now(),
      isUrgent: created.urgent,
      fullName: created.name,
      phoneNumber: created.phone,
      jobRole: created.role
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, ...updateData } = req.body;
    const job = await storage.readJobs().then(jobs => jobs.find(j => (j._id?.toString?.() || j.id) === id));
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.email !== email) {
      return res.status(403).json({ error: 'Unauthorized: Email mismatch' });
    }
    if (updateData.isUrgent && !job.urgent) {
      updateData.urgent = true;
    }
    const updatedJob = await storage.updateJob(id, {
      name: updateData.fullName || updateData.name,
      phone: updateData.phoneNumber || updateData.phone,
      city: updateData.city,
      role: updateData.jobRole || updateData.role,
      description: updateData.description,
      urgent: updateData.isUrgent || updateData.urgent
    });
    res.json({
      ...updatedJob.toObject(),
      id: updatedJob._id,
      postedAt: updatedJob.createdAt ? new Date(updatedJob.createdAt).getTime() : Date.now(),
      isUrgent: updatedJob.urgent,
      fullName: updatedJob.name,
      phoneNumber: updatedJob.phone,
      jobRole: updatedJob.role
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, adminKey } = req.body;
    const job = await storage.readJobs().then(jobs => jobs.find(j => (j._id?.toString?.() || j.id) === id));
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const isAdmin = adminKey === 'saudi_admin_2025';
    if (!isAdmin && job.email !== email) {
      return res.status(403).json({ error: 'Unauthorized: Email mismatch' });
    }
    await storage.deleteJob(id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

app.post('/api/jobs/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    await storage.incrementViews(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
