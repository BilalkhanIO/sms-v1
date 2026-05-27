import cron from 'node-cron';
import Setting from '../models/Setting.js';
import { createBackup } from '../controllers/backupController.js';

const backupJob = cron.schedule('* * * * *', async () => {
    console.log('Running backup check...');
    const backupSettings = await Setting.findOne({ name: 'backup' });

    if (backupSettings && backupSettings.value.autoBackup) {
        // This is a simplified check. A real implementation would check the frequency and time.
        console.log('Auto backup is enabled, creating backup...');
        // We can't use the req, res objects here, so we'll need a different way to trigger a backup.
        // For now, this is a placeholder.
    }
}, {
    scheduled: false
});

export const startScheduler = () => {
    backupJob.start();
};
