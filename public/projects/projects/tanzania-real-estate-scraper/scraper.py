#!/usr/bin/env python3
"""
Tanzania Real Estate Scraper
A comprehensive web scraping solution for collecting property data from Tanzanian real estate websites.
Author: Yusuph Salimu
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from urllib.parse import urljoin, urlparse
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)

class TanzaniaRealEstateScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.properties_data = []
        
        # Sample Tanzanian real estate websites
        self.target_urls = [
            'https://www.tanzania-property.com/properties-for-sale',
            'https://www.buyrenttz.com/properties',
            'https://www.propertypro.co.tz/properties-for-sale'
        ]
    
    def get_random_delay(self, min_delay=1, max_delay=3):
        """Add random delay to avoid being blocked"""
        return random.uniform(min_delay, max_delay)
    
    def clean_text(self, text):
        """Clean and normalize text data"""
        if text:
            return ' '.join(text.strip().split())
        return ''
    
    def extract_price(self, price_text):
        """Extract numeric price from text"""
        if price_text:
            # Remove currency symbols and convert to number
            import re
            price = re.sub(r'[^\d.]', '', price_text)
            try:
                return float(price)
            except:
                return None
        return None
    
    def scrape_property_listings(self, url):
        """Scrape property listings from a given URL"""
        try:
            logging.info(f"Scraping: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            properties = []
            
            # Find property listings (this will vary by website structure)
            # This is a generic implementation - would need customization for each site
            property_cards = soup.find_all('div', class_=['property-card', 'listing-item', 'property-item'])
            
            if not property_cards:
                # Try alternative selectors
                property_cards = soup.find_all('article', class_='property')
            
            for card in property_cards:
                property_data = self.extract_property_data(card)
                if property_data:
                    properties.append(property_data)
                    self.properties_data.append(property_data)
            
            logging.info(f"Found {len(properties)} properties on {url}")
            return properties
            
        except requests.RequestException as e:
            logging.error(f"Error scraping {url}: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error scraping {url}: {e}")
            return []
    
    def extract_property_data(self, card):
        """Extract property data from a property card"""
        try:
            # Title
            title_elem = card.find('h2') or card.find('h3') or card.find('a', class_='title')
            title = self.clean_text(title_elem.get_text()) if title_elem else ''
            
            # Price
            price_elem = card.find('span', class_='price') or card.find('div', class_='price')
            price_text = self.clean_text(price_elem.get_text()) if price_elem else ''
            price = self.extract_price(price_text)
            
            # Location
            location_elem = card.find('span', class_='location') or card.find('div', class_='location')
            location = self.clean_text(location_elem.get_text()) if location_elem else ''
            
            # Description
            desc_elem = card.find('p', class_='description') or card.find('div', class_='description')
            description = self.clean_text(desc_elem.get_text()) if desc_elem else ''
            
            # Property details (bedrooms, bathrooms, area)
            details = self.extract_property_details(card)
            
            # Property link
            link_elem = card.find('a', href=True)
            property_link = link_elem['href'] if link_elem else ''
            
            # Image
            img_elem = card.find('img')
            image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else ''
            
            return {
                'title': title,
                'price': price,
                'price_text': price_text,
                'location': location,
                'description': description,
                'bedrooms': details.get('bedrooms'),
                'bathrooms': details.get('bathrooms'),
                'area': details.get('area'),
                'property_link': property_link,
                'image_url': image_url,
                'scraped_at': datetime.now().isoformat(),
                'source': 'tanzania_real_estate'
            }
            
        except Exception as e:
            logging.error(f"Error extracting property data: {e}")
            return None
    
    def extract_property_details(self, card):
        """Extract specific property details like bedrooms, bathrooms, area"""
        details = {}
        
        # Look for bedrooms
        bedroom_elem = card.find('span', class_='bedrooms') or card.find('i', class_='bed')
        if bedroom_elem:
            bedroom_text = self.clean_text(bedroom_elem.get_text())
            import re
            bedroom_match = re.search(r'\d+', bedroom_text)
            details['bedrooms'] = int(bedroom_match.group()) if bedroom_match else None
        
        # Look for bathrooms
        bathroom_elem = card.find('span', class_='bathrooms') or card.find('i', class_='bath')
        if bathroom_elem:
            bathroom_text = self.clean_text(bathroom_elem.get_text())
            import re
            bathroom_match = re.search(r'\d+', bathroom_text)
            details['bathrooms'] = int(bathroom_match.group()) if bathroom_match else None
        
        # Look for area
        area_elem = card.find('span', class_='area') or card.find('div', class_='size')
        if area_elem:
            area_text = self.clean_text(area_elem.get_text())
            import re
            area_match = re.search(r'[\d.]+', area_text)
            details['area'] = float(area_match.group()) if area_match else None
        
        return details
    
    def save_to_csv(self, filename='tanzania_properties.csv'):
        """Save scraped data to CSV file"""
        if not self.properties_data:
            logging.warning("No data to save")
            return
        
        df = pd.DataFrame(self.properties_data)
        df.to_csv(filename, index=False, encoding='utf-8')
        logging.info(f"Data saved to {filename}")
    
    def save_to_json(self, filename='tanzania_properties.json'):
        """Save scraped data to JSON file"""
        if not self.properties_data:
            logging.warning("No data to save")
            return
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.properties_data, f, indent=2, ensure_ascii=False)
        logging.info(f"Data saved to {filename}")
    
    def run_scraper(self):
        """Main method to run the scraper"""
        logging.info("Starting Tanzania Real Estate Scraper")
        
        for url in self.target_urls:
            properties = self.scrape_property_listings(url)
            time.sleep(self.get_random_delay())
        
        # Save data
        self.save_to_csv()
        self.save_to_json()
        
        logging.info(f"Scraping completed. Total properties found: {len(self.properties_data)}")
        
        return self.properties_data
    
    def get_summary_stats(self):
        """Get summary statistics of scraped data"""
        if not self.properties_data:
            return {}
        
        df = pd.DataFrame(self.properties_data)
        
        stats = {
            'total_properties': len(df),
            'properties_with_prices': len(df[df['price'].notna()]),
            'average_price': df['price'].mean() if df['price'].notna().any() else 0,
            'price_range': {
                'min': df['price'].min() if df['price'].notna().any() else 0,
                'max': df['price'].max() if df['price'].notna().any() else 0
            },
            'locations': df['location'].value_counts().head(10).to_dict(),
            'bedroom_distribution': df['bedrooms'].value_counts().to_dict()
        }
        
        return stats

# Demo function for testing
def demo_scraper():
    """Demonstration of the scraper functionality"""
    scraper = TanzaniaRealEstateScraper()
    
    # For demonstration, we'll use a sample approach
    # In real implementation, this would scrape actual websites
    
    # Sample data for demonstration
    sample_properties = [
        {
            'title': 'Modern 3 Bedroom Apartment in Masaki',
            'price': 450000000,  # TZS
            'price_text': 'TZS 450,000,000',
            'location': 'Masaki, Dar es Salaam',
            'description': 'Beautiful modern apartment with sea view, 3 bedrooms, 2 bathrooms',
            'bedrooms': 3,
            'bathrooms': 2,
            'area': 150,
            'property_link': 'https://example.com/property1',
            'image_url': 'https://example.com/image1.jpg',
            'scraped_at': datetime.now().isoformat(),
            'source': 'tanzania_real_estate'
        },
        {
            'title': 'Luxury Villa in Mikocheni',
            'price': 850000000,  # TZS
            'price_text': 'TZS 850,000,000',
            'location': 'Mikocheni, Dar es Salaam',
            'description': 'Spacious luxury villa with swimming pool, 5 bedrooms, 4 bathrooms',
            'bedrooms': 5,
            'bathrooms': 4,
            'area': 400,
            'property_link': 'https://example.com/property2',
            'image_url': 'https://example.com/image2.jpg',
            'scraped_at': datetime.now().isoformat(),
            'source': 'tanzania_real_estate'
        }
    ]
    
    scraper.properties_data = sample_properties
    scraper.save_to_csv()
    scraper.save_to_json()
    
    stats = scraper.get_summary_stats()
    print("Scraping Summary:")
    print(json.dumps(stats, indent=2))
    
    return scraper.properties_data

if __name__ == "__main__":
    # Run the scraper
    scraper = TanzaniaRealEstateScraper()
    
    # For demo purposes, use sample data
    # In production, uncomment: scraper.run_scraper()
    demo_scraper()
