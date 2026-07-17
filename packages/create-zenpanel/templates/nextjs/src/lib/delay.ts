export function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
