from pathlib import Path
import webview

BASE = Path(__file__).resolve().parent
URL = (BASE / 'dock-popup.html').as_uri()


def compute_bottom_center_position(width: int, height: int, margin_bottom: int = 18):
    """macOS 메인 화면 하단 중앙 좌표 계산"""
    try:
        from AppKit import NSScreen

        frame = NSScreen.mainScreen().visibleFrame()
        # Cocoa 좌표계는 좌하단 원점
        x = int(frame.origin.x + (frame.size.width - width) / 2)
        y = int(frame.origin.y + margin_bottom)
        return x, y
    except Exception:
        # 실패 시 안전한 기본값
        return 20, 20


if __name__ == '__main__':
    WIDTH = 290
    HEIGHT = 122
    x, y = compute_bottom_center_position(WIDTH, HEIGHT)

    # frameless + on_top = desktop floating dock 느낌
    webview.create_window(
        title='Agent Dock',
        url=URL,
        width=WIDTH,
        height=HEIGHT,
        x=x,
        y=y,
        frameless=True,
        easy_drag=True,
        on_top=True,
        shadow=True,
        background_color='#00000000',
    )
    webview.start(debug=False)
