export function generateWorkId() {
  return `WORK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
