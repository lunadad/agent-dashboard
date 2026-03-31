#!/bin/zsh
set -e

PLIST_PATH="$HOME/Library/LaunchAgents/com.lunadad.agentdock.plist"
LABEL="com.lunadad.agentdock"

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
rm -f "$PLIST_PATH"

echo "🧹 LaunchAgent 제거 완료: ${LABEL}"
