from flask import Flask, jsonify, request, render_template, send_from_directory
import pandas as pd
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Load the Excel data
def load_data():
    try:
        # Adjust the path as needed
        excel_file = 'main_dataset.xlsx'
        return pd.read_excel(excel_file)
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()

# Serve the main HTML file
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API endpoint to get all carpools
@app.route('/api/carpools', methods=['GET'])
def get_carpools():
    data = load_data()
    return jsonify(data.to_dict(orient='records'))

# API endpoint to search for carpools
@app.route('/api/search', methods=['GET'])
def search_carpools():
    pickup = request.args.get('pickup', '')
    dropoff = request.args.get('dropoff', '')
    
    data = load_data()
    
    # Filter data based on search criteria
    matches = data[(data['pickup_location'] == pickup) & (data['dropoff_location'] == dropoff)]
    
    return jsonify(matches.to_dict(orient='records'))

# API endpoint to get carpool details by ID
@app.route('/api/carpools/<int:carpool_id>', methods=['GET'])
def get_carpool_details(carpool_id):
    data = load_data()
    
    # Find carpool by ID
    carpool = data[data['sl_no'] == carpool_id]
    
    if not carpool.empty:
        return jsonify(carpool.iloc[0].to_dict())
    else:
        return jsonify({"error": "Carpool not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
