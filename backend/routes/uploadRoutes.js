import express from 'express';
import upload from '../utils/multer.js';
import cloudinary from '../utils/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

// @desc    Upload a single file
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type
        folder: 'school-management', // Organize files in a folder
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'], // Allowed formats
        max_bytes: 5 * 1024 * 1024, // 5MB limit
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return errorResponse(res, 'File upload failed', 500);
        }

        return successResponse(res, {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          size: result.bytes,
          originalName: req.file.originalname,
        }, 'File uploaded successfully');
      }
    );

    // Pipe the buffer to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse(res, 'File upload failed', 500);
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'school-management',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
            max_bytes: 5 * 1024 * 1024,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resource_type,
                format: result.format,
                size: result.bytes,
                originalName: file.originalname,
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    return successResponse(res, results, 'Files uploaded successfully');
  } catch (error) {
    console.error('Multiple upload error:', error);
    return errorResponse(res, 'File upload failed', 500);
  }
});

// @desc    Delete a file
// @route   DELETE /api/upload/:publicId
// @access  Private
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return errorResponse(res, 'Public ID is required', 400);
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return successResponse(res, null, 'File deleted successfully');
    } else {
      return errorResponse(res, 'File not found or already deleted', 404);
    }
  } catch (error) {
    console.error('Delete file error:', error);
    return errorResponse(res, 'File deletion failed', 500);
  }
});

export default router;