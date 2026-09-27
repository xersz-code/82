import { SCHEDULE, DAY_NAMES } from "./js/schedule.js";

import {
  login,
  logout,
  onAuthChange
} from "./js/auth.js";

import {
  subscribeTasks,
  addTask,
  deleteTask,
  setDeadline,
  setManualDone
} from "./js/tasks.js";

import { getStatus } from "./js/status.js";

import {
  showAlert,
  showConfirm
} from "./js/alerts.js";


/* =====================================================
   HELPERS
===================================================== */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


const state = {
  day: getInitialDay(),
  filter: "all",
  tasks: [],
  isOperator: false,
  addFor: null,
  extendId: null
};


function getInitialDay() {
  const day = new Date().getDay();

  return day >= 1 && day <= 5
    ? day
    : 1;
}


function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(timestamp) {
  if (!timestamp) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}


function relativeDeadline(timestamp) {
  if (!timestamp) return "";

  const diff = timestamp - Date.now();

  if (diff <= 0) {
    return "Deadline lewat";
  }

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 60) {
    return `${minutes} menit lagi`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} jam lagi`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days} hari lagi`;
}


function toInputValue(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const pad = value =>
    String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}` +
    `T${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}`
  );
}


function getSubject(day, subjectId) {
  return (SCHEDULE[day] || []).find(
    subject => subject.id === subjectId
  );
}


/* =====================================================
   TOAST
===================================================== */

function showToast(
  message,
  type = "normal"
) {
  const toast = $("#toast");

  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;
  toast.dataset.type = type;

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.hidden = true;
    }, 200);

  }, 2500);
}


/* =====================================================
   RENDER
===================================================== */

function render({ animate = false } = {}) {
  renderDayTabs();
  renderSummary();
  renderSchedule(animate);
  renderOperatorState();
}


/* =====================================================
   DAY TABS
===================================================== */

function renderDayTabs() {
  $$(".day-tab").forEach(button => {
    const day =
      Number(button.dataset.day);

    const active =
      day === state.day;

    button.classList.toggle(
      "active",
      active
    );

    button.setAttribute(
      "aria-selected",
      String(active)
    );
  });

  const label =
    $("#selected-day-label");

  if (label) {
    label.textContent =
      DAY_NAMES[state.day];
  }
}


/* =====================================================
   SUMMARY
===================================================== */

function renderSummary() {
  const tasks =
    state.tasks.filter(task =>
      Number(task.day) ===
      Number(state.day)
    );

  let active = 0;
  let soon = 0;
  let done = 0;

  tasks.forEach(task => {
    const status =
      getStatus(task);

    if (status === "done") {
      done++;
    } else if (status === "soon") {
      soon++;
    } else {
      active++;
    }
  });

  const activeElement =
    $("#sum-active");

  const soonElement =
    $("#sum-soon");

  const doneElement =
    $("#sum-done");

  if (activeElement) {
    activeElement.textContent =
      active;
  }

  if (soonElement) {
    soonElement.textContent =
      soon;
  }

  if (doneElement) {
    doneElement.textContent =
      done;
  }
}


/* =====================================================
   SCHEDULE
===================================================== */

function renderSchedule(
  animate = false
) {
  const container =
    $("#schedule");

  if (!container) return;

  const schedule =
    SCHEDULE[state.day] || [];

  container.innerHTML = "";

  schedule.forEach(
    (subject, index) => {
      const element =
        buildSubject(subject);

      if (animate) {
        element.style.animationDelay =
          `${index * 45}ms`;
      }

      container.appendChild(
        element
      );
    }
  );

  container.setAttribute(
    "aria-busy",
    "false"
  );
}


/* =====================================================
   SUBJECT
===================================================== */

function buildSubject(subject) {
  const template =
    $("#tpl-subject");

  if (!template) {
    throw new Error(
      "Template #tpl-subject tidak ditemukan."
    );
  }

  const fragment =
    template.content.cloneNode(true);

  const article =
    fragment.querySelector(".subject");

  article.dataset.subjectId =
    subject.id;

  const name =
    fragment.querySelector(
      ".subject-name"
    );

  const time =
    fragment.querySelector(
      ".subject-time"
    );

  const addButton =
    fragment.querySelector(
      '[data-action="add-task"]'
    );

  const taskList =
    fragment.querySelector(
      ".task-list"
    );

  const noTaskMessage =
    fragment.querySelector(
      ".no-task-message"
    );

  name.textContent =
    subject.name;

  time.textContent =
    `${subject.start} - ${subject.end}`;


  /* -------------------------
     SPECIAL ACTIVITY
  ------------------------- */

  if (subject.isSpecial === true) {
    article.classList.add(
      "subject-special"
    );

    if (addButton) {
      addButton.remove();
    }

    taskList.remove();

    noTaskMessage.textContent =
      "Kegiatan khusus";

    noTaskMessage.classList.add(
      "special-message"
    );

    return article;
  }


  /* -------------------------
     NORMAL SUBJECT
  ------------------------- */

  if (addButton) {
    addButton.hidden =
      !state.isOperator;
  }


  const tasks =
    state.tasks.filter(task => {
      return (
        Number(task.day) ===
          Number(state.day) &&
        task.subjectId ===
          subject.id
      );
    });


  const visibleTasks =
    tasks.filter(task => {
      const status =
        getStatus(task);

      if (state.filter === "active") {
        return status !== "done";
      }

      if (state.filter === "done") {
        return status === "done";
      }

      return true;
    });


  if (visibleTasks.length > 0) {
    noTaskMessage.hidden = true;

    visibleTasks.forEach(task => {
      taskList.appendChild(
        buildTask(task)
      );
    });

  } else {
    noTaskMessage.hidden = false;

    if (tasks.length > 0) {
      noTaskMessage.textContent =
        "Tidak ada tugas pada filter ini.";
    }
  }


  return article;
}


/* =====================================================
   TASK
===================================================== */

function buildTask(task) {
  const template =
    $("#tpl-task");

  if (!template) {
    throw new Error(
      "Template #tpl-task tidak ditemukan."
    );
  }

  const fragment =
    template.content.cloneNode(true);

  const element =
    fragment.querySelector(".task");

  element.dataset.taskId =
    task.id;

  const checkbox =
    fragment.querySelector(
      ".task-checkbox"
    );

  const title =
    fragment.querySelector(
      ".task-title"
    );

  const statusElement =
    fragment.querySelector(
      ".task-status"
    );

  const description =
    fragment.querySelector(
      ".task-desc"
    );

  const deadline =
    fragment.querySelector(
      ".task-deadline"
    );

  const relative =
    fragment.querySelector(
      ".task-relative"
    );

  const actions =
    fragment.querySelector(
      ".task-actions"
    );


  const status =
    getStatus(task);


  title.textContent =
    task.title || "Tanpa judul";


  statusElement.textContent =
    status === "done"
      ? "Selesai"
      : status === "soon"
        ? "Segera"
        : "Aktif";


  statusElement.dataset.status =
    status;


  if (task.description) {
    description.textContent =
      task.description;
  } else {
    description.remove();
  }


  deadline.textContent =
    task.deadline
      ? `Deadline: ${formatDate(task.deadline)}`
      : "Tanpa deadline";


  relative.textContent =
    task.deadline
      ? relativeDeadline(task.deadline)
      : "";


  /* -------------------------
     OPERATOR CONTROLS
  ------------------------- */

  checkbox.disabled =
    !state.isOperator;

  checkbox.checked =
    status === "done";

  actions.hidden =
    !state.isOperator;


  /* -------------------------
     STATUS CLASS
  ------------------------- */

  if (status === "done") {
    element.classList.add(
      "is-done"
    );
  }

  if (status === "soon") {
    element.classList.add(
      "is-soon"
    );
  }


  return element;
}


/* =====================================================
   OPERATOR STATE
===================================================== */

function renderOperatorState() {
  const badge =
    $("#operator-badge");

  const loginButton =
    $("#btn-login");

  const logoutButton =
    $("#btn-logout");


  if (badge) {
    badge.hidden =
      !state.isOperator;
  }

  if (loginButton) {
    loginButton.hidden =
      state.isOperator;
  }

  if (logoutButton) {
    logoutButton.hidden =
      !state.isOperator;
  }
}


/* =====================================================
   DAY EVENTS
===================================================== */

$$(".day-tab").forEach(button => {
  button.addEventListener(
    "click",
    () => {
      state.day =
        Number(button.dataset.day);

      render({
        animate: true
      });
    }
  );
});


/* =====================================================
   FILTER EVENTS
===================================================== */

$$(".chip[data-filter]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        state.filter =
          button.dataset.filter;

        $$(".chip[data-filter]")
          .forEach(chip => {
            chip.classList.toggle(
              "is-active",
              chip === button
            );
          });

        render();
      }
    );
  });


/* =====================================================
   SCHEDULE CLICK EVENTS
===================================================== */

$("#schedule")?.addEventListener(
  "click",
  async event => {

    const button =
      event.target.closest("button");

    if (!button) return;

    const action =
      button.dataset.action;


    /* -------------------------
       ADD TASK
    ------------------------- */

    if (action === "add-task") {

      if (!state.isOperator) {
        return;
      }

      const subjectElement =
        button.closest(".subject");

      const subjectId =
        subjectElement?.dataset.subjectId;

      const subject =
        getSubject(
          state.day,
          subjectId
        );


      if (
        !subject ||
        subject.isSpecial
      ) {

        showAlert(
          "Kegiatan khusus tidak menerima tugas.",
          "error"
        );

        return;
      }


      state.addFor = {
        day: state.day,
        subjectId
      };


      const label =
        $("#task-subject-label");

      if (label) {
        label.textContent =
          `${subject.name} • ` +
          `${subject.start} - ${subject.end}`;
      }


      openDialog(
        "#modal-task"
      );

      return;
    }


    /* -------------------------
       TOGGLE COMPLETE
    ------------------------- */

    if (action === "toggle") {

      if (!state.isOperator) {
        return;
      }

      const taskElement =
        button.closest(".task");

      const taskId =
        taskElement?.dataset.taskId;

      if (!taskId) return;


      const task =
        state.tasks.find(
          item =>
            item.id === taskId
        );

      if (!task) return;


      const status =
        getStatus(task);


      try {

        await setManualDone(
          taskId,
          status !== "done"
        );

      } catch (error) {

        console.error(error);

        showAlert(
          "Gagal mengubah status tugas.",
          "error"
        );
      }

      return;
    }


    /* -------------------------
       EXTEND
    ------------------------- */

    if (action === "extend") {

      if (!state.isOperator) {
        return;
      }

      const taskElement =
        button.closest(".task");

      const taskId =
        taskElement?.dataset.taskId;

      const task =
        state.tasks.find(
          item =>
            item.id === taskId
        );

      if (!task) return;


      state.extendId =
        taskId;


      const input =
        $("#extend-deadline");

      if (input) {
        input.value =
          toInputValue(
            task.deadline
          );
      }


      const label =
        $("#extend-task-label");

      if (label) {
        label.textContent =
          task.title;
      }


      openDialog(
        "#modal-extend"
      );

      return;
    }


    /* -------------------------
       DELETE
    ------------------------- */

    if (action === "delete") {

      if (!state.isOperator) {
        return;
      }

      const taskElement =
        button.closest(".task");

      const taskId =
        taskElement?.dataset.taskId;

      if (!taskId) return;


      const task =
        state.tasks.find(
          item =>
            item.id === taskId
        );


      const confirmed =
        await showConfirm(
          task?.title
            ? `Hapus tugas "${task.title}"? Tugas yang dihapus tidak dapat dikembalikan.`
            : "Hapus tugas ini? Tugas yang dihapus tidak dapat dikembalikan.",
          {
            title: "Hapus tugas?",
            confirmText: "Hapus",
            cancelText: "Batal"
          }
        );


      if (!confirmed) {
        return;
      }


      try {

        await deleteTask(
          taskId
        );

        showAlert(
          "Tugas berhasil dihapus.",
          "success"
        );

      } catch (error) {

        console.error(error);

        showAlert(
          "Gagal menghapus tugas.",
          "error"
        );
      }
    }
  }
);


/* =====================================================
   CHECKBOX EVENTS
===================================================== */

$("#schedule")?.addEventListener(
  "change",
  async event => {

    const checkbox =
      event.target.closest(
        ".task-checkbox"
      );

    if (!checkbox) return;

    if (!state.isOperator) {
      return;
    }


    const taskElement =
      checkbox.closest(".task");

    const taskId =
      taskElement?.dataset.taskId;

    if (!taskId) return;


    try {

      await setManualDone(
        taskId,
        checkbox.checked
      );

    } catch (error) {

      console.error(error);

      checkbox.checked =
        !checkbox.checked;

      showAlert(
        "Gagal mengubah status tugas.",
        "error"
      );
    }
  }
);


/* =====================================================
   DIALOGS
===================================================== */

function openDialog(selector) {
  const dialog =
    $(selector);

  if (!dialog) return;


  if (
    typeof dialog.showModal ===
    "function"
  ) {
    dialog.showModal();
  } else {
    dialog.setAttribute(
      "open",
      ""
    );
  }
}


function closeDialog(dialog) {
  if (!dialog) return;


  if (
    typeof dialog.close ===
    "function"
  ) {
    dialog.close();
  } else {
    dialog.removeAttribute(
      "open"
    );
  }
}


$$("dialog").forEach(dialog => {

  dialog.addEventListener(
    "click",
    event => {

      if (
        event.target === dialog
      ) {
        closeDialog(dialog);
      }
    }
  );
});


$$("[data-close]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      closeDialog(
        button.closest("dialog")
      );
    }
  );
});


/* =====================================================
   LOGIN
===================================================== */

$("#btn-login")?.addEventListener(
  "click",
  () => {
    openDialog(
      "#modal-login"
    );
  }
);


$("#btn-logout")?.addEventListener(
  "click",
  async () => {

    const confirmed =
      await showConfirm(
        "Kamu akan keluar dari mode operator.",
        {
          title: "Keluar?",
          confirmText: "Keluar",
          cancelText: "Batal"
        }
      );


    if (!confirmed) {
      return;
    }


    try {

      await logout();

      showAlert(
        "Kamu berhasil keluar dari mode operator.",
        "success"
      );

    } catch (error) {

      console.error(error);

      showAlert(
        "Gagal keluar dari akun.",
        "error"
      );
    }
  }
);


$("#form-login")?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const email =
      $("#login-email")
        ?.value
        .trim();

    const password =
      $("#login-password")
        ?.value;


    const errorElement =
      $("#login-error");


    if (!email || !password) {

      if (errorElement) {
        errorElement.textContent =
          "Email dan kata sandi wajib diisi.";

        errorElement.hidden =
          false;
      }

      return;
    }


    try {

      await login(
        email,
        password
      );


      if (errorElement) {
        errorElement.hidden =
          true;
      }


      closeDialog(
        $("#modal-login")
      );


      event.target.reset();


      showAlert(
        "Berhasil masuk sebagai operator.",
        "success"
      );

    } catch (error) {

      console.error(error);


      if (errorElement) {
        errorElement.textContent =
          "Login gagal. Periksa email dan kata sandi.";

        errorElement.hidden =
          false;
      }
    }
  }
);


/* =====================================================
   ADD TASK
===================================================== */

$("#form-task")?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (!state.isOperator) {
      return;
    }


    if (!state.addFor) {

      showAlert(
        "Mata pelajaran belum dipilih.",
        "error"
      );

      return;
    }


    const subject =
      getSubject(
        state.addFor.day,
        state.addFor.subjectId
      );


    if (
      !subject ||
      subject.isSpecial
    ) {

      showAlert(
        "Kegiatan khusus tidak menerima tugas.",
        "error"
      );

      return;
    }


    const title =
      $("#task-title")
        ?.value
        .trim();

    const description =
      $("#task-desc")
        ?.value
        .trim();

    const deadlineInput =
      $("#task-deadline")
        ?.value;

    const autoDone =
      $("#task-auto")
        ?.checked ?? true;


    if (
      !title ||
      !deadlineInput
    ) {

      showAlert(
        "Judul dan deadline wajib diisi.",
        "error"
      );

      return;
    }


    const deadline =
      new Date(
        deadlineInput
      ).getTime();


    if (
      Number.isNaN(deadline)
    ) {

      showAlert(
        "Deadline tidak valid.",
        "error"
      );

      return;
    }


    try {

      await addTask({
        day: state.addFor.day,
        subjectId:
          state.addFor.subjectId,
        title,
        description,
        deadline,
        autoDone,
        manualDone: false
      });


      closeDialog(
        $("#modal-task")
      );


      event.target.reset();

      state.addFor = null;


      showAlert(
        "Tugas berhasil ditambahkan.",
        "success"
      );

    } catch (error) {

      console.error(error);

      showAlert(
        "Gagal menambahkan tugas.",
        "error"
      );
    }
  }
);


/* =====================================================
   EXTEND DEADLINE
===================================================== */

$$("[data-add-hours]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const hours =
          Number(
            button.dataset.addHours
          );

        const input =
          $("#extend-deadline");

        if (!input || !hours) {
          return;
        }


        const current =
          input.value
            ? new Date(
                input.value
              ).getTime()
            : Date.now();


        input.value =
          toInputValue(
            current +
            hours *
            60 *
            60 *
            1000
          );
      }
    );
  });


$("#form-extend")?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (!state.isOperator) {
      return;
    }

    if (!state.extendId) {
      return;
    }


    const value =
      $("#extend-deadline")
        ?.value;


    if (!value) {

      showAlert(
        "Deadline wajib diisi.",
        "error"
      );

      return;
    }


    const deadline =
      new Date(value).getTime();


    if (
      Number.isNaN(deadline)
    ) {

      showAlert(
        "Deadline tidak valid.",
        "error"
      );

      return;
    }


    try {

      await setDeadline(
        state.extendId,
        deadline
      );


      closeDialog(
        $("#modal-extend")
      );


      state.extendId = null;


      showAlert(
        "Deadline berhasil diperbarui.",
        "success"
      );

    } catch (error) {

      console.error(error);

      showAlert(
        "Gagal memperbarui deadline.",
        "error"
      );
    }
  }
);


/* =====================================================
   FIREBASE AUTH
===================================================== */

const OPERATOR_UID =
  "cEFi0GS1VBWXkD5NJUGaCWMdxxJ3";


onAuthChange(user => {

  state.isOperator =
    user?.uid === OPERATOR_UID;


  render();


  if (state.isOperator) {

    showToast(
      "Mode operator aktif.",
      "success"
    );
  }
});


/* =====================================================
   FIRESTORE TASKS
===================================================== */

subscribeTasks(tasks => {

  state.tasks =
    Array.isArray(tasks)
      ? tasks
      : [];


  render();
});


/* =====================================================
   CLOCK
===================================================== */

setInterval(() => {
  render();
}, 30000);


/* =====================================================
   DARK MODE
===================================================== */

const themeToggle =
  $("#themeToggle");

const root =
  document.documentElement;

const themeMeta =
  $('meta[name="theme-color"]');


function applyTheme(theme) {

  const dark =
    theme === "dark";


  root.dataset.theme =
    dark
      ? "dark"
      : "light";


  document.body.classList.toggle(
    "dark-mode",
    dark
  );


  if (themeMeta) {

    themeMeta.setAttribute(
      "content",
      dark
        ? "#111111"
        : "#f7f7f5"
    );
  }


  if (themeToggle) {

    themeToggle.textContent =
      dark
        ? "☀"
        : "☾";


    themeToggle.setAttribute(
      "aria-label",
      dark
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }
}


const savedTheme =
  localStorage.getItem(
    "theme"
  );


const initialTheme =
  savedTheme === "dark" ||
  savedTheme === "light"

    ? savedTheme

    : window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches

      ? "dark"
      : "light";


applyTheme(
  initialTheme
);


themeToggle?.addEventListener(
  "click",
  () => {

    const next =
      root.dataset.theme === "dark"
        ? "light"
        : "dark";


    localStorage.setItem(
      "theme",
      next
    );


    applyTheme(next);
  }
);


/* =====================================================
   TODAY
===================================================== */

const todayLabel =
  $("#today-label");


if (todayLabel) {

  todayLabel.textContent =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(
      new Date()
    );
}


/* =====================================================
   INITIAL RENDER
===================================================== */

render();