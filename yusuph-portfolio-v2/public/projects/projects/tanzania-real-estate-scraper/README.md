# Tanzania Real Estate Scraper

A comprehensive Python-based web scraping solution for collecting property data from Tanzanian real estate websites. This project demonstrates advanced data extraction techniques for local market analysis.

## Features

- **Multi-site scraping**: Collects data from multiple Tanzanian real estate websites
- **Intelligent data extraction**: Extracts property prices, locations, descriptions, and details
- **Error handling**: Robust error handling and retry mechanisms
- **Data export**: Saves data in CSV and JSON formats
- **Rate limiting**: Built-in delays to avoid being blocked
- **Logging**: Comprehensive logging for monitoring and debugging

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YusuphSalimu/tanzania-real-estate-scraper.git
cd tanzania-real-estate-scraper
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

```python
from scraper import TanzaniaRealEstateScraper

# Initialize the scraper
scraper = TanzaniaRealEstateScraper()

# Run the scraper
properties = scraper.run_scraper()

# Get summary statistics
stats = scraper.get_summary_stats()
print(stats)
```

### Demo Mode

```python
# Run with sample data for demonstration
python scraper.py
```

## Data Collected

For each property, the scraper collects:
- Title and description
- Price (numeric and text format)
- Location
- Number of bedrooms and bathrooms
- Property area
- Property link and image URL
- Timestamp of scraping

## Output Files

- `tanzania_properties.csv`: Property data in CSV format
- `tanzania_properties.json`: Property data in JSON format
- `scraper.log`: Detailed scraping log

## Sample Output

```json
{
  "title": "Modern 3 Bedroom Apartment in Masaki",
  "price": 450000000,
  "price_text": "TZS 450,000,000",
  "location": "Masaki, Dar es Salaam",
  "description": "Beautiful modern apartment with sea view",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 150,
  "property_link": "https://example.com/property1",
  "scraped_at": "2024-01-15T10:30:00"
}
```

## Technical Details

### Libraries Used
- **Requests**: HTTP library for making web requests
- **BeautifulSoup**: HTML parsing and data extraction
- **Pandas**: Data manipulation and analysis
- **Logging**: Comprehensive logging system

### Key Features
- **Session management**: Maintains HTTP sessions for efficient scraping
- **Random delays**: Prevents IP blocking with random request intervals
- **Data cleaning**: Automatic text cleaning and normalization
- **Price extraction**: Intelligent price parsing from various formats
- **Error recovery**: Handles network errors and parsing failures

## Configuration

You can customize the scraper by modifying:
- Target URLs in `self.target_urls`
- Rate limiting parameters
- Data extraction selectors
- Output file names

## Legal Considerations

This scraper is designed for educational and research purposes. Always:
- Respect website terms of service
- Implement appropriate rate limiting
- Don't overload servers with excessive requests
- Consider using official APIs when available

## Contributing

Feel free to submit issues and enhancement requests!

## Author

**Yusuph Salimu**
- Freelance Web Developer and Data Scientist
- University of Dodoma, Tanzania
- [LinkedIn](https://www.linkedin.com/in/yusuph-salimu-7818333aa/)
- [GitHub](https://github.com/YusuphSalimu)

## License

This project is open source and available under the MIT License.
