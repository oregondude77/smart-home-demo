#!/bin/bash
# Usage:
#   ./servers.sh up [ref=HEAD]  baseline worktree of <ref> on :3001, workspace dev on :3000
#   ./servers.sh prod           build the workspace and serve it with next start on :3002
#   ./servers.sh down           stop :3000-:3002 and remove the baseline worktree
# Servers are started with nohup so they survive harness background-task limits.
set -euo pipefail
ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
BASE=/tmp/shd-baseline
LOGS=/tmp/shd-logs
mkdir -p "$LOGS"

wait_for() { for _ in $(seq 1 60); do curl -s -o /dev/null "localhost:$1/" && return 0; sleep 1; done; echo "port $1 did not start; see $LOGS" >&2; return 1; }
running() { lsof -tiTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
stop() { lsof -tiTCP:"$1" -sTCP:LISTEN | xargs kill 2>/dev/null || true; }

case "${1:-}" in
  up)
    ref="${2:-HEAD}"
    stop 3001
    git -C "$ROOT" worktree remove --force "$BASE" 2>/dev/null || true
    git -C "$ROOT" worktree prune
    git -C "$ROOT" worktree add --detach "$BASE" "$ref"
    # Turbopack rejects a symlinked node_modules, so clone it (APFS copy-on-write).
    cp -Rc "$ROOT/node_modules" "$BASE/node_modules"
    (cd "$BASE" && nohup npx next dev -p 3001 > "$LOGS/dev3001.log" 2>&1 &)
    running 3000 || (cd "$ROOT" && nohup npx next dev -p 3000 > "$LOGS/dev3000.log" 2>&1 &)
    wait_for 3000 && wait_for 3001
    echo "new :3000, baseline ($(git -C "$BASE" log --oneline -1)) :3001"
    ;;
  prod)
    stop 3002
    (cd "$ROOT" && npm run build > "$LOGS/build.log" 2>&1) || { tail -20 "$LOGS/build.log"; exit 1; }
    (cd "$ROOT" && nohup npx next start -p 3002 > "$LOGS/start3002.log" 2>&1 &)
    wait_for 3002 && echo "production build on :3002"
    ;;
  down)
    stop 3000; stop 3001; stop 3002
    git -C "$ROOT" worktree remove --force "$BASE" 2>/dev/null || true
    git -C "$ROOT" worktree prune
    echo "servers stopped, baseline removed"
    ;;
  *) sed -n 2,6p "$0"; exit 1 ;;
esac
