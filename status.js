// js/status.js


/* =====================================================
   STATUS CONFIG
===================================================== */

const SOON_HOURS = 24;


/* =====================================================
   GET TASK STATUS
===================================================== */

export function getStatus(task) {
  if (!task) {
    return "active";
  }

  const now = Date.now();

  /*
    MANUAL COMPLETION
    -----------------
    Operator manually marked the task as done.
  */

  if (task.manualDone === true) {
    return "done";
  }


  /*
    AUTOMATIC COMPLETION
    --------------------
    If autoDone is enabled and the deadline
    has passed, the task is considered done.
  */

  if (
    task.autoDone === true &&
    task.deadline &&
    Number(task.deadline) <= now
  ) {
    return "done";
  }


  /*
    SOON
    ----
    Deadline is within the next 24 hours.
  */

  if (task.deadline) {
    const remaining =
      Number(task.deadline) - now;

    const soonLimit =
      SOON_HOURS * 60 * 60 * 1000;

    if (
      remaining > 0 &&
      remaining <= soonLimit
    ) {
      return "soon";
    }
  }


  /*
    ACTIVE
    ------

    Task still has time remaining.
  */

  return "active";
}