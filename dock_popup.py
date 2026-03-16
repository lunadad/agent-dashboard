from pathlib import Path
import webview

BASE = Path(__file__).resolve().parent
URL = (BASE / 'dock-popup.html').as_uri()

if __name__ == '__main__':
    # frameless + on_top = desktop floating dock 느낌
    webview.create_window(
        title='Agent Dock',
        url=URL,
        width=290,
        height=122,
        x=20,
        y=820,
        frameless=True,
        easy_drag=True,
        on_top=True,
        shadow=True,
        background_color='#00000000',
    )
    webview.start(debug=False)
