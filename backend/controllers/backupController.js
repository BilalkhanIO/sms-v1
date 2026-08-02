import asyncHandler from 'express-async-handler';
import { successResponse } from '../utils/apiResponse.js';
import archiver from 'archiver';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import unzipper from 'unzipper';

const execPromise = util.promisify(exec);

const backupDir = path.resolve(process.cwd(), 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function safeBackupPath(filename) {
  // Reject any filename containing path separators or traversal sequences
  if (!filename || /[/\\]/.test(filename) || filename.includes('..')) {
    return null;
  }
  const resolved = path.resolve(backupDir, filename);
  // Ensure resolved path is still inside backupDir
  if (!resolved.startsWith(backupDir + path.sep) && resolved !== backupDir) {
    return null;
  }
  return resolved;
}

// @desc    Get all backups
// @route   GET /api/backups
// @access  Private/SuperAdmin
export const getBackups = asyncHandler(async (req, res) => {
  const backupFiles = await fsPromises.readdir(backupDir);
  const backupDetails = await Promise.all(
    backupFiles
      .filter(file => file.endsWith('.zip'))
      .map(async file => {
        const filePath = path.join(backupDir, file);
        const stats = await fsPromises.stat(filePath);
        return {
          id: file,
          name: file,
          size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          createdAt: stats.birthtime,
          status: 'COMPLETED',
          location: 'LOCAL',
          description: 'Database backup',
        };
      })
  );

  backupDetails.sort((a, b) => b.createdAt - a.createdAt);
  successResponse(res, backupDetails, 'Backups retrieved successfully');
});

// @desc    Create a new backup
// @route   POST /api/backups
// @access  Private/SuperAdmin
export const createBackup = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const dumpDir = path.join(backupDir, 'dump');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupFileName = `${type}-backup-${timestamp}.zip`;
  const backupFilePath = path.join(backupDir, backupFileName);

  if (fs.existsSync(dumpDir)) {
    fs.rmSync(dumpDir, { recursive: true, force: true });
  }
  fs.mkdirSync(dumpDir);

  const mongodumpCommand = `mongodump --uri="${process.env.MONGODB_URI}" --out="${dumpDir}"`;

  try {
    await execPromise(mongodumpCommand);

    const output = fs.createWriteStream(backupFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(output);
    archive.directory(dumpDir, false);
    await archive.finalize();

    fs.rmSync(dumpDir, { recursive: true, force: true });
    successResponse(res, { name: backupFileName }, 'Backup created successfully');

  } catch (error) {
    console.error(`mongodump error: ${error.message}`);
    res.status(500);
    throw new Error('Backup creation failed');
  }
});

// @desc    Restore from a backup
// @route   POST /api/backups/:id/restore
// @access  Private/SuperAdmin
export const restoreBackup = asyncHandler(async (req, res) => {
  const backupFileName = req.params.id;
  const backupFilePath = safeBackupPath(backupFileName);
  if (!backupFilePath) {
    res.status(400);
    throw new Error('Invalid backup filename');
  }
  const restoreDir = path.join(backupDir, 'restore');

  if (!fs.existsSync(backupFilePath)) {
    res.status(404);
    throw new Error('Backup not found');
  }

  if (fs.existsSync(restoreDir)) {
    fs.rmSync(restoreDir, { recursive: true, force: true });
  }
  fs.mkdirSync(restoreDir);

  await fs.createReadStream(backupFilePath)
    .pipe(unzipper.Extract({ path: restoreDir }))
    .promise();

  const mongorestoreCommand = `mongorestore --uri="${process.env.MONGODB_URI}" --dir="${restoreDir}" --drop`;

  try {
    await execPromise(mongorestoreCommand);
    fs.rmSync(restoreDir, { recursive: true, force: true });
    successResponse(res, null, 'Backup restored successfully');
  } catch (error) {
    console.error(`mongorestore error: ${error.message}`);
    fs.rmSync(restoreDir, { recursive: true, force: true });
    res.status(500);
    throw new Error('Backup restore failed');
  }
});

// @desc    Delete a backup
// @route   DELETE /api/backups/:id
// @access  Private/SuperAdmin
export const deleteBackup = asyncHandler(async (req, res) => {
  const backupFileName = req.params.id;
  const backupFilePath = safeBackupPath(backupFileName);
  if (!backupFilePath) {
    res.status(400);
    throw new Error('Invalid backup filename');
  }

  if (fs.existsSync(backupFilePath)) {
    fs.unlinkSync(backupFilePath);
    successResponse(res, null, 'Backup deleted successfully');
  } else {
    res.status(404);
    throw new Error('Backup not found');
  }
});
