# PHPocalypse-MCP
MCP server for vibe developers that are too busy to run tests and static analysis.

## Prerequisites
- You need to have node, npx and tsx installed

## How to
- First, `git clone` this repo to chosen directory
- Run `npm install`
- Next, open your Cursor settings and add the following MCP config:

```json
{
    "mcpServers": {
        "phpocalypse-mcp": {
            "command": "npx",
            "args": ["tsx", "/Absolute/Path/To/PHPocalypse-MCP/src/index.ts", "--config", "/Absolute/Path/To/Your/PHP/Based/Project/phpocalypse-mcp.yaml"]
        }
    }
}
```
Make sure the paths are correct!

- In your PHP project, create `phpocalypse-mcp.yaml` file

## `phpocalypse-mcp.yaml` config
The structure is straightforward. Define the tools by giving them a name and a command to run.

```yaml
tools:
  - name: php-cs-fixer
    command: make php-cs

  - name: php-stan
    command: /vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=-1

  - name: tests-unit
    command: docker compose run --rm php ./vendor/bin/phpunit --testsuite=Unit

  - name: tests-behat
    command: task behat -- --no-interaction
```

## Caveats
- This MCP is just a proof of concept and it may not work in every case. One thing that **will not** work for sure is any interactive CLI input. A good example is behat, that - if not run in non-inteartvice mode - will prompt user with a question of whether to generate missing snippets. Make sure that your commands just run and output something meaningful and leave the rest to your favourite LLM.
- Some bigger outputs are not handler correctly yet. To fix that, try to either use `claude-3.7-sonnet` or craft your commands to return less.