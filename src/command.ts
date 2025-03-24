import { config } from "./config.js";
import { execSync } from 'child_process';

export interface CliOutput {
    exitCode: number;
    stdoutBase64Encoded: string;
    stderrBase64Encoded: string;
}

export const executeCommand = async (command: string): Promise<CliOutput> => {
    try {
        const stdout = execSync(command, {
            cwd: config.basePath,
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
            timeout: 120000,
            stdio: 'pipe'
        });
        return {
            exitCode: 0,
            stdoutBase64Encoded: Buffer.from(stdout).toString('base64'),
            stderrBase64Encoded: ''
        };
    } catch (error: any) {
        return {
            exitCode: error.code ?? error.status ?? 1,
            stdoutBase64Encoded: Buffer.from(error.stdout).toString('base64'),
            stderrBase64Encoded: Buffer.from(error.stderr).toString('base64')
        };
    }
};
