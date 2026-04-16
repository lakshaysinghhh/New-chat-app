// Entry point for Render deployment
// This file starts the backend server
import { config } from 'dotenv';
import path from 'path';

// Load .env from backend directory
config({ path: path.join(process.cwd(), 'backend', '.env') });

import './backend/src/index.js';
