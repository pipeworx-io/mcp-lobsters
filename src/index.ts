interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Lobsters MCP — stories and discussions from lobste.rs
 *
 * Tools:
 * - get_hottest: Get the hottest stories on Lobsters
 * - get_newest: Get the newest stories on Lobsters
 * - get_story: Get a single story and its comments by short ID
 * - get_tag: Get stories for a specific tag
 */


const BASE = 'https://lobste.rs';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_hottest',
    description: 'Get the hottest (front page) stories on Lobsters.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_newest',
    description: 'Get the newest stories on Lobsters.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_story',
    description: 'Get a single Lobsters story and its comments by short ID.',
    inputSchema: {
      type: 'object',
      properties: {
        short_id: {
          type: 'string',
          description: 'The short alphanumeric story ID from the Lobsters URL (e.g. "abcdef")',
        },
      },
      required: ['short_id'],
    },
  },
  {
    name: 'get_tag',
    description: 'Get stories for a specific Lobsters tag (e.g. "rust", "programming", "security").',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Tag name (e.g. "rust", "programming", "security")',
        },
      },
      required: ['tag'],
    },
  },
];

interface LobstersStory {
  short_id: string;
  short_id_url: string;
  created_at: string;
  title: string;
  url: string;
  score: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  description?: string;
  description_plain?: string;
  comments_url: string;
  submitter_user: { username: string };
  tags: string[];
}

interface LobstersComment {
  short_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  is_moderated: boolean;
  score: number;
  upvotes: number;
  downvotes: number;
  comment: string;
  comment_plain: string;
  url: string;
  indent_level: number;
  commenting_user: { username: string };
}

interface LobstersStoryWithComments extends LobstersStory {
  comments: LobstersComment[];
}

function mapStory(s: LobstersStory) {
  return {
    short_id: s.short_id,
    url: s.url,
    comments_url: s.comments_url,
    title: s.title,
    score: s.score,
    upvotes: s.upvotes,
    downvotes: s.downvotes,
    comment_count: s.comment_count,
    created_at: s.created_at,
    submitter: s.submitter_user.username,
    tags: s.tags,
    description: s.description_plain ?? s.description ?? null,
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_hottest': {
      const res = await fetch(`${BASE}/hottest.json`);
      if (!res.ok) throw new Error(`Lobsters hottest error: ${res.status}`);

      const data = (await res.json()) as LobstersStory[];

      return {
        count: data.length,
        stories: data.map(mapStory),
      };
    }

    case 'get_newest': {
      const res = await fetch(`${BASE}/newest.json`);
      if (!res.ok) throw new Error(`Lobsters newest error: ${res.status}`);

      const data = (await res.json()) as LobstersStory[];

      return {
        count: data.length,
        stories: data.map(mapStory),
      };
    }

    case 'get_story': {
      const shortId = args.short_id as string;

      const res = await fetch(`${BASE}/s/${shortId}.json`);
      if (!res.ok) throw new Error(`Lobsters story error: ${res.status}`);

      const data = (await res.json()) as LobstersStoryWithComments;

      return {
        story: mapStory(data),
        comments: (data.comments ?? []).map((c) => ({
          short_id: c.short_id,
          url: c.url,
          created_at: c.created_at,
          score: c.score,
          indent_level: c.indent_level,
          author: c.commenting_user.username,
          body: c.comment_plain ?? c.comment,
          is_deleted: c.is_deleted,
          is_moderated: c.is_moderated,
        })),
      };
    }

    case 'get_tag': {
      const tag = args.tag as string;

      const res = await fetch(`${BASE}/t/${tag}.json`);
      if (!res.ok) throw new Error(`Lobsters tag error: ${res.status}`);

      const data = (await res.json()) as LobstersStory[];

      return {
        tag,
        count: data.length,
        stories: data.map(mapStory),
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
