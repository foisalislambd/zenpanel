// Generated from the shared ZenPanel TypeScript core - edit freely.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
function firstError(order, errors) {
  return order.find((k) => errors[k]);
}
function validateLogin(username, password) {
  const errors = {};
  if (!username.trim()) errors.username = "Enter your username.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}
function validateResource(input, options) {
  const errors = {};
  const t = input.title.trim();
  if (!t) errors.title = `${options.titleLabel} is required.`;
  else if (options.titleIsEmail && !EMAIL_RE.test(t)) errors.title = "Enter a valid email address.";
  else if (t.length < 3) errors.title = `${options.titleLabel} must be at least 3 characters.`;
  else if (t.length > 120) errors.title = `${options.titleLabel} must be 120 characters or fewer.`;
  if (input.meta.length > 160) errors.meta = `${options.metaLabel} must be 160 characters or fewer.`;
  return errors;
}
function validateUser(input, existingEmails) {
  const errors = {};
  if (input.name.trim().length < 2) errors.name = "Enter the user's full name.";
  const mail = input.email.trim().toLowerCase();
  if (!mail) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(mail)) errors.email = "Enter a valid email address.";
  else if (existingEmails.includes(mail)) errors.email = "A user with this email already exists.";
  if (input.phone.trim() && !PHONE_RE.test(input.phone.trim())) errors.phone = "Enter a valid phone number.";
  return errors;
}
function validateAccount(username, email) {
  const errors = {};
  if (!/^[a-z0-9_.-]{3,32}$/i.test(username.trim())) {
    errors.username = "3\u201332 characters: letters, numbers, dot, dash or underscore.";
  }
  if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}
function validatePassword(current, next, confirm) {
  const errors = {};
  if (!current) errors.current = "Enter your current password.";
  if (next.length < 8) errors.next = "Use at least 8 characters.";
  else if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) errors.next = "Include at least one letter and one number.";
  else if (next === current) errors.next = "New password must be different from the current one.";
  if (confirm !== next) errors.confirm = "Passwords don't match.";
  return errors;
}
export {
  EMAIL_RE,
  PHONE_RE,
  firstError,
  validateAccount,
  validateLogin,
  validatePassword,
  validateResource,
  validateUser
};
