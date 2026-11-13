---
trigger: always_on
description: Always consult the graphify knowledge graph at graphify-out/ before answering codebase questions or reading raw files.
---

## graphify

This project has a persistent knowledge graph at `graphify-out/graph.json` with god nodes, community clusters, and cross-file relationships.

### Rules for Every Model Call:
- **Mandatory First Step**: For any codebase, architecture, file relationship, or implementation task, first query the graph instead of broad raw file reads or blind grep.
  - **MCP Tools**: Use `query_graph`, `get_node`, `get_neighbors`, `shortest_path`, or `god_nodes` (pass `project_path: "d:/Work Related/Projects/DocTrack"` or current workspace path).
  - **CLI Alternative**: Run `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"`.
- **Targeted File Inspection**: Use graph node source locations (`src`, `loc`) to pinpoint exact files and line ranges.
- **Architecture Overview**: Consult `graphify-out/GRAPH_REPORT.md` for community clustering, god nodes, and architecture flow.
- **Continuous Graph Maintenance**: After modifying code files, run `graphify update .` to keep the graph in sync (AST-based, 0 API cost).
- **Git Synchronization**: Post-commit hooks are active to automatically update `graphify-out/graph.json` on commits.

