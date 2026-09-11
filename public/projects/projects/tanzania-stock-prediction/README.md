# Tanzania Stock Market Prediction

A comprehensive machine learning project for analyzing and predicting stock prices in the Tanzania stock market. This project demonstrates advanced financial data analysis, technical indicator implementation, and multiple predictive modeling techniques.

## Features

- **Multiple ML Algorithms**: Linear Regression, Random Forest, Gradient Boosting, and LSTM Neural Networks
- **Technical Indicators**: RSI, MACD, Bollinger Bands, Moving Averages, Stochastic Oscillator, ATR
- **Time Series Analysis**: Specialized handling for financial time series data
- **Comprehensive Evaluation**: Multiple metrics including RMSE, MAE, R², and MAPE
- **Visualization**: Interactive plots for predictions and feature importance
- **Real-time Predictions**: Future stock price forecasting capabilities

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YusuphSalimu/tanzania-stock-prediction.git
cd tanzania-stock-prediction
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. For GPU support with TensorFlow (optional):
```bash
pip install tensorflow-gpu
```

## Usage

### Basic Stock Prediction

```python
from stock_predictor import TanzaniaStockPredictor

# Initialize the predictor
predictor = TanzaniaStockPredictor()

# Load stock data (using sample data for demo)
data = predictor.generate_sample_data('TBL', days=1000)

# Add technical indicators
data_with_indicators = predictor.add_technical_indicators()

# Prepare features
X, y = predictor.prepare_features()

# Split data
X_train, X_test, y_train, y_test = predictor.split_data(X, y)

# Train models
predictor.train_random_forest(X_train, y_train)
predictor.train_lstm(X_train, y_train)

# Evaluate models
results = predictor.evaluate_models(X_test, y_test)

# Make predictions
predictions = predictor.make_predictions()
print(predictions)
```

### Complete Analysis Pipeline

```python
# Run complete analysis
predictor, results, predictions = demo_stock_prediction()

# Generate comprehensive report
report = predictor.generate_report()
print(f"Best model: {report['best_model']['name']}")

# Save best model
predictor.save_model('Random Forest', 'rf_model.pkl')
```

## Supported Tanzanian Stocks

The system includes data for major Tanzanian companies:

- **TBL** - Tanzania Breweries Limited
- **TCC** - Tanzania Cigarette Company  
- **TCCL** - Tanzania Cement Company
- **NMB** - National Microfinance Bank
- **CRDB** - CRDB Bank
- **SIMBA** - Simba Corp
- **SWISSPORT** - Swissport Tanzania
- **TOL** - Tanzania Oil Limited

## Technical Indicators

### Moving Averages
- Simple Moving Averages (5, 10, 20, 50 days)
- Exponential Moving Averages (12, 26 days)

### Momentum Indicators
- **RSI** (Relative Strength Index): Measures overbought/oversold conditions
- **MACD** (Moving Average Convergence Divergence): Trend following momentum
- **Stochastic Oscillator**: Momentum indicator comparing closing price to price range

### Volatility Indicators
- **Bollinger Bands**: Price volatility bands around moving average
- **ATR** (Average True Range): Market volatility measure

### Volume Indicators
- Volume SMA and Volume Ratio for volume analysis

## Machine Learning Models

### 1. Linear Regression
- Baseline model for comparison
- Fast training and interpretation
- Good for linear relationships

### 2. Random Forest
- Ensemble of decision trees
- Handles non-linear relationships
- Provides feature importance
- Robust to overfitting

### 3. Gradient Boosting
- Sequential ensemble learning
- High predictive accuracy
- Handles complex patterns

### 4. LSTM (Long Short-Term Memory)
- Deep learning for sequences
- Captures temporal dependencies
- Best for time series patterns
- Requires more computational resources

## Model Evaluation Metrics

- **RMSE** (Root Mean Square Error): Standard deviation of prediction errors
- **MAE** (Mean Absolute Error): Average absolute prediction error
- **R²** (R-squared): Proportion of variance explained by model
- **MAPE** (Mean Absolute Percentage Error): Percentage-based accuracy measure

## Sample Output

### Model Performance
```
Model Performance Results:
------------------------------------------------------------

Random Forest:
  RMSE: TZS 245.67
  MAE: TZS 189.23
  R² Score: 0.8745
  MAPE: 1.23%

LSTM:
  RMSE: TZS 198.45
  MAE: TZS 156.78
  R² Score: 0.9123
  MAPE: 0.98%
```

### Predictions
```
Next Day Price Predictions:
----------------------------------------
Random Forest: TZS 15,234.56
LSTM: TZS 15,198.34
Gradient Boosting: TZS 15,267.89
Linear Regression: TZS 15,145.23
```

## Visualization Features

### Prediction Plots
- Actual vs Predicted prices comparison
- Time series visualization
- Model performance comparison

### Feature Importance
- Random Forest feature importance ranking
- Technical indicator impact analysis
- Feature selection insights

## Data Processing Pipeline

1. **Data Collection**: Historical stock price data
2. **Feature Engineering**: Technical indicators and price transformations
3. **Data Preprocessing**: Scaling and sequence preparation
4. **Model Training**: Multiple algorithm training
5. **Evaluation**: Comprehensive performance metrics
6. **Prediction**: Future price forecasting
7. **Visualization**: Results presentation

## Advanced Features

### Custom Technical Indicators
```python
# Add custom indicators
def custom_indicator(data):
    # Your custom logic here
    return data

predictor.add_technical_indicators()
predictor.data = custom_indicator(predictor.data)
```

### Model Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV

# Example for Random Forest
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [10, 15, 20],
    'min_samples_split': [2, 5, 10]
}

rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=5)
grid_search.fit(X_train, y_train)
```

### Ensemble Predictions
```python
# Combine multiple model predictions
def ensemble_predict(models, X):
    predictions = []
    for model in models.values():
        pred = model.predict(X)
        predictions.append(pred)
    return np.mean(predictions, axis=0)

ensemble_pred = ensemble_predict(predictor.models, X_test)
```

## Performance Optimization

- **Parallel Processing**: Use n_jobs=-1 for Random Forest
- **GPU Acceleration**: TensorFlow GPU support for LSTM
- **Memory Management**: Batch processing for large datasets
- **Caching**: Save processed features and models

## Risk Management

### Important Considerations
- Stock market prediction involves inherent uncertainty
- Past performance doesn't guarantee future results
- Models should be used as decision support tools
- Always consider fundamental analysis alongside technical analysis

### Limitations
- Market sentiment and news not included
- External economic factors not modeled
- Black swan events not predictable
- Model performance may degrade over time

## Contributing

Feel free to contribute by:
- Adding new technical indicators
- Implementing additional ML models
- Improving data sources
- Enhancing visualizations
- Adding risk management features

## Author

**Yusuph Salimu**
- Freelance Data Scientist and Machine Learning Engineer
- University of Dodoma, Tanzania
- [LinkedIn](https://www.linkedin.com/in/yusuph-salimu-7818333aa/)
- [GitHub](https://github.com/YusuphSalimu)

## License

This project is open source and available under the MIT License.

## Disclaimer

This project is for educational and research purposes only. Stock market predictions should not be used as the sole basis for investment decisions. Always consult with financial professionals before making investment decisions.
