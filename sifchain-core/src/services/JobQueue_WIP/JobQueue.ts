/*
  Throughout the application, we have many usecases which require 
  a persistent series of asynchronous tasks to be executed. 
  This complex multistep UX processes
*/

export enum JobStatus {
  // before job has been run
  DORMANT = "DORMANT",
  // job is running
  RUNNING = "RUNNING",
  // job has run and is now awaiting completion
  PENDING = "PENDING",
  // job has completed successfully
  COMPLETED = "COMPLETED",
  // job has failed
  FAILED = "FAILED",
}

export interface JobQueueItemConfig<Storage = Record<string, any>> {
  name: string;
  displayName: string;
  invoke: (updateStorage: (storage: Storage) => Storage) => Promise<void>;
  checkIfComplete: () => Promise<boolean>;
  onStatusChange: (status: JobStatus) => void;
}
export interface JobQueueItemInstance<Storage>
  extends JobQueueItemConfig<Storage> {
  status: JobStatus;
  errors: any[];
}

export interface JobQueue {}

export function jobQueueReducer(
  state: Record<string, JobQueueItemInstance<any>>,
) {}
