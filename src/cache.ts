import { CliOutput } from "./command.js";

interface NoOutput {
    error: string;
}

export type Output = CliOutput | NoOutput;

interface ResultsStorage {
    set(tool: ToolName, output: CliOutput): Promise<void>;
    get(tool: ToolName): Promise<Output>;
}

type ToolName = string;

interface InMemoryCache {
    [key: ToolName]: CliOutput
}

export default class InMemoryResultsStorage implements ResultsStorage {
    private inMemoryCache: InMemoryCache;

    constructor() {
        this.inMemoryCache = {};
    }

    public async set(tool: ToolName, output: CliOutput): Promise<void> {
        this.inMemoryCache[tool] = output;
    }

    public async get(tool: ToolName): Promise<Output> {
        return this.inMemoryCache[tool] ?? {error: `No cached results found for ${tool}`} as NoOutput;
    }
}