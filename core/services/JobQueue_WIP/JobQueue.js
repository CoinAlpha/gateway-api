"use strict";
/*
  Throughout the application, we have many usecases which require
  a persistent series of asynchronous tasks to be executed.
  This complex multistep UX processes
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueueReducer = exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    // before job has been run
    JobStatus["DORMANT"] = "DORMANT";
    // job is running
    JobStatus["RUNNING"] = "RUNNING";
    // job has run and is now awaiting completion
    JobStatus["PENDING"] = "PENDING";
    // job has completed successfully
    JobStatus["COMPLETED"] = "COMPLETED";
    // job has failed
    JobStatus["FAILED"] = "FAILED";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
function jobQueueReducer(state) { }
exports.jobQueueReducer = jobQueueReducer;
//# sourceMappingURL=JobQueue.js.map