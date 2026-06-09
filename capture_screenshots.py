from playwright.sync_api import sync_playwright
import os

pages = [
    ("home", "https://opticacarballo.com.ar/"),
    ("categoria", "https://opticacarballo.com.ar/anteojos-de-sol"),
    ("producto", "https://opticacarballo.com.ar/anteojos-de-sol/rusty/rusty-xold"),
    ("carrito", "https://opticacarballo.com.ar/carrito"),
]

viewports = [
    ("desktop", 1920, 1080),
    ("mobile", 375, 812),
]

output_dir = "/Users/juan/Proyectos web/optica-carballo/screenshots"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    for vp_name, width, height in viewports:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})

        for page_name, url in pages:
            print(f"Capturing {page_name} @ {vp_name} ({width}x{height})...")
            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)
                path = f"{output_dir}/{page_name}_{vp_name}.png"
                page.screenshot(path=path, full_page=False)
                print(f"  Saved: {path}")

                # Also capture full page
                path_full = f"{output_dir}/{page_name}_{vp_name}_full.png"
                page.screenshot(path=path_full, full_page=True)
                print(f"  Saved full: {path_full}")

            except Exception as e:
                print(f"  ERROR: {e}")

        browser.close()

print("Done.")
