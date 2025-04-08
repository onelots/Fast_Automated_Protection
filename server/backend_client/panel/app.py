from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import random
import threading
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'votre_clé_secrète_ici'
app.permanent_session_lifetime = timedelta(days=7)

users = {
    1: {
        'id': 1,
        'username': 'John Doe',
        'email': 'john@example.com',
        'password': generate_password_hash('password123'),
        'os': 'Windows 10',
        'status': 'Active',
        'storage_used': 32.5,
        'storage_total': 50,
        'created_at': (datetime.utcnow() - timedelta(days=30)).isoformat(),
        'last_login': (datetime.utcnow() - timedelta(days=1)).isoformat()
    }
}

backups = {}
backup_id_counter = 1

activities = {}
activity_id_counter = 1

schedules = {
    1: {
        'id': 1,
        'user_id': 1,
        'frequency': 'Quotidienne',
        'times': ['08:00', '14:30', '20:45'],
        'folders': ['Documents', 'Images', 'Vidéos'],
        'enabled': True
    }
}

def create_test_data():
    global backup_id_counter, activity_id_counter

    now = datetime.utcnow()

    test_backups = [
        {
            'id': backup_id_counter,
            'user_id': 1,
            'date': (now - timedelta(hours=3)).isoformat(),
            'type': 'Automatique',
            'size': 2.4,
            'status': 'Terminé',
            'files_count': 1245,
            'backup_path': '/backups/user_1/20230501_080000.zip'
        },
        {
            'id': backup_id_counter + 1,
            'user_id': 1,
            'date': (now - timedelta(hours=9)).isoformat(),
            'type': 'Manuel',
            'size': 1.8,
            'status': 'Terminé',
            'files_count': 980,
            'backup_path': '/backups/user_1/20230501_020000.zip'
        },
        {
            'id': backup_id_counter + 2,
            'user_id': 1,
            'date': (now - timedelta(days=1, hours=3)).isoformat(),
            'type': 'Automatique',
            'size': 2.2,
            'status': 'Terminé',
            'files_count': 1150,
            'backup_path': '/backups/user_1/20230430_080000.zip'
        },
        {
            'id': backup_id_counter + 3,
            'user_id': 1,
            'date': (now - timedelta(days=1, hours=9)).isoformat(),
            'type': 'Automatique',
            'size': 2.3,
            'status': 'Terminé',
            'files_count': 1200,
            'backup_path': '/backups/user_1/20230430_020000.zip'
        },
        {
            'id': backup_id_counter + 4,
            'user_id': 1,
            'date': (now - timedelta(days=2, hours=15)).isoformat(),
            'type': 'Automatique',
            'size': 2.1,
            'status': 'Terminé',
            'files_count': 1100,
            'backup_path': '/backups/user_1/20230429_140000.zip'
        }
    ]

    for backup in test_backups:
        backups[backup['id']] = backup
        backup_id_counter += 1

    backup_id_counter += 5

    test_activities = [
        {
            'id': activity_id_counter,
            'user_id': 1,
            'date': (now - timedelta(hours=3)).isoformat(),
            'action': 'Login',
            'details': 'Connexion depuis 192.168.1.1'
        },
        {
            'id': activity_id_counter + 1,
            'user_id': 1,
            'date': (now - timedelta(hours=3)).isoformat(),
            'action': 'StartBackup',
            'details': 'Sauvegarde automatique démarrée'
        },
        {
            'id': activity_id_counter + 2,
            'user_id': 1,
            'date': (now - timedelta(hours=3)).isoformat(),
            'action': 'CompleteBackup',
            'details': 'Sauvegarde automatique terminée'
        },
        {
            'id': activity_id_counter + 3,
            'user_id': 1,
            'date': (now - timedelta(hours=9)).isoformat(),
            'action': 'StartBackup',
            'details': 'Sauvegarde manuelle démarrée'
        },
        {
            'id': activity_id_counter + 4,
            'user_id': 1,
            'date': (now - timedelta(hours=9)).isoformat(),
            'action': 'CompleteBackup',
            'details': 'Sauvegarde manuelle terminée'
        },
        {
            'id': activity_id_counter + 5,
            'user_id': 1,
            'date': (now - timedelta(days=1)).isoformat(),
            'action': 'Login',
            'details': 'Connexion depuis 192.168.1.1'
        },
        {
            'id': activity_id_counter + 6,
            'user_id': 1,
            'date': (now - timedelta(days=1)).isoformat(),
            'action': 'UpdateProfile',
            'details': 'Mise à jour du profil'
        },
        {
            'id': activity_id_counter + 7,
            'user_id': 1,
            'date': (now - timedelta(days=1)).isoformat(),
            'action': 'Logout',
            'details': 'Déconnexion'
        }
    ]

    for activity in test_activities:
        activities[activity['id']] = activity
        activity_id_counter += 1

    activity_id_counter += 8

create_test_data()

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login.html')
def login():
    return render_template('login.html')

@app.route('/client.html')
def client_dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('client.html')

@app.route('/api/v1/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    remember_me = data.get('remember_me', False)

    user_id = None
    for uid, user in users.items():
        if user['email'] == email:
            user_id = uid
            break

    if user_id is None or not check_password_hash(users[user_id]['password'], password):
        return jsonify({'error': 'Identifiants incorrects'}), 401

    session.permanent = remember_me
    session['user_id'] = user_id
    session['username'] = users[user_id]['username']
    session['email'] = users[user_id]['email']

    users[user_id]['last_login'] = datetime.utcnow().isoformat()

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'Login',
        'details': f'Connexion depuis {request.remote_addr}'
    }
    activity_id_counter += 1

    return jsonify({'success': True, 'message': 'Connexion réussie'})

@app.route('/api/v1/register', methods=['POST'])
def api_register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    os = data.get('os')

    for user in users.values():
        if user['email'] == email:
            return jsonify({'error': 'Cet email est déjà utilisé'}), 400

    global activity_id_counter
    new_user_id = max(users.keys()) + 1 if users else 1

    users[new_user_id] = {
        'id': new_user_id,
        'username': username,
        'email': email,
        'password': generate_password_hash(password),
        'os': os,
        'status': 'Pending',
        'storage_used': 0,
        'storage_total': 50,
        'created_at': datetime.utcnow().isoformat(),
        'last_login': None
    }

    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': new_user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'Register',
        'details': f'Inscription depuis {request.remote_addr}'
    }
    activity_id_counter += 1

    return jsonify({
        'success': True,
        'message': 'Inscription réussie. Votre compte est en attente d\'activation.',
        'user_id': new_user_id
    })

@app.route('/api/v1/logout', methods=['POST'])
def api_logout():
    if 'user_id' in session:

        global activity_id_counter
        activities[activity_id_counter] = {
            'id': activity_id_counter,
            'user_id': session['user_id'],
            'date': datetime.utcnow().isoformat(),
            'action': 'Logout',
            'details': f'Déconnexion depuis {request.remote_addr}'
        }
        activity_id_counter += 1

        session.clear()

    return jsonify({'success': True, 'message': 'Déconnexion réussie'})

@app.route('/api/v1/user', methods=['GET'])
def api_get_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    if user_id not in users:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    user = users[user_id]
    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'os': user['os'],
        'status': user['status'],
        'storage_used': user['storage_used'],
        'storage_total': user['storage_total'],
        'created_at': user['created_at'],
        'last_login': user['last_login']
    })

@app.route('/api/v1/user', methods=['PUT'])
def api_update_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    if user_id not in users:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    data = request.json

    if 'username' in data:
        users[user_id]['username'] = data['username']

    if 'os' in data:
        users[user_id]['os'] = data['os']

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'UpdateProfile',
        'details': 'Mise à jour du profil'
    }
    activity_id_counter += 1

    return jsonify({
        'success': True,
        'message': 'Profil mis à jour avec succès',
        'user': users[user_id]
    })

@app.route('/api/v1/user/password', methods=['PUT'])
def api_update_password():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    if user_id not in users:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({'error': 'Mot de passe actuel et nouveau mot de passe requis'}), 400

    if not check_password_hash(users[user_id]['password'], current_password):
        return jsonify({'error': 'Mot de passe actuel incorrect'}), 400

    users[user_id]['password'] = generate_password_hash(new_password)

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'ChangePassword',
        'details': 'Changement de mot de passe'
    }
    activity_id_counter += 1

    return jsonify({
        'success': True,
        'message': 'Mot de passe mis à jour avec succès'
    })

@app.route('/api/v1/storage', methods=['GET'])
def api_get_storage():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    if user_id not in users:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    user = users[user_id]

    storage_types = {
        'Documents': round(user['storage_used'] * 0.4, 1),
        'Images': round(user['storage_used'] * 0.25, 1),
        'Vidéos': round(user['storage_used'] * 0.2, 1),
        'Autres': round(user['storage_used'] * 0.15, 1)
    }

    return jsonify({
        'total': user['storage_total'],
        'used': user['storage_used'],
        'free': round(user['storage_total'] - user['storage_used'], 1),
        'percentage': round((user['storage_used'] / user['storage_total']) * 100, 1),
        'types': storage_types
    })

@app.route('/api/v1/backups', methods=['GET'])
def api_get_backups():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    user_backups = [backup for backup in backups.values() if backup['user_id'] == user_id]

    user_backups.sort(key=lambda x: x['date'], reverse=True)

    return jsonify(user_backups)

@app.route('/api/v1/backups/start', methods=['POST'])
def api_start_backup():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    if user_id not in users:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    data = request.json
    folders = data.get('folders', ['Documents', 'Images', 'Vidéos'])

    if users[user_id]['storage_used'] >= users[user_id]['storage_total']:
        return jsonify({'error': 'Espace de stockage insuffisant'}), 400

    size = round(random.uniform(1.5, 3.5), 1)
    files_count = random.randint(800, 1500)

    if users[user_id]['storage_used'] + size > users[user_id]['storage_total']:
        size = round(users[user_id]['storage_total'] - users[user_id]['storage_used'], 1)

    global backup_id_counter, activity_id_counter
    new_backup_id = backup_id_counter

    backups[new_backup_id] = {
        'id': new_backup_id,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'type': 'Manuel',
        'size': size,
        'status': 'En cours',
        'files_count': files_count,
        'backup_path': f'/backups/user_{user_id}/{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}.zip'
    }
    backup_id_counter += 1

    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'StartBackup',
        'details': f'Sauvegarde manuelle démarrée ({", ".join(folders)})'
    }
    activity_id_counter += 1

    def complete_backup():
        backups[new_backup_id]['status'] = 'Terminé'

        users[user_id]['storage_used'] = min(users[user_id]['storage_used'] + size, users[user_id]['storage_total'])

        global activity_id_counter
        activities[activity_id_counter] = {
            'id': activity_id_counter,
            'user_id': user_id,
            'date': datetime.utcnow().isoformat(),
            'action': 'CompleteBackup',
            'details': f'Sauvegarde manuelle terminée (ID: {new_backup_id})'
        }
        activity_id_counter += 1

    timer = threading.Timer(5.0, complete_backup)
    timer.start()

    return jsonify({
        'success': True,
        'message': 'Sauvegarde démarrée',
        'backup_id': new_backup_id
    })

@app.route('/api/v1/backups/<int:backup_id>', methods=['GET'])
def api_get_backup(backup_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    if backup_id not in backups or backups[backup_id]['user_id'] != user_id:
        return jsonify({'error': 'Sauvegarde non trouvée'}), 404

    return jsonify(backups[backup_id])

@app.route('/api/v1/backups/<int:backup_id>/restore', methods=['POST'])
def api_restore_backup(backup_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    if backup_id not in backups or backups[backup_id]['user_id'] != user_id:
        return jsonify({'error': 'Sauvegarde non trouvée'}), 404

    if backups[backup_id]['status'] != 'Terminé':
        return jsonify({'error': 'La sauvegarde n\'est pas terminée'}), 400

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'StartRestore',
        'details': f'Restauration démarrée (ID: {backup_id})'
    }
    activity_id_counter += 1

    def complete_restore():
        global activity_id_counter
        activities[activity_id_counter] = {
            'id': activity_id_counter,
            'user_id': user_id,
            'date': datetime.utcnow().isoformat(),
            'action': 'CompleteRestore',
            'details': f'Restauration terminée (ID: {backup_id})'
        }
        activity_id_counter += 1

    timer = threading.Timer(8.0, complete_restore)
    timer.start()

    return jsonify({
        'success': True,
        'message': 'Restauration démarrée',
        'backup_id': backup_id
    })

@app.route('/api/v1/backups/<int:backup_id>', methods=['DELETE'])
def api_delete_backup(backup_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    if backup_id not in backups or backups[backup_id]['user_id'] != user_id:
        return jsonify({'error': 'Sauvegarde non trouvée'}), 404

    users[user_id]['storage_used'] = max(0, users[user_id]['storage_used'] - backups[backup_id]['size'])

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'DeleteBackup',
        'details': f'Sauvegarde supprimée (ID: {backup_id})'
    }
    activity_id_counter += 1

    del backups[backup_id]

    return jsonify({
        'success': True,
        'message': 'Sauvegarde supprimée avec succès'
    })

@app.route('/api/v1/schedule', methods=['GET'])
def api_get_schedule():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    user_schedule = None
    for schedule in schedules.values():
        if schedule['user_id'] == user_id:
            user_schedule = schedule
            break

    if not user_schedule:

        schedule_id = max(schedules.keys()) + 1 if schedules else 1
        user_schedule = {
            'id': schedule_id,
            'user_id': user_id,
            'frequency': 'Quotidienne',
            'times': ['08:00', '14:30', '20:45'],
            'folders': ['Documents', 'Images', 'Vidéos'],
            'enabled': True
        }
        schedules[schedule_id] = user_schedule

    return jsonify(user_schedule)

@app.route('/api/v1/schedule', methods=['PUT'])
def api_update_schedule():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']
    data = request.json

    user_schedule = None
    schedule_id = None
    for sid, schedule in schedules.items():
        if schedule['user_id'] == user_id:
            user_schedule = schedule
            schedule_id = sid
            break

    if not user_schedule:

        schedule_id = max(schedules.keys()) + 1 if schedules else 1
        user_schedule = {
            'id': schedule_id,
            'user_id': user_id,
            'frequency': 'Quotidienne',
            'times': ['08:00', '14:30', '20:45'],
            'folders': ['Documents', 'Images', 'Vidéos'],
            'enabled': True
        }
        schedules[schedule_id] = user_schedule

    if 'frequency' in data:
        user_schedule['frequency'] = data['frequency']

    if 'times' in data:
        user_schedule['times'] = data['times']

    if 'folders' in data:
        user_schedule['folders'] = data['folders']

    if 'enabled' in data:
        user_schedule['enabled'] = data['enabled']

    global activity_id_counter
    activities[activity_id_counter] = {
        'id': activity_id_counter,
        'user_id': user_id,
        'date': datetime.utcnow().isoformat(),
        'action': 'UpdateSchedule',
        'details': 'Mise à jour de la planification des sauvegardes'
    }
    activity_id_counter += 1

    return jsonify({
        'success': True,
        'message': 'Planification mise à jour avec succès',
        'schedule': user_schedule
    })

@app.route('/api/v1/activity', methods=['GET'])
def api_get_activity():
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorisé'}), 401

    user_id = session['user_id']

    user_activities = [activity for activity in activities.values() if activity['user_id'] == user_id]

    user_activities.sort(key=lambda x: x['date'], reverse=True)

    user_activities = user_activities[:20]

    return jsonify(user_activities)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5010)