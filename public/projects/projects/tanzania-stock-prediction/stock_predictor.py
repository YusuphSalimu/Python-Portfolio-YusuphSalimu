#!/usr/bin/env python3
"""
Tanzania Stock Market Prediction
A comprehensive machine learning project for predicting stock prices in the Tanzania stock market.
Features multiple ML algorithms, technical indicators, and financial analysis.
Author: Yusuph Salimu
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, GRU
import yfinance as yf
import warnings
warnings.filterwarnings('ignore')

# Set style for plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class TanzaniaStockPredictor:
    def __init__(self):
        self.data = None
        self.scaler = MinMaxScaler()
        self.models = {}
        self.predictions = {}
        self.feature_columns = []
        
        # Tanzania stock market symbols (sample data for demonstration)
        self.tanzania_stocks = {
            'TBL': 'Tanzania Breweries Limited',
            'TCC': 'Tanzania Cigarette Company',
            'TCCL': 'Tanzania Cement Company',
            'NMB': 'National Microfinance Bank',
            'CRDB': 'CRDB Bank',
            'SIMBA': 'Simba Corp',
            'SWISSPORT': 'Swissport Tanzania',
            'TOL': 'Tanzania Oil Limited'
        }
    
    def generate_sample_data(self, symbol='TBL', days=1000):
        """Generate realistic sample stock data for Tanzanian market"""
        np.random.seed(42)
        
        # Create date range
        dates = pd.date_range(start='2020-01-01', periods=days, freq='D')
        dates = dates[dates.weekday < 5]  # Remove weekends
        
        # Generate realistic price movements
        initial_price = 15000  # TZS initial price
        
        # Generate random walk with trend
        returns = np.random.normal(0.0005, 0.02, len(dates))  # Daily returns
        prices = [initial_price]
        
        for ret in returns[1:]:
            new_price = prices[-1] * (1 + ret)
            prices.append(max(new_price, 1000))  # Minimum price floor
        
        # Create OHLC data
        data = pd.DataFrame({
            'Date': dates,
            'Open': prices,
            'High': [p * (1 + abs(np.random.normal(0, 0.01))) for p in prices],
            'Low': [p * (1 - abs(np.random.normal(0, 0.01))) for p in prices],
            'Close': prices,
            'Volume': np.random.randint(100000, 1000000, len(dates))
        })
        
        # Adjust High/Low to be realistic
        data['High'] = np.maximum(data['High'], data['Open'])
        data['High'] = np.maximum(data['High'], data['Close'])
        data['Low'] = np.minimum(data['Low'], data['Open'])
        data['Low'] = np.minimum(data['Low'], data['Close'])
        
        data['Symbol'] = symbol
        data['Company'] = self.tanzania_stocks.get(symbol, 'Unknown Company')
        
        self.data = data
        return data
    
    def fetch_real_data(self, symbol, period='2y'):
        """Fetch real stock data (would work with real market data)"""
        try:
            # For demonstration, use sample data
            # In production, this would connect to real market data APIs
            return self.generate_sample_data(symbol)
        except Exception as e:
            print(f"Error fetching data: {e}")
            return self.generate_sample_data(symbol)
    
    def add_technical_indicators(self):
        """Add technical indicators to the dataset"""
        if self.data is None:
            raise ValueError("No data available. Load data first.")
        
        df = self.data.copy()
        
        # Moving Averages
        df['MA_5'] = df['Close'].rolling(window=5).mean()
        df['MA_10'] = df['Close'].rolling(window=10).mean()
        df['MA_20'] = df['Close'].rolling(window=20).mean()
        df['MA_50'] = df['Close'].rolling(window=50).mean()
        
        # Exponential Moving Averages
        df['EMA_12'] = df['Close'].ewm(span=12).mean()
        df['EMA_26'] = df['Close'].ewm(span=26).mean()
        
        # MACD
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
        
        # RSI (Relative Strength Index)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # Bollinger Bands
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        bb_std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (bb_std * 2)
        df['BB_Lower'] = df['BB_Middle'] - (bb_std * 2)
        df['BB_Width'] = df['BB_Upper'] - df['BB_Lower']
        
        # Stochastic Oscillator
        low_14 = df['Low'].rolling(window=14).min()
        high_14 = df['High'].rolling(window=14).max()
        df['Stoch_K'] = 100 * ((df['Close'] - low_14) / (high_14 - low_14))
        df['Stoch_D'] = df['Stoch_K'].rolling(window=3).mean()
        
        # Average True Range (ATR)
        high_low = df['High'] - df['Low']
        high_close = np.abs(df['High'] - df['Close'].shift())
        low_close = np.abs(df['Low'] - df['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = ranges.max(axis=1)
        df['ATR'] = true_range.rolling(window=14).mean()
        
        # Volume indicators
        df['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
        df['Volume_Ratio'] = df['Volume'] / df['Volume_SMA']
        
        # Price change indicators
        df['Price_Change'] = df['Close'].pct_change()
        df['Price_Change_5'] = df['Close'].pct_change(5)
        df['Price_Change_10'] = df['Close'].pct_change(10)
        
        # Volatility
        df['Volatility'] = df['Price_Change'].rolling(window=20).std()
        
        # Target variable (next day's closing price)
        df['Target'] = df['Close'].shift(-1)
        
        # Drop rows with NaN values
        df = df.dropna()
        
        self.data = df
        return df
    
    def prepare_features(self):
        """Prepare feature set for machine learning"""
        if self.data is None:
            raise ValueError("No data available. Load and process data first.")
        
        # Select feature columns (exclude target and non-numeric columns)
        exclude_cols = ['Date', 'Symbol', 'Company', 'Target']
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns
        self.feature_columns = [col for col in numeric_cols if col not in exclude_cols]
        
        X = self.data[self.feature_columns]
        y = self.data['Target']
        
        return X, y
    
    def split_data(self, X, y, test_size=0.2):
        """Split data into training and testing sets with time series consideration"""
        # Use time-based split for time series data
        split_index = int(len(X) * (1 - test_size))
        
        X_train = X.iloc[:split_index]
        X_test = X.iloc[split_index:]
        y_train = y.iloc[:split_index]
        y_test = y.iloc[split_index:]
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def train_linear_regression(self, X_train, y_train):
        """Train Linear Regression model"""
        model = LinearRegression()
        model.fit(X_train, y_train)
        self.models['Linear Regression'] = model
        return model
    
    def train_random_forest(self, X_train, y_train):
        """Train Random Forest model"""
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        self.models['Random Forest'] = model
        return model
    
    def train_gradient_boosting(self, X_train, y_train):
        """Train Gradient Boosting model"""
        model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        model.fit(X_train, y_train)
        self.models['Gradient Boosting'] = model
        return model
    
    def train_lstm(self, X_train, y_train, sequence_length=60):
        """Train LSTM model for time series prediction"""
        # Prepare sequences for LSTM
        X_seq, y_seq = [], []
        
        for i in range(sequence_length, len(X_train)):
            X_seq.append(X_train[i-sequence_length:i])
            y_seq.append(y_train.iloc[i])
        
        X_seq = np.array(X_seq)
        y_seq = np.array(y_seq)
        
        # Build LSTM model
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(sequence_length, X_train.shape[1])),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        # Train model
        history = model.fit(
            X_seq, y_seq,
            epochs=50,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
        
        self.models['LSTM'] = model
        self.lstm_sequence_length = sequence_length
        
        return model, history
    
    def evaluate_models(self, X_test, y_test):
        """Evaluate all trained models"""
        results = {}
        
        for name, model in self.models.items():
            if name == 'LSTM':
                # Special handling for LSTM
                X_seq, y_seq = [], []
                seq_len = self.lstm_sequence_length
                
                # Create sequences from test data
                X_test_full = np.vstack([X_train, X_test])  # Combine for sequence creation
                y_test_full = np.concatenate([y_train, y_test])
                
                for i in range(len(X_train), len(X_test_full) - seq_len):
                    X_seq.append(X_test_full[i-seq_len:i])
                    y_seq.append(y_test_full[i])
                
                X_seq = np.array(X_seq)
                y_seq = np.array(y_seq)
                
                predictions = model.predict(X_seq).flatten()
                y_true = y_seq
                
            else:
                predictions = model.predict(X_test)
                y_true = y_test
            
            # Calculate metrics
            mse = mean_squared_error(y_true, predictions)
            mae = mean_absolute_error(y_true, predictions)
            r2 = r2_score(y_true, predictions)
            rmse = np.sqrt(mse)
            
            # Calculate MAPE (Mean Absolute Percentage Error)
            mape = np.mean(np.abs((y_true - predictions) / y_true)) * 100
            
            results[name] = {
                'MSE': mse,
                'MAE': mae,
                'RMSE': rmse,
                'R2': r2,
                'MAPE': mape,
                'Predictions': predictions,
                'Actual': y_true
            }
        
        self.evaluation_results = results
        return results
    
    def make_predictions(self, days_to_predict=30):
        """Make future predictions"""
        if not self.models:
            raise ValueError("No models trained yet")
        
        predictions = {}
        
        # Use the last available data for prediction
        last_data = self.data[self.feature_columns].iloc[-1:].values
        last_data_scaled = self.scaler.transform(last_data)
        
        for name, model in self.models.items():
            if name == 'LSTM':
                # For LSTM, we need the last sequence
                seq_len = self.lstm_sequence_length
                last_sequence = self.data[self.feature_columns].iloc[-seq_len:].values
                last_sequence_scaled = self.scaler.transform(last_sequence)
                last_sequence_scaled = last_sequence_scaled.reshape(1, seq_len, -1)
                
                pred = model.predict(last_sequence_scaled)[0][0]
            else:
                pred = model.predict(last_data_scaled)[0]
            
            predictions[name] = pred
        
        self.predictions = predictions
        return predictions
    
    def plot_predictions(self, results):
        """Plot prediction results"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Model Predictions vs Actual Prices', fontsize=16)
        
        axes = axes.flatten()
        
        for i, (name, result) in enumerate(results.items()):
            if i >= 4:  # Limit to 4 models
                break
                
            ax = axes[i]
            actual = result['Actual']
            pred = result['Predictions']
            
            # Plot only last 100 points for clarity
            plot_points = min(100, len(actual))
            actual = actual[-plot_points:]
            pred = pred[-plot_points:]
            
            ax.plot(actual.index, actual, label='Actual', color='blue', alpha=0.7)
            ax.plot(actual.index, pred, label='Predicted', color='red', alpha=0.7)
            ax.set_title(f'{name} - R²: {result["R2"]:.3f}')
            ax.set_xlabel('Time')
            ax.set_ylabel('Price (TZS)')
            ax.legend()
            ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('predictions_plot.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_feature_importance(self):
        """Plot feature importance for tree-based models"""
        if 'Random Forest' not in self.models:
            print("Random Forest model not trained")
            return
        
        rf_model = self.models['Random Forest']
        importance = rf_model.feature_importances_
        
        # Create DataFrame for visualization
        feature_importance = pd.DataFrame({
            'Feature': self.feature_columns,
            'Importance': importance
        }).sort_values('Importance', ascending=False)
        
        # Plot top 20 features
        plt.figure(figsize=(12, 8))
        top_features = feature_importance.head(20)
        
        plt.barh(range(len(top_features)), top_features['Importance'])
        plt.yticks(range(len(top_features)), top_features['Feature'])
        plt.xlabel('Importance')
        plt.title('Top 20 Feature Importance - Random Forest')
        plt.gca().invert_yaxis()
        plt.tight_layout()
        plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def generate_report(self):
        """Generate comprehensive analysis report"""
        if not hasattr(self, 'evaluation_results'):
            return "No evaluation results available"
        
        report = {
            'analysis_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
            'dataset_info': {
                'total_records': len(self.data),
                'date_range': f"{self.data['Date'].min()} to {self.data['Date'].max()}",
                'features_count': len(self.feature_columns)
            },
            'model_performance': {}
        }
        
        for name, result in self.evaluation_results.items():
            report['model_performance'][name] = {
                'RMSE': f"TZS {result['RMSE']:,.2f}",
                'MAE': f"TZS {result['MAE']:,.2f}",
                'R²_Score': f"{result['R2']:.4f}",
                'MAPE': f"{result['MAPE']:.2f}%"
            }
        
        # Find best model
        best_model = max(self.evaluation_results.items(), 
                        key=lambda x: x[1]['R2'])
        report['best_model'] = {
            'name': best_model[0],
            'r2_score': best_model[1]['R2'],
            'rmse': best_model[1]['RMSE']
        }
        
        return report
    
    def save_model(self, model_name, filename):
        """Save trained model to file"""
        import joblib
        if model_name in self.models:
            joblib.dump(self.models[model_name], filename)
            print(f"Model {model_name} saved to {filename}")
        else:
            print(f"Model {model_name} not found")

# Demo function
def demo_stock_prediction():
    """Demonstration of the stock prediction system"""
    print("🚀 Tanzania Stock Market Prediction Demo")
    print("=" * 50)
    
    # Initialize predictor
    predictor = TanzaniaStockPredictor()
    
    # Load sample data for TBL (Tanzania Breweries)
    print("\n📊 Loading stock data...")
    data = predictor.generate_sample_data('TBL', days=800)
    print(f"✅ Loaded {len(data)} days of stock data")
    
    # Add technical indicators
    print("\n🔧 Adding technical indicators...")
    data_with_indicators = predictor.add_technical_indicators()
    print(f"✅ Added technical indicators. Total features: {len(data_with_indicators.columns)}")
    
    # Prepare features
    print("\n🎯 Preparing features for ML models...")
    X, y = predictor.prepare_features()
    print(f"✅ Feature matrix shape: {X.shape}")
    
    # Split data
    X_train, X_test, y_train, y_test = predictor.split_data(X, y)
    print(f"✅ Train set: {X_train.shape}, Test set: {X_test.shape}")
    
    # Train models
    print("\n🤖 Training machine learning models...")
    
    print("  📈 Training Linear Regression...")
    predictor.train_linear_regression(X_train, y_train)
    
    print("  🌲 Training Random Forest...")
    predictor.train_random_forest(X_train, y_train)
    
    print("  🚀 Training Gradient Boosting...")
    predictor.train_gradient_boosting(X_train, y_train)
    
    print("  🧠 Training LSTM...")
    predictor.train_lstm(X_train, y_train)
    
    print("✅ All models trained successfully!")
    
    # Evaluate models
    print("\n📋 Evaluating model performance...")
    results = predictor.evaluate_models(X_test, y_test)
    
    # Display results
    print("\n📊 Model Performance Results:")
    print("-" * 60)
    for name, result in results.items():
        print(f"\n{name}:")
        print(f"  RMSE: TZS {result['RMSE']:,.2f}")
        print(f"  MAE: TZS {result['MAE']:,.2f}")
        print(f"  R² Score: {result['R2']:.4f}")
        print(f"  MAPE: {result['MAPE']:.2f}%")
    
    # Make predictions
    print("\n🔮 Making future predictions...")
    predictions = predictor.make_predictions()
    
    print("\n💰 Next Day Price Predictions:")
    print("-" * 40)
    for model, pred in predictions.items():
        print(f"{model}: TZS {pred:,.2f}")
    
    # Generate report
    report = predictor.generate_report()
    print(f"\n📄 Best performing model: {report['best_model']['name']} (R²: {report['best_model']['r2_score']:.4f})")
    
    # Current price info
    current_price = data['Close'].iloc[-1]
    print(f"\n💹 Current TBL Stock Price: TZS {current_price:,.2f}")
    
    return predictor, results, predictions

if __name__ == "__main__":
    # Run the demo
    predictor, results, predictions = demo_stock_prediction()
