import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from pymongo import MongoClient

driver = webdriver.Chrome()
products_data = {"men": [], "women": []}


def make_page_load():
    """Get rid of notifications so page can load"""
    try:
        print("Getting rid of cookie and origin country notifications...")
        time.sleep(2)
        accept_cookies_button = driver.find_element(
            By.ID, "onetrust-accept-btn-handler"
        )
        accept_cookies_button.click()

        # Confirm you are from origin country
        confirm_country_origin = driver.find_element(
            By.CLASS_NAME, "b-form_actions-button_primary"
        )
        confirm_country_origin.click()
    except Exception:
        print("Could not find notifications...")
        print("Continuing with script execution...")


def get_product_links():
    """Get all links to individual products"""
    try:
        product_grid = driver.find_element(By.CSS_SELECTOR, "[data-ref=productGrid]")
        soup = BeautifulSoup(product_grid.get_attribute("outerHTML"), "html.parser")
        sections = soup.find_all("section", class_="b-product_tile")

        return [
            (
                "https://www.allsaints.com"
                + section.find("a", class_="b-product_tile-image_link").get("href")
            )
            for section in sections
        ]
    except Exception:
        print("Could not get product links...")
        print("Continuing with script execution...")


def get_data(gender):
    """Data scraping"""
    try:
        url = f"https://www.allsaints.com/eu/{gender}/new"
        driver.get(url)

        # Sleep in case of CAPTCHA solving
        # time.sleep(40)
        time.sleep(3)

        make_page_load()
        print(f"Fetching all links on page for current gender ({gender})...")
        item_links = get_product_links()
        print("Got all links...")

        for link in item_links:
            driver.get(link)
            print("Scraping product details data...")
            soup = BeautifulSoup(driver.page_source, "html.parser")

            title = soup.select_one("h1.b-product_details-name").text.strip()
            price = float(
                soup.select_one("div.b-price span.b-price-item")
                .text.strip()[1:]
                .replace(",", "")
            )
            static_image_url = soup.select_one("#product-image-0")["src"]
            sizes = [
                size.text.strip()
                for size in soup.select(
                    "div.b-variations_item-content button.b-variation_swatch span.b-variation_swatch-value"
                )
                if len(size.text.strip()) > 0
            ]

            product_type = soup.select(
                "ul.b-breadcrumbs-list li.b-breadcrumbs-item a.b-breadcrumbs-link"
            )[2].text.strip()

            colors = [
                color.get("title").strip()
                for color in soup.select("button.b-variation_swatch.m-swatch")
            ]

            # Append product details to gender's array
            products_data[gender].append(
                {
                    "title": title,
                    "price": price,
                    "url": static_image_url,
                    "gender": gender,
                    "sizes": sizes,
                    "product_type": product_type,
                    "colors": colors,
                }
            )
            print("Item added")
            if len(products_data.get(gender)) > 9:
                break
    except Exception as e:
        print("Exception: ", e)
        print("Something went wrong when trying to scrape the data from the website...")


def save_to_db(products):
    try:
        local_uri = "mongodb://localhost:27017/"
        client = MongoClient(local_uri)
        database = client["avantis"]
        collection = database["products"]

        collection.insert_many(products)
        print("Products added to DB...")

        client.close()
    except Exception as e:
        print("Exception", e)
        print("Could not connect to MongoDB...")


if __name__ == "__main__":
    get_data("men")
    save_to_db(products_data.get("men"))

    get_data("women")
    save_to_db(products_data.get("women"))

    driver.quit()
