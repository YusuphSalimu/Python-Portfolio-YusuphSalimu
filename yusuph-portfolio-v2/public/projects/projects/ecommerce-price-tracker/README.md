# E-commerce Price Tracker

An intelligent automation bot that monitors product prices across e-commerce websites, handling dynamic content, pop-ups, and JavaScript-rendered pages using Selenium WebDriver.

## Features

- **Multi-platform Support**: Tracks prices on Amazon, Jumia, Kilimall, and more
- **Dynamic Content Handling**: Uses Selenium to handle JavaScript-rendered pages
- **Pop-up Management**: Automatically handles pop-ups, modals, and cookie banners
- **Price Alerts**: Email notifications when prices drop below target levels
- **Historical Tracking**: Stores price history in SQLite database
- **Comprehensive Reports**: Generates detailed price analysis reports
- **Error Recovery**: Robust error handling and retry mechanisms

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YusuphSalimu/ecommerce-price-tracker.git
cd ecommerce-price-tracker
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Download ChromeDriver:
```bash
# The webdriver-manager will handle this automatically
# Or download manually from https://chromedriver.chromium.org/
```

## Usage

### Basic Price Tracking

```python
from price_tracker import EcommercePriceTracker

# Initialize the tracker
tracker = EcommercePriceTracker(headless=True)

# Search for products
products = tracker.search_products("iPhone 15")

# Save price history
tracker.save_price_history(products)

# Generate price report
report = tracker.generate_price_report("iPhone 15")
print(report)

# Clean up
tracker.close()
```

### Continuous Price Monitoring

```python
# Products to track with target prices
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

# Track prices for 24 hours
tracker.track_prices(products_to_track, duration_hours=24)
```

### Price History Analysis

```python
# Get price history for last 30 days
df = tracker.get_price_history("iPhone 15", days=30)

# Analyze price trends
print(f"Average price: TZS {df['price'].mean():,.0f}")
print(f"Price range: TZS {df['price'].min():,.0f} - TZS {df['price'].max():,.0f}")
print(f"Total records: {len(df)}")
```

## Configuration

### Supported E-commerce Sites

The tracker is configured for multiple Tanzanian and international e-commerce sites:

- **Amazon**: International products with shipping to Tanzania
- **Jumia Tanzania**: Local Tanzanian marketplace
- **Kilimall**: East African e-commerce platform

### Adding New Sites

To add a new e-commerce site, update the `site_configs` dictionary:

```python
self.site_configs['new_site'] = {
    'url': 'https://www.example.com',
    'search_url': 'https://www.example.com/search?q={query}',
    'price_selector': '.price-class',
    'title_selector': '.title-class',
    'product_link_selector': '.product-class',
    'availability_selector': '.stock-class',
    'popup_selectors': ['.popup', '.modal']
}
```

### Email Alerts Setup

Configure email alerts by updating the `send_price_alert` method:

```python
sender_email = "your-email@gmail.com"
receiver_email = "client-email@gmail.com"
password = "your-app-password"  # Use app-specific password
```

## Sample Output

### Product Data Structure
```json
{
    "title": "iPhone 15 Pro Max 256GB",
    "price": 2850000,
    "price_text": "TZS 2,850,000",
    "availability": "In Stock",
    "product_url": "https://www.example.com/iphone15",
    "website": "https://www.jumia.co.tz",
    "scraped_at": "2024-01-15T10:30:00"
}
```

### Price Report
```json
{
    "product_name": "iPhone 15",
    "total_records": 45,
    "price_range": {
        "min": 2500000,
        "max": 3200000,
        "current": 2750000
    },
    "average_price": 2850000,
    "price_trend": "decreasing",
    "websites": {
        "Jumia": 25,
        "Kilimall": 15,
        "Amazon": 5
    },
    "last_updated": "2024-01-15T10:30:00"
}
```

## Database Schema

### Products Table
- `id`: Primary key
- `name`: Product name
- `search_query`: Search term used
- `target_price`: Alert threshold
- `email_alerts`: Boolean for notifications
- `created_at`: Timestamp

### Price History Table
- `id`: Primary key
- `product_name`: Product identifier
- `website`: Source website
- `price`: Numeric price
- `currency`: Currency code
- `availability`: Stock status
- `product_url`: Direct product link
- `timestamp`: Record timestamp

## Technical Details

### Libraries Used
- **Selenium**: Web browser automation
- **Pandas**: Data analysis and manipulation
- **SQLite**: Local database for price history
- **Requests**: HTTP requests for additional data
- **BeautifulSoup**: HTML parsing fallback

### Key Features
- **Headless Operation**: Runs in background without browser UI
- **Dynamic Content**: Handles JavaScript-rendered pages
- **Rate Limiting**: Respects website rate limits
- **Error Recovery**: Continues operation despite individual failures
- **Data Persistence**: SQLite database for historical data

## Error Handling

The tracker includes comprehensive error handling for:
- Network timeouts and connection issues
- Missing elements and selector changes
- Pop-up and modal interference
- Database connection problems
- Email delivery failures

## Performance Optimization

- **Image Loading Disabled**: Faster page loading
- **Headless Mode**: Reduced resource usage
- **Connection Pooling**: Efficient database connections
- **Batch Processing**: Bulk database operations
- **Smart Delays**: Adaptive timing between requests

## Legal Considerations

This tool is for educational and personal use. Always:
- Respect website terms of service
- Implement appropriate rate limiting
- Don't overload servers with excessive requests
- Consider using official APIs when available
- Comply with data protection regulations

## Troubleshooting

### Common Issues

1. **ChromeDriver Issues**:
   ```bash
   # Install webdriver-manager
   pip install webdriver-manager
   ```

2. **Timeout Errors**:
   - Increase wait times in WebDriverWait
   - Check internet connection stability

3. **Selector Changes**:
   - Update CSS selectors in site_configs
   - Use browser developer tools to inspect elements

4. **Database Lock**:
   - Ensure proper connection closing
   - Check for multiple process access

## Contributing

Feel free to submit issues, feature requests, and pull requests!

## Author

**Yusuph Salimu**
- Freelance Web Developer and Data Scientist
- University of Dodoma, Tanzania
- [LinkedIn](https://www.linkedin.com/in/yusuph-salimu-7818333aa/)
- [GitHub](https://github.com/YusuphSalimu)

## License

This project is open source and available under the MIT License.
