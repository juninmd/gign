declare module 'loading-indicator' {
  export function start(message?: string): NodeJS.Timeout;
  export function stop(timer: NodeJS.Timeout): void;
}
