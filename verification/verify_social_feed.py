from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for profiles to appear
        expect(page.get_by_text("KYLE SMITH")).to_be_visible()

        # Click on the profile
        page.get_by_text("KYLE SMITH").click()

        # Wait for login simulation (800ms) + lazy load
        # We expect "COMMUNITY_FEED" from SocialFeed component
        expect(page.get_by_text("COMMUNITY_FEED")).to_be_visible(timeout=10000)

        # Take a screenshot
        page.screenshot(path="verification/social_feed.png")
        print("Screenshot saved to verification/social_feed.png")
        browser.close()

if __name__ == "__main__":
    run()
