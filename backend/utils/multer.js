// utils/multer.js
import multer from 'multer';

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;