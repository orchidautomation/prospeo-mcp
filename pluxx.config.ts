import { definePlugin } from 'pluxx'

export default definePlugin({
  name: "prospeo",
  version: '1.0.0',
  description: "Prospeo MCP workflows for company research, contact discovery, and verified email enrichment.",
  author: {
    name: "Brandon Guerrero",
  },
  license: 'MIT',

  skills: './skills/',
  commands: "./commands/",

  instructions: './INSTRUCTIONS.md',

  userConfig: [
    {
      key: "prospeo-api-key",
      title: "Prospeo API Key",
      description: "API key required to launch the Prospeo MCP server and execute Prospeo API requests.",
      type: "secret",
      required: true,
      envVar: "PROSPEO_API_KEY",
      targets: ["claude-code","cursor","codex","opencode"]
    }
  ],

  scripts: "./scripts/",


  mcp: {
    "prospeo": {
      transport: 'stdio',
      command: "node",
      args: ["./build/index.js"],
      env: {
            "PROSPEO_API_KEY": "${PROSPEO_API_KEY}"
      }
    },
  },

  hooks: {
    sessionStart: [
      {
        command: "bash \"${PLUGIN_ROOT}/scripts/check-env.sh\""
      }
    ]
  },




  brand: {
    displayName: "Prospeo",
    shortDescription: "Company research and contact enrichment workflows powered by Prospeo."
  },

  targets: ["claude-code", "cursor", "codex", "opencode"],
})
