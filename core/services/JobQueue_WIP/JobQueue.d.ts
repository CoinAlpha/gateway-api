export declare enum JobStatus {
    DORMANT = "DORMANT",
    RUNNING = "RUNNING",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export interface JobQueueItemConfig<Storage = Record<string, any>> {
    name: string;
    displayName: string;
    invoke: (updateStorage: (storage: Storage) => Storage) => Promise<void>;
    checkIfComplete: () => Promise<boolean>;
    onStatusChange: (status: JobStatus) => void;
}
export interface JobQueueItemInstance<Storage> extends JobQueueItemConfig<Storage> {
    status: JobStatus;
    errors: any[];
}
export interface JobQueue {
}
export declare function jobQueueReducer(state: Record<string, JobQueueItemInstance<any>>): void;
