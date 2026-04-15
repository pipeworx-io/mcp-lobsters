# mcp-lobsters

Lobsters MCP — stories and discussions from lobste.rs

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_hottest` | Get the hottest (front page) stories on Lobsters. |
| `get_newest` | Get the newest stories on Lobsters. |
| `get_story` | Get a single Lobsters story and its comments by short ID. |
| `get_tag` | Get stories for a specific Lobsters tag (e.g. "rust", "programming", "security"). |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "lobsters": {
      "url": "https://gateway.pipeworx.io/lobsters/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use lobsters
```

## License

MIT
