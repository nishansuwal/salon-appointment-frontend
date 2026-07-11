import Swal from "sweetalert2";

// Confirmation Alert (for delete, disable, etc.)
export const showConfirmAlert = (title, text, confirmButtonText, onConfirm) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Success Alert
export const showSuccessAlert = (title, text, timer = 3000) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
    timer: timer,
    timerProgressBar: true,
  });
};

// Error Alert
export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};

// Info Alert
export const showInfoAlert = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "info",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  });
};

// Warning Alert
export const showWarningAlert = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "OK",
  });
};

// Delete Confirmation Alert (with custom styling)
export const showDeleteAlert = (title, text, onConfirm) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Toggle Status Alert
export const showToggleAlert = (title, text, confirmButtonText, onConfirm) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Form Confirmation Alert (for saving/updating)
export const showSaveConfirmAlert = (title, text, onConfirm) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Save!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Toast Notification (non-blocking)
export const showToast = (icon, title, timer = 3000) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

// Custom Alert with HTML content
export const showCustomAlert = (title, htmlContent, icon = "info") => {
  return Swal.fire({
    title: title,
    html: htmlContent,
    icon: icon,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  });
};

// Alert with Input Field
export const showInputAlert = (title, text, inputType = "text", onConfirm) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "question",
    input: inputType,
    inputPlaceholder: "Enter value...",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    preConfirm: (value) => {
      if (!value) {
        Swal.showValidationMessage("Please enter a value");
      }
      return value;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(result.value);
    }
  });
};

// Alert with Multiple Buttons
export const showMultiOptionAlert = (title, text, options, onSelect) => {
  const buttons = {};
  options.forEach((option, index) => {
    buttons[index] = {
      text: option.label,
      value: option.value,
    };
  });

  return Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    cancelButtonColor: "#6b7280",
    cancelButtonText: "Cancel",
    showConfirmButton: false,
    showDenyButton: false,
    buttonsStyling: true,
    ...buttons,
  }).then((result) => {
    if (result.isConfirmed) {
      onSelect(result.value);
    }
  });
};

// Loading Alert (for async operations)
export const showLoadingAlert = (title, text = "Please wait...") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close Loading Alert
export const closeLoadingAlert = () => {
  Swal.close();
};

// Alert with Custom Timer and Auto-close
export const showAutoCloseAlert = (
  title,
  text,
  icon = "success",
  timer = 2000,
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: false,
    willClose: () => {
      // Optional callback when alert closes
    },
  });
};

// Bulk Action Confirmation
export const showBulkActionAlert = (title, text, count, onConfirm) => {
  return Swal.fire({
    title: title,
    text: `${text} (${count} items selected)`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Proceed!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Session Expiry Alert
export const showSessionExpiryAlert = (onExtend, onLogout) => {
  return Swal.fire({
    title: "Session Expiring Soon",
    text: "Your session will expire in 2 minutes. Do you want to extend it?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Extend Session",
    cancelButtonText: "Logout",
  }).then((result) => {
    if (result.isConfirmed) {
      onExtend();
    } else if (result.isDenied || result.isDismissed) {
      onLogout();
    }
  });
};

// Permission Denied Alert
export const showPermissionDeniedAlert = (resource) => {
  return Swal.fire({
    title: "Access Denied",
    text: `You don't have permission to ${resource}`,
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};

// Data Saved Successfully Alert
export const showDataSavedAlert = (message = "Data saved successfully!") => {
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

// Data Deleted Successfully Alert
export const showDataDeletedAlert = (
  message = "Data deleted successfully!",
) => {
  return Swal.fire({
    icon: "success",
    title: "Deleted!",
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

// Network Error Alert
export const showNetworkErrorAlert = () => {
  return Swal.fire({
    title: "Network Error",
    text: "Please check your internet connection and try again.",
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "Retry",
  });
};

// Unsaved Changes Alert
export const showUnsavedChangesAlert = (onConfirm) => {
  return Swal.fire({
    title: "Unsaved Changes",
    text: "You have unsaved changes. Are you sure you want to leave?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Leave",
    cancelButtonText: "Stay",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
