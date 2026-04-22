# mcp-lobsters

Lobsters MCP — stories and discussions from lobste.rs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_hottest` | Get trending stories from Lobsters. Returns title, URL, score, comment count, and tags for each story. |
| `get_newest` | Get latest stories posted to Lobsters. Returns title, URL, publication time, score, and tags for each story. |
| `get_story` | Fetch a single story and all its comments by ID (e.g., "abc123"). Returns title, URL, text, score, and nested comment threads. |
| `get_tag` | Search stories by tag (e.g., "rust", "programming", "security"). Returns matching stories with titles, URLs, scores, and tags. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "lobsters": {
      "url": "https://gateway.pipeworx.io/lobsters/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Lobsters data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
