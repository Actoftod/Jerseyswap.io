import json
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app first to set local storage context
        page.goto("http://localhost:3000")

        # Set localStorage with ONLY a custom user (simulating the bug condition)
        page.evaluate("""() => {
            const users = [{
                id: 'test_user_1',
                name: 'TEST USER',
                email: 'test@example.com',
                handle: '@TEST_USER',
                role: 'Fan',
                leaguePreference: 'NFL',
                bio: 'Just a test user',
                avatar: null,
                stats: {precision: 50, sync: 50, speed: 50},
                ovr: 50,
                vault: [],
                followingIds: []
            }];
            window.localStorage.setItem('js_pro_accounts_v1', JSON.stringify(users));
            // Clear session so we stay on auth screen
            window.localStorage.removeItem('js_pro_session_v1');
        }""")

        # Reload to apply changes
        page.reload()

        # Wait for the Auth screen to load (look for SIGN_IN button or title)
        expect(page.get_by_text("JERSEYSWAP").first).to_be_visible()

        print("Checking for profiles...")

        # Check for Custom User
        found_custom = False
        try:
            expect(page.get_by_text("TEST USER")).to_be_visible(timeout=3000)
            print("✓ Custom user found")
            found_custom = True
        except:
            print("✗ Custom user NOT found")

        # Check for Demo User 1 (Kyle Smith)
        found_kyle = False
        try:
            expect(page.get_by_text("KYLE SMITH")).to_be_visible(timeout=3000)
            print("✓ Kyle Smith found")
            found_kyle = True
        except:
            print("✗ Kyle Smith NOT found")

        # Check for Demo User 2 (Jordan Villa)
        found_jordan = False
        try:
            expect(page.get_by_text("JORDAN VILLA")).to_be_visible(timeout=3000)
            print("✓ Jordan Villa found")
            found_jordan = True
        except:
            print("✗ Jordan Villa NOT found")

        page.screenshot(path="verification/profiles_check.png")

        if found_custom and found_kyle and found_jordan:
            print("SUCCESS: All profiles are present.")
        else:
            print("FAILURE: Missing profiles.")
            # We want to fail the script if profiles are missing so we know to fix it
            # But during the first run (reproduction), failure is expected.
            # I'll just print status for now.

        browser.close()

if __name__ == "__main__":
    run()
