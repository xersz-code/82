// js/tasks.js

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { db } from "./firebase.js";


/* =====================================================
   COLLECTION
===================================================== */

const tasksCollection = collection(
  db,
  "tasks"
);


/* =====================================================
   SUBSCRIBE TO TASKS
===================================================== */

export function subscribeTasks(callback) {
  const tasksQuery = query(
    tasksCollection,
    orderBy("deadline", "asc")
  );

  return onSnapshot(
    tasksQuery,
    snapshot => {
      const tasks = snapshot.docs.map(
        document => ({
          id: document.id,
          ...document.data()
        })
      );

      callback(tasks);
    },
    error => {
      console.error(
        "Gagal mengambil tasks:",
        error
      );

      callback([]);
    }
  );
}


/* =====================================================
   ADD TASK
===================================================== */

export async function addTask(task) {
  const taskData = {
    day: Number(task.day),
    subjectId: task.subjectId,
    title: task.title,
    description: task.description || "",
    deadline: Number(task.deadline),
    autoDone: task.autoDone !== false,
    manualDone: task.manualDone === true,
    createdAt: Date.now()
  };

  return addDoc(
    tasksCollection,
    taskData
  );
}


/* =====================================================
   DELETE TASK
===================================================== */

export async function deleteTask(taskId) {
  if (!taskId) {
    throw new Error(
      "Task ID tidak ditemukan."
    );
  }

  return deleteDoc(
    doc(db, "tasks", taskId)
  );
}


/* =====================================================
   SET DEADLINE
===================================================== */

export async function setDeadline(
  taskId,
  deadline
) {
  if (!taskId) {
    throw new Error(
      "Task ID tidak ditemukan."
    );
  }

  const timestamp =
    Number(deadline);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      "Deadline tidak valid."
    );
  }

  return updateDoc(
    doc(db, "tasks", taskId),
    {
      deadline: timestamp
    }
  );
}


/* =====================================================
   SET MANUAL DONE
===================================================== */

export async function setManualDone(
  taskId,
  done
) {
  if (!taskId) {
    throw new Error(
      "Task ID tidak ditemukan."
    );
  }

  return updateDoc(
    doc(db, "tasks", taskId),
    {
      manualDone: Boolean(done)
    }
  );
}