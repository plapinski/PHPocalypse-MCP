import { fileURLToPath } from 'url';
import path from 'path';
import { parse } from "yaml";
import * as fs from 'fs';
import ZSchema from 'z-schema';
import { CONFIG_FILE_PATH } from './args.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Tool {
    name: string;
    command: string;
    args: string[];
}
interface Config {
    config: {
        projectPath: string;
    },
    tools: Tool[];
}

if (CONFIG_FILE_PATH && fs.existsSync(CONFIG_FILE_PATH) && path.basename(CONFIG_FILE_PATH) === 'phpocalypse-mcp.yaml') {
    fs.accessSync(CONFIG_FILE_PATH, fs.constants.R_OK);
}

const filePath = path.resolve(CONFIG_FILE_PATH);
const file = fs.readFileSync(filePath, 'utf8');
const parsed: Config = parse(file);

const schemaPath = path.resolve(__dirname, '../schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const validator = new ZSchema({});

const valid = validator.validate(parsed, schema);

export const config = {
    basePath: path.dirname(CONFIG_FILE_PATH),
    parsed: parsed,
    valid: valid
}
