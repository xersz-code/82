const alertModal = document.querySelector("#modal-alert");
const alertIcon = document.querySelector("#alert-icon");
const alertEyebrow = document.querySelector("#alert-eyebrow");
const alertTitle = document.querySelector("#alert-title");
const alertMessage = document.querySelector("#alert-message");
const alertOk = document.querySelector("#alert-ok");
const alertClose = document.querySelector("#alert-close");

const confirmModal = document.querySelector("#modal-confirm");
const confirmTitle = document.querySelector("#confirm-title");
const confirmMessage = document.querySelector("#confirm-message");
const confirmOk = document.querySelector("#confirm-ok");
const confirmCancel = document.querySelector("#confirm-cancel");
const confirmClose = document.querySelector("#confirm-close");

let confirmResolve = null;


/* =====================================================
   ALERT
===================================================== */

export function showAlert(
  message,
  type = "success",
  title = null
) {
  const settings = {
    success: {
      title: "Berhasil",
      eyebrow: "Selesai",
      icon: "✓",
      className: ""
    },

    error: {
      title: "Terjadi masalah",
      eyebrow: "Error",
      icon: "×",
      className: "alert-icon-error"
    },

    warning: {
      title: "Perhatian",
      eyebrow: "Peringatan",
      icon: "!",
      className: "alert-icon-warning"
    },

    info: {
      title: "Informasi",
      eyebrow: "Info",
      icon: "i",
      className: "alert-icon-info"
    }
  };

  const setting =
    settings[type] || settings.info;

  alertTitle.textContent =
    title || setting.title;

  alertEyebrow.textContent =
    setting.eyebrow;

  alertMessage.textContent =
    message;

  alertIcon.textContent =
    setting.icon;

  alertIcon.className =
    `alert-icon ${setting.className}`;

  alertModal.showModal();
}


/* =====================================================
   CLOSE ALERT
===================================================== */

function closeAlert() {
  if (alertModal.open) {
    alertModal.close();
  }
}

alertOk.addEventListener(
  "click",
  closeAlert
);

alertClose.addEventListener(
  "click",
  closeAlert
);

alertModal.addEventListener(
  "click",
  event => {
    if (event.target === alertModal) {
      closeAlert();
    }
  }
);


/* =====================================================
   CONFIRM
===================================================== */

export function showConfirm(
  message,
  options = {}
) {
  return new Promise(resolve => {
    confirmResolve = resolve;

    confirmTitle.textContent =
      options.title || "Yakin?";

    confirmMessage.textContent =
      message;

    confirmOk.textContent =
      options.confirmText || "Ya, lanjutkan";

    confirmCancel.textContent =
      options.cancelText || "Batal";

    confirmModal.showModal();
  });
}


/* =====================================================
   CONFIRM ACTION
===================================================== */

function finishConfirm(result) {
  if (!confirmResolve) return;

  const resolve = confirmResolve;

  confirmResolve = null;

  if (confirmModal.open) {
    confirmModal.close();
  }

  resolve(result);
}

confirmOk.addEventListener(
  "click",
  () => finishConfirm(true)
);

confirmCancel.addEventListener(
  "click",
  () => finishConfirm(false)
);

confirmClose.addEventListener(
  "click",
  () => finishConfirm(false)
);

confirmModal.addEventListener(
  "click",
  event => {
    if (event.target === confirmModal) {
      finishConfirm(false);
    }
  }
);