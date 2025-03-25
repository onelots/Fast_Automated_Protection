from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)
app.secret_key = os.urandom(24)

# This is a simple in-memory user store for demonstration
# In a real application, you would use a database
users = {
    "admin@example.com": {
        "password": generate_password_hash("password123"),
        "name": "Admin User"
    }
}

# Mock data for dashboard
def generate_mock_data():
    # Backup status
    backup_status = {
        "files": random.choice(["Up to date", "Needs update"]),
        "databases": random.choice(["Up to date", "Up to date"]),
        "media": random.choice(["Up to date", "Up to date", "Needs update"]),
        "system": random.choice(["Up to date", "Needs update"]),
    }
    
    # Recent backups
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
    
    # Sort backups by date (newest first)
    backups.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d %H:%M"), reverse=True)
    
    # Stats
    stats = {
        "total_backups": random.randint(50, 500),
        "storage_used": f"{random.randint(10, 950)}.{random.randint(1, 9)} GB",
        "backed_up_devices": random.randint(1, 10),
        "last_backup": (datetime.now() - timedelta(hours=random.randint(0, 72))).strftime("%Y-%m-%d %H:%M")
    }
    
    # Activity log
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
    
    # Sort activities by date (newest first)
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
    
    # Generate mock data for charts
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    backup_types = ["Files", "Databases", "Media", "System", "Other"]
    
    # Weekly backup data
    weekly_backups = [random.randint(0, 5) for _ in range(7)]
    
    # Backup distribution
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
    
    return render_template('clients.html', 
                          user_name=session['user_name'],
                          user_email=session['user_email'])

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

if __name__ == '__main__':
    app.run(debug=True)