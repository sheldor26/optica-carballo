from playwright.sync_api import sync_playwright
import os

output_dir = "/Users/juan/Proyectos web/optica-carballo/screenshots"
os.makedirs(output_dir, exist_ok=True)

url = "https://opticacarballo.com.ar/anteojos-de-sol/rusty/rusty-xold"

viewports = [
    ("desktop", 1920, 1080),
    ("mobile", 375, 812),
]

with sync_playwright() as p:
    for vp_name, width, height in viewports:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        print(f"Capturing producto @ {vp_name}...")
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(4000)
            path = f"{output_dir}/producto_{vp_name}.png"
            page.screenshot(path=path, full_page=False)
            print(f"  Saved above-the-fold: {path}")

            path_full = f"{output_dir}/producto_{vp_name}_full.png"
            page.screenshot(path=path_full, full_page=True)
            print(f"  Saved full: {path_full}")
        except Exception as e:
            print(f"  ERROR: {e}")
            # Try to screenshot whatever loaded
            try:
                path = f"{output_dir}/producto_{vp_name}_partial.png"
                page.screenshot(path=path, full_page=False)
                print(f"  Saved partial: {path}")
            except:
                pass
        browser.close()

print("Done.")
