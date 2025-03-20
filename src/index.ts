import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config.js";
import { executeCommand } from './execute.js';

const server = new McpServer({
    name: "PHPocalypse MCP",
    version: "0.0.1",
});

for (const tool of config.parsed.tools) {
    server.tool(
        tool.name,
        {},
        async () => ({
            content: [{ type: "text", text: JSON.stringify(await executeCommand(tool.command)) }],
        })
    );
}

const transport = new StdioServerTransport();
await server.connect(transport);
