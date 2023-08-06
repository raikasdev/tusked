export type LogFn = (message?: unknown, ...optionalParams: unknown[]) => void;

export interface Logger {
  log: LogFn;
  debug: LogFn;
  warn: LogFn;
  error: LogFn;
}

const logger: Logger = {
  log: (message, ...optionalParams) => console.log(message, ...optionalParams),
  debug: (message, ...optionalParams) =>
    console.debug(message, ...optionalParams),
  warn: (message, ...optionalParams) =>
    console.warn(message, ...optionalParams),
  error: (message, ...optionalParams) =>
    console.error(message, ...optionalParams),
};

export default logger;
