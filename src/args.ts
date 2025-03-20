const args = process.argv;
const configIndex = args.indexOf("--config");

export const CONFIG_FILE_PATH: string = configIndex !== -1 && configIndex < args.length - 1 ? args[configIndex + 1] : "";
