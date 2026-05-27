import Backup from '../models/Backup.js';
import asyncHandler from 'express-async-handler';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import archiver from 'archiver';
import fs from 'fs';

// @desc    Create a new backup
// @route   POST /api/backups
// @access  Private/SuperAdmin
const createBackup = asyncHandler(async (req, res) => {
  const { backupName, backupType } = req.body;

  const filePath = `./backend/data/backups/${backupName.replace(/ /g, '_')}_${Date.now()}.zip`;
  const output = fs.createWriteStream(filePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  archive.pipe(output);
  archive.directory('backend/data', 'data');
  await archive.finalize();

  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;

  const backup = await Backup.create({
    backupName,
    backupType,
    initiatedBy: req.user._id,
    fileUrl: filePath,
    fileSize: fileSizeInBytes,
    status: 'COMPLETED',
  });

  successResponse(res, backup, 'Backup created successfully', 201);
});

// @desc    Get all backups
// @route   GET /api/backups
// @access  Private/SuperAdmin
const getBackups = asyncHandler(async (req, res) => {
  const backups = await Backup.find({}).populate('initiatedBy', 'name');
  successResponse(res, backups, 'Backups retrieved successfully');
});

// @desc    Get a single backup by ID
// @route   GET /api/backups/:id
// @access  Private/SuperAdmin
const getBackupById = asyncHandler(async (req, res) => {
  const backup = await Backup.findById(req.params.id).populate(
    'initiatedBy',
    'name'
  );

  if (backup) {
    successResponse(res, backup, 'Backup retrieved successfully');
  } else {
    errorResponse(res, 'Backup not found', 404);
  }
});

// @desc    Download a backup
// @route   GET /api/backups/:id/download
// @access  Private/SuperAdmin
const downloadBackup = asyncHandler(async (req, res) => {
  const backup = await Backup.findById(req.params.id);

  if (backup) {
    res.download(backup.fileUrl, backup.backupName + '.zip');
  } else {
    errorResponse(res, 'Backup not found', 404);
  }
});

// @desc    Delete a backup
// @route   DELETE /api/backups/:id
// @access  Private/SuperAdmin
const deleteBackup = asyncHandler(async (req, res) => {
  const backup = await Backup.findById(req.params.id);

  if (backup) {
    await Backup.deleteOne({ _id: req.params.id });
    fs.unlink(backup.fileUrl, (err) => {
      if (err) {
        console.error(err);
      }
    });
    successResponse(res, null, 'Backup deleted successfully');
  } else {
    errorResponse(res, 'Backup not found', 404);
  }
});

// @desc    Restore from a backup
// @route   POST /api/backups/:id/restore
// @access  Private/SuperAdmin
const restoreBackup = asyncHandler(async (req, res) => {
  const backup = await Backup.findById(req.params.id);

  if (backup) {
    // In a real application, this would trigger a background job
    // to restore the backup.
    successResponse(res, null, 'Backup restore process started');
  } else {
    errorResponse(res, 'Backup not found', 404);
  }
});

export {
  createBackup,
  getBackups,
  getBackupById,
  downloadBackup,
  deleteBackup,
  restoreBackup,
};
