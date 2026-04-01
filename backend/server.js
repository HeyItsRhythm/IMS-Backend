import ENV from './config/config.js'
import express from 'express';
import cors from 'cors';

import path from 'path';
import bcrypt from 'bcryptjs';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User from './models/User.js';


const app = express();
app.use(cors({
  origin: "https://ims-frontend-beta-eight.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

await connectDB();

const ensureDemoAdmin = async () => {
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@system.com';
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.DEMO_ADMIN_NAME || 'System Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) return;

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    isVerified: true
  });
  console.log(`Demo admin created: ${adminEmail}`);
};

await ensureDemoAdmin();

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

const PORT = ENV.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`IMS backend running on http://localhost:${PORT}`));
}

export default app;
