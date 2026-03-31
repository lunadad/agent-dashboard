#!/bin/zsh
set -e

APP_DIR="/Users/haluna/.openclaw/workspace/agent-dashboard"
PYTHON_BIN="$APP_DIR/.venv/bin/python"
PLIST_PATH="$HOME/Library/LaunchAgents/com.lunadad.agentdock.plist"
LABEL="com.lunadad.agentdock"

if [ ! -x "$PYTHON_BIN" ]; then
  echo "❌ Python venv not found: $PYTHON_BIN"
  echo "먼저 agent-dashboard/.venv 세팅이 필요합니다."
  exit 1
fi

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>

  <key>ProgramArguments</key>
  <array>
    <string>${PYTHON_BIN}</string>
    <string>${APP_DIR}/dock_popup.py</string>
  </array>

  <key>WorkingDirectory</key>
  <string>${APP_DIR}</string>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>${APP_DIR}/dock.log</string>
  <key>StandardErrorPath</key>
  <string>${APP_DIR}/dock.err.log</string>
</dict>
</plist>
EOF

# 기존 로드 해제(있다면)
launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
launchctl enable "gui/$(id -u)/${LABEL}" || true
launchctl kickstart -k "gui/$(id -u)/${LABEL}" || true

echo "✅ LaunchAgent 등록 완료"
echo "- Label: ${LABEL}"
echo "- Plist: ${PLIST_PATH}"
echo "- 로그인 시 자동 실행 + 항상 유지"
