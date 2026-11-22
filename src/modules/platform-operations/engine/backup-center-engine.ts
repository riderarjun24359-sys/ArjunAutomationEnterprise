import type { BackupRecord, BackupType } from "../types";

const backupStore: BackupRecord[] = [];

export function initializeBackups(): BackupRecord[] {
    return backupStore;
}

export function getBackups(): BackupRecord[] {
    return backupStore;
}

export function runBackup(type: BackupType): BackupRecord {
    const backup: BackupRecord = {
        id: `backup-${Date.now()}`,
        type,
        status: "pending",
        sizeBytes: 0,
        createdAt: new Date().toISOString(),
    };
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
    return backups.length > 0 ? Math.round((successful / backups.length) * 100) : 0;
}
