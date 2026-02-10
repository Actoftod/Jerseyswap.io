import time
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")
            print("Waiting for content...")
            # Wait for "JERSEYSWAP" title or any content
            page.wait_for_selector("text=JERSEYSWAP", timeout=10000)

            # Take a screenshot of the initial state (Auth/Landing)
            page.screenshot(path="verification.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            # print page source if failed
            # print(page.content())
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
