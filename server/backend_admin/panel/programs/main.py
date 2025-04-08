from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import os
from datetime import datetime, timedelta
import random
import database

app = Flask(__name__)
app.secret_key = os.urandom(24)

users = {
    "admin@example.com": {
        "password": generate_password_hash("password123"),
        "name": "Admin User"
    }
}

def generate_datas():

    backup_status = {
        "files": random.choice(["Up to date", "Needs update"]),
        "databases": random.choice(["Up to date", "Up to date"]),
        "media": random.choice(["Up to date", "Up to date", "Needs update"]),
        "system": random.choice(["Up to date", "Needs update"]),
    }

    backups = []
    backup_types = ["Files", "Database", "Media", "System", "Full Backup"]
    backup_sizes = ["1.2 GB", "450 MB", "2.8 GB", "750 MB", "5.1 GB"]
    backup_status = ["Completed", "In Progress", "Failed", "Pending"]

    for i in range(5):
        date = datetime.now() - timedelta(days=random.randint(0, 7),
                                          hours=random.randint(0, 23),
                                          minutes=random.randint(0, 59))
        backups.append({
            "type": random.choice(backup_types),
            "size": random.choice(backup_sizes),
            "date": date.strftime("%Y-%m-%d %H:%M"),
            "status": random.choice(backup_status),
        })

    backups.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d %H:%M"), reverse=True)

    stats = {
        "total_backups": random.randint(50, 500),
        "storage_used": f"{random.randint(10, 950)}.{random.randint(1, 9)} GB",
        "backed_up_devices": random.randint(1, 10),
        "last_backup": (datetime.now() - timedelta(hours=random.randint(0, 72))).strftime("%Y-%m-%d %H:%M")
    }

    activities = []
    activity_types = ["Backup Completed", "Backup Started", "Settings Changed", "Device Added", "Storage Expanded"]

    for i in range(8):
        date = datetime.now() - timedelta(days=random.randint(0, 14),
                                         hours=random.randint(0, 23),
                                         minutes=random.randint(0, 59))
        activities.append({
            "type": random.choice(activity_types),
            "date": date.strftime("%Y-%m-%d %H:%M"),
            "details": f"User action from 192.168.1.{random.randint(1, 255)}"
        })

    activities.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d %H:%M"), reverse=True)

    return {
        "backup_status": backup_status,
        "backups": backups,
        "stats": stats,
        "activities": activities
    }

@app.route('/')
def index():
    if 'user_email' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = 'remember' in request.form

        if not email or not password:
            error = "Please enter both email and password"
        elif email not in users:
            error = "Invalid email or password"
        elif not check_password_hash(users[email]['password'], password):
            error = "Invalid email or password"
        else:
            session['user_email'] = email
            session['user_name'] = users[email]['name']
            if remember:
                session.permanent = True
            flash('You were successfully logged in', 'success')
            return redirect(url_for('dashboard'))

        flash(error, 'error')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_email', None)
    session.pop('user_name', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        flash('Please log in to access the dashboard', 'warning')
        return redirect(url_for('login'))

    dashboard_data = generate_mock_data()
    return render_template('dashboard.html',
                          user_name=session['user_name'],
                          user_email=session['user_email'],
                          data=dashboard_data)

@app.route('/api/chart-data')
def chart_data():
    if 'user_email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    backup_types = ["Files", "Databases", "Media", "System", "Other"]

    weekly_backups = [random.randint(0, 5) for _ in range(7)]

    backup_distribution = [random.randint(5, 30) for _ in range(len(backup_types))]

    return jsonify({
        "weekly": {
            "labels": days,
            "data": weekly_backups
        },
        "distribution": {
            "labels": backup_types,
            "data": backup_distribution
        }
    })

@app.route('/settings')
def settings():
    if 'user_email' not in session:
        flash('Please log in to access settings', 'warning')
        return redirect(url_for('login'))

    return render_template('settings.html',
                          user_name=session['user_name'],
                          user_email=session['user_email'])

@app.route('/clients')
def clients():
    if 'user_email' not in session:
        flash('Please log in to access settings', 'warning')
        return redirect(url_for('login'))

    client_data = get_clients_from_db()

    return render_template('clients.html',
                           user_name=session.get('user_name', 'Guest'),
                           user_email=session.get('user_email', 'guest@example.com'),
                           clients=client_data)

@app.route('/devices')
def devices():
    if 'user_email' not in session:
        flash('Please log in to access devices', 'warning')
        return redirect(url_for('login'))

    return render_template('devices.html',
                          user_name=session['user_name'],
                          user_email=session['user_email'])

@app.route('/reports')
def reports():
    if 'user_email' not in session:
        flash('Please log in to access reports', 'warning')
        return redirect(url_for('login'))

    return render_template('reports.html',
                          user_name=session['user_name'],
                          user_email=session['user_email'])

@app.route('/storage')
def storage():
    if 'user_email' not in session:
        flash('Please log in to access storage', 'warning')
        return redirect(url_for('login'))

    return render_template('storage.html',
                          user_name=session['user_name'],
                          user_email=session['user_email'])

@app.route('/api/v1/insert_user', methods=['POST'])
def insert_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400
        print("Data received:", data)

        now = datetime.now()
        username = data.get('username')
        email = data.get('email')
        client_os = data.get('os')
        status = data.get('status')
        last_backup = now.strftime('%Y-%m-%d %H:%M:%S')
        storage_used = data.get('storage_used')
        storage_total = data.get('storage_total')

        if not all([username, email, client_os, status, last_backup, storage_used, storage_total]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        existing_user = database.get_user_by_email(email)
        if existing_user:
            return jsonify({"success": False, "error": "User already exists"}), 400
        user_id = database.insert_user(username, email, client_os, status, last_backup, storage_used, storage_total)

        if user_id:
            return jsonify({"id": user_id}), 201
        else:
            return jsonify({"success": False}), 500
    except Exception as e:
        print("Error while inserting user:", e)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/v1/client_list', methods=['GET'])
def get_clients_from_db():
    try:
        raw_clients = database.get_user_list()

        if not raw_clients:
            return []

        formatted_clients = []
        for client in raw_clients:
            if len(client) >= 8:
                formatted_client = {
                    'id': client[0],
                    'name': client[1],
                    'email': client[2],
                    'os': client[3],
                    'status': client[4].capitalize(),
                    'last_backup': client[5],
                    'storage_used': f"{client[6]} GB",
                    'storage_total': f"{client[7]} GB",
                    'storage_percent': min(100, int((client[6] / client[7]) * 100)) if client[7] > 0 else 0
                }
                formatted_clients.append(formatted_client)

        return formatted_clients

    except Exception as e:
        print(f"Error in get_clients_from_db: {str(e)}")
        return []

@app.route('/api/v1/delete_user', methods=['DELETE'])
def delete_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400

        email = data.get('email')
        if not email:
            return jsonify({"success": False, "error": "Email is required"}), 400

        result = database.delete_user(email)
        if result:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False}), 500
    except Exception as e:
        print("Error while deleting user:", e)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)