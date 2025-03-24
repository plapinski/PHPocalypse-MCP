import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config.js";
import { executeCommand } from './command.js';   
import InMemoryResultsStorage from "./cache.js";

import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ReadResourceRequestSchema,
    ListResourcesRequestSchema
  } from "@modelcontextprotocol/sdk/types.js";
import { describe } from "node:test";

const resultsStorage = new InMemoryResultsStorage();

const server = new Server(
    {
      name: "PHPocalypse MCP",
      version: "0.0.2"
    },
    {
      capabilities: {
        tools: {},
        resources: {}
      }
    }
);

interface ServerTool {
    name: string;
    description: string;
    inputSchema: object;
};

interface ServerResource {
    uri: string;
    name: string;
    description: string;
    mimeType: "application/octet-stream" | "text/plain" | "application/json";
}

let tools: ServerTool[] = [];
let resources: ServerResource[] = [];

for (const tool of config.parsed.tools) {
    tools.push({
        name: tool.name,
        description: "Todo description",
        inputSchema: {type: "object", properties: {}}
    });

    resources.push({
        uri: `output://tool/${tool.name}`,
        name: `Recent output of ${tool.name}`,
        description: `Recent output of ${tool.name}`,
        mimeType: "application/octet-stream"
    });
}

server.setRequestHandler(ListToolsRequestSchema, async () => { return {tools: tools} });

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const command = config.parsed.tools.find(tool => tool.name === toolName)?.command;

    if (!command) {
        throw new Error(`Tool ${toolName} not found`);
    }

    const commandResult = await executeCommand(command);

    resultsStorage.set(toolName, commandResult);

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(commandResult)
            }
        ]
    };
});

server.setRequestHandler(ListResourcesRequestSchema, async (request) => { return { resources: resources } });

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const toolName = uri.split("/")[3];

    return {
        contents: [{
            uri: uri,
            text: JSON.stringify(await resultsStorage.get(toolName)),
        }]
    };
});

const transport = new StdioServerTransport();
await server.connect(transport);