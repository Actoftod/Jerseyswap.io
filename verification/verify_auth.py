from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for the title or a key element to appear
        # The Auth screen has "JERSEYSWAP"
        expect(page.get_by_text("JERSEYSWAP").first).to_be_visible()

        # Take a screenshot
        page.screenshot(path="verification/auth_screen.png")
        print("Screenshot saved to verification/auth_screen.png")
        browser.close()

if __name__ == "__main__":
    run()
