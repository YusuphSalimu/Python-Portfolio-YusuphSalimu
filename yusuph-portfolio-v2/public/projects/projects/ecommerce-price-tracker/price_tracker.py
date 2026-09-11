#!/usr/bin/env python3
"""
E-commerce Price Tracker
An intelligent automation bot that monitors product prices across e-commerce websites.
Handles dynamic content, pop-ups, and JavaScript-rendered pages using Selenium.
Author: Yusuph Salimu
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
import pandas as pd
import time
import json
from datetime import datetime, timedelta
import logging
import re
from typing import Dict, List, Optional
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('price_tracker.log'),
        logging.StreamHandler()
    ]
)

class EcommercePriceTracker:
    def __init__(self, headless: bool = True):
        """Initialize the price tracker with Selenium WebDriver"""
        self.setup_driver(headless)
        self.setup_database()
        self.products = []
        
        # Target e-commerce sites and their configurations
        self.site_configs = {
            'amazon': {
                'url': 'https://www.amazon.com',
                'search_url': 'https://www.amazon.com/s?k={query}',
                'price_selector': '.a-price-whole',
                'title_selector': '[data-component-type="s-search-result"] h2 a span',
                'product_link_selector': '[data-component-type="s-search-result"] h2 a',
                'availability_selector': '.a-color-success',
                'popup_selectors': ['#sp-cc-accept', '.a-popover-modal']
            },
            'jumia': {
                'url': 'https://www.jumia.co.tz',
                'search_url': 'https://www.jumia.co.tz/catalog/?q={query}',
                'price_selector': '.price .dir-ltr',
                'title_selector': '.name',
                'product_link_selector': '.core',
                'availability_selector': '.availability',
                'popup_selectors': ['.pop', '.modal', '.newsletter-popup']
            },
            'kili': {
                'url': 'https://www.kilimall.com',
                'search_url': 'https://www.kilimall.com/search?keyword={query}',
                'price_selector': '.price',
                'title_selector': '.title',
                'product_link_selector': '.goods-item',
                'availability_selector': '.stock',
                'popup_selectors': ['.popup', '.modal-dialog']
            }
        }
    
    def setup_driver(self, headless: bool):
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()
        
        if headless:
            chrome_options.add_argument('--headless')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        
        # Disable notifications
        prefs = {
            "profile.default_content_setting_values.notifications": 2,
            "profile.managed_default_content_settings.images": 2  # Disable images for faster loading
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.wait = WebDriverWait(self.driver, 10)
            logging.info("WebDriver initialized successfully")
        except WebDriverException as e:
            logging.error(f"Failed to initialize WebDriver: {e}")
            raise
    
    def setup_database(self):
        """Setup SQLite database for storing price history"""
        self.conn = sqlite3.connect('price_history.db')
        cursor = self.conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_name TEXT,
                website TEXT,
                price REAL,
                currency TEXT,
                availability TEXT,
                product_url TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                search_query TEXT,
                target_price REAL,
                email_alerts BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
        logging.info("Database initialized successfully")
    
    def handle_popups(self, site_config: Dict):
        """Handle common pop-ups and modals"""
        try:
            for popup_selector in site_config.get('popup_selectors', []):
                try:
                    popup = self.wait.until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, popup_selector))
                    )
                    popup.click()
                    logging.info(f"Closed popup: {popup_selector}")
                    time.sleep(1)
                except TimeoutException:
                    continue
        except Exception as e:
            logging.error(f"Error handling popups: {e}")
    
    def scroll_to_load_content(self):
        """Scroll down to load dynamic content"""
        try:
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            
            for _ in range(3):  # Scroll 3 times
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
                
        except Exception as e:
            logging.error(f"Error scrolling: {e}")
    
    def clean_price(self, price_text: str) -> Optional[float]:
        """Extract numeric price from text"""
        if not price_text:
            return None
        
        # Remove currency symbols and extract numbers
        price_clean = re.sub(r'[^\d.,]', '', price_text)
        price_clean = price_clean.replace(',', '')
        
        try:
            return float(price_clean)
        except ValueError:
            return None
    
    def extract_product_data(self, site_config: Dict, search_query: str) -> List[Dict]:
        """Extract product data from search results"""
        products = []
        
        try:
            # Handle popups first
            self.handle_popups(site_config)
            
            # Scroll to load dynamic content
            self.scroll_to_load_content()
            
            # Wait for products to load
            self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, site_config['title_selector']))
            )
            
            # Extract product information
            product_elements = self.driver.find_elements(By.CSS_SELECTOR, site_config['product_link_selector'])
            
            for element in product_elements[:10]:  # Limit to first 10 products
                try:
                    product_data = self.extract_single_product(element, site_config)
                    if product_data:
                        products.append(product_data)
                except Exception as e:
                    logging.error(f"Error extracting single product: {e}")
                    continue
            
            logging.info(f"Extracted {len(products)} products from {site_config['url']}")
            
        except TimeoutException:
            logging.error(f"Timeout waiting for products on {site_config['url']}")
        except Exception as e:
            logging.error(f"Error extracting products: {e}")
        
        return products
    
    def extract_single_product(self, element, site_config: Dict) -> Optional[Dict]:
        """Extract data from a single product element"""
        try:
            # Product title
            title_elem = element.find_element(By.CSS_SELECTOR, site_config['title_selector'])
            title = title_elem.text.strip()
            
            # Product price
            try:
                price_elem = element.find_element(By.CSS_SELECTOR, site_config['price_selector'])
                price_text = price_elem.text.strip()
                price = self.clean_price(price_text)
            except NoSuchElementException:
                price_text = "Price not available"
                price = None
            
            # Product URL
            try:
                link_elem = element.find_element(By.TAG_NAME, 'a')
                product_url = link_elem.get_attribute('href')
                if not product_url.startswith('http'):
                    product_url = site_config['url'] + product_url
            except NoSuchElementException:
                product_url = ""
            
            # Availability
            try:
                avail_elem = element.find_element(By.CSS_SELECTOR, site_config['availability_selector'])
                availability = avail_elem.text.strip()
            except NoSuchElementException:
                availability = "Available"
            
            return {
                'title': title,
                'price': price,
                'price_text': price_text,
                'availability': availability,
                'product_url': product_url,
                'website': site_config['url'],
                'scraped_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Error extracting product data: {e}")
            return None
    
    def search_products(self, query: str, sites: List[str] = None) -> List[Dict]:
        """Search for products across multiple e-commerce sites"""
        if sites is None:
            sites = ['amazon', 'jumia', 'kili']
        
        all_products = []
        
        for site in sites:
            if site not in self.site_configs:
                logging.warning(f"Site {site} not configured")
                continue
            
            site_config = self.site_configs[site]
            
            try:
                # Navigate to search page
                search_url = site_config['search_url'].format(query=query.replace(' ', '+'))
                logging.info(f"Searching {site} for: {query}")
                
                self.driver.get(search_url)
                time.sleep(3)  # Wait for page to load
                
                # Extract products
                products = self.extract_product_data(site_config, query)
                all_products.extend(products)
                
                # Random delay between requests
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"Error searching {site}: {e}")
                continue
        
        return all_products
    
    def save_price_history(self, products: List[Dict]):
        """Save price history to database"""
        cursor = self.conn.cursor()
        
        for product in products:
            cursor.execute('''
                INSERT INTO price_history 
                (product_name, website, price, currency, availability, product_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                product['title'],
                product['website'],
                product['price'],
                'TZS',  # Default currency
                product['availability'],
                product['product_url']
            ))
        
        self.conn.commit()
        logging.info(f"Saved {len(products)} price records to database")
    
    def get_price_history(self, product_name: str, days: int = 30) -> pd.DataFrame:
        """Get price history for a specific product"""
        query = '''
            SELECT * FROM price_history 
            WHERE product_name LIKE ? 
            AND timestamp >= datetime('now', '-{} days')
            ORDER BY timestamp DESC
        '''.format(days)
        
        return pd.read_sql_query(query, self.conn, params=(f'%{product_name}%',))
    
    def send_price_alert(self, product: Dict, target_price: float):
        """Send email alert when price drops below target"""
        try:
            # Email configuration (update with your details)
            sender_email = "your-email@gmail.com"
            receiver_email = "client-email@gmail.com"
            password = "your-app-password"
            
            subject = f"Price Alert: {product['title']}"
            body = f"""
            Good news! The price of {product['title']} has dropped to {product['price_text']}.
            
            Current Price: {product['price_text']}
            Target Price: TZS {target_price:,.0f}
            Website: {product['website']}
            Product Link: {product['product_url']}
            
            Click here to purchase: {product['product_url']}
            """
            
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = receiver_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email (commented out for demo)
            # server = smtplib.SMTP('smtp.gmail.com', 587)
            # server.starttls()
            # server.login(sender_email, password)
            # server.send_message(msg)
            # server.quit()
            
            logging.info(f"Price alert sent for {product['title']}")
            
        except Exception as e:
            logging.error(f"Error sending price alert: {e}")
    
    def track_prices(self, products_to_track: List[Dict], duration_hours: int = 24):
        """Track prices for specified products over time"""
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=duration_hours)
        
        logging.info(f"Starting price tracking for {duration_hours} hours")
        
        while datetime.now() < end_time:
            for product_config in products_to_track:
                query = product_config['search_query']
                target_price = product_config.get('target_price')
                
                # Search for products
                products = self.search_products(query)
                
                # Check for price drops
                for product in products:
                    if target_price and product['price'] and product['price'] <= target_price:
                        self.send_price_alert(product, target_price)
                
                # Save to database
                self.save_price_history(products)
                
                # Wait between different products
                time.sleep(5)
            
            # Wait between tracking cycles (every hour)
            time.sleep(3600)
        
        logging.info("Price tracking completed")
    
    def generate_price_report(self, product_name: str) -> Dict:
        """Generate comprehensive price report for a product"""
        df = self.get_price_history(product_name)
        
        if df.empty:
            return {"error": "No price history found"}
        
        report = {
            'product_name': product_name,
            'total_records': len(df),
            'price_range': {
                'min': df['price'].min(),
                'max': df['price'].max(),
                'current': df['price'].iloc[0] if not df.empty else None
            },
            'average_price': df['price'].mean(),
            'price_trend': 'decreasing' if df['price'].iloc[0] < df['price'].iloc[-1] else 'increasing',
            'websites': df['website'].value_counts().to_dict(),
            'last_updated': df['timestamp'].iloc[0]
        }
        
        return report
    
    def close(self):
        """Clean up resources"""
        if hasattr(self, 'driver'):
            self.driver.quit()
        if hasattr(self, 'conn'):
            self.conn.close()
        logging.info("Price tracker closed")

# Demo function
def demo_price_tracker():
    """Demonstration of the price tracker functionality"""
    tracker = EcommercePriceTracker(headless=True)
    
    try:
        # Sample products to track
        products_to_track = [
            {
                'name': 'iPhone 15',
                'search_query': 'iPhone 15',
                'target_price': 1500000  # TZS
            },
            {
                'name': 'Samsung TV',
                'search_query': 'Samsung Smart TV',
                'target_price': 800000  # TZS
            }
        ]
        
        # Search for products
        all_products = []
        for product_config in products_to_track:
            products = tracker.search_products(product_config['search_query'])
            all_products.extend(products)
            
            # Save to database
            tracker.save_price_history(products)
            
            # Generate report
            report = tracker.generate_price_report(product_config['name'])
            print(f"\nPrice Report for {product_config['name']}:")
            print(json.dumps(report, indent=2, default=str))
        
        # Sample price history data for demo
        print(f"\nTotal products found: {len(all_products)}")
        print("Sample products:")
        for i, product in enumerate(all_products[:3]):
            print(f"{i+1}. {product['title']} - {product['price_text']}")
        
        return all_products
        
    except Exception as e:
        logging.error(f"Error in demo: {e}")
        return []
    finally:
        tracker.close()

if __name__ == "__main__":
    # Run demo
    demo_price_tracker()
