import { BACKUP_TYPES } from "../constants";
import type { BackupRecord, BackupType } from "../types";

const backupStore: BackupRecord[] = [];

export function initializeBackups(): BackupRecord[] {
    if (backupStore.length > 0) return backupStore;
    BACKUP_TYPES.forEach((type, i) => {
        backupStore.push({
            id: `backup-${type}`,
            type,
            status: i === 0 ? "verified" : "completed",
            sizeBytes: Math.round(1024 * 1024 * (10 + i * 5)),
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
            verifiedAt: i === 0 ? new Date().toISOString() : null,
            restoreSimulated: i === 0,
        });
    });
    return backupStore;
}

export function getBackups(): BackupRecord[] {
    return initializeBackups();
}

export function runBackup(type: BackupType): BackupRecord {
    const backup: BackupRecord = {
        id: `backup-${Date.now()}`,
        type,
        status: "pending",
        sizeBytes: 0,
        createdAt: new Date().toISOString(),
    };
    backup.status = "completed";
    backup.sizeBytes = Math.round(Math.random() * 1024 * 1024 * 50);
    backupStore.unshift(backup);
    return backup;
}

export function verifyBackup(id: string): BackupRecord | null {
    const backup = backupStore.find((b) => b.id === id);
    if (!backup) return null;
    backup.status = "verified";
    backup.verifiedAt = new Date().toISOString();
    return backup;
}

export function simulateRestore(id: string): { success: boolean; backupId: string } {
    const backup = backupStore.find((b) => b.id === id);
    if (!backup) return { success: false, backupId: id };
    backup.restoreSimulated = true;
    return { success: true, backupId: id };
}

export function getBackupSuccessRate(): number {
    const backups = getBackups();
    const successful = backups.filter((b) => b.status === "completed" || b.status === "verified").length;
    return backups.length > 0 ? Math.round((successful / backups.length) * 100) : 100;
}

initializeBackups();
