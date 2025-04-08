from psycopg2 import connect
import os

def connection_to_db():
    return connect(os.getenv('DATABASE_URL'))


def insert_user(username, email, os, status, last_backup, storage_used, storage_total):
    query = """
    INSERT INTO user_list (username, email, os, status, last_backup, storage_used, storage_total)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """

    try:
        conn = connection_to_db()
        cur = conn.cursor()
        cur.execute(query, (username, email, os, status, last_backup, storage_used, storage_total))
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return user_id
    except Exception as e:
        print("Error while inserting user :", e)
        return None


def update_user(username, email, os, status, last_backup, storage_userd, storage_total):
    query = """
    UPDATE user_list
    SET username = %s, os = %s, status = %s, last_backup = %s, storage_used = %s, storage_total = %s
    WHERE email = %s;
    """

    try:
        conn = connection_to_db()
        cur = conn.cursor()
        cur.execute(query, (username, os, status, last_backup, storage_userd, storage_total, email))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Error while updating :", e)
        return False
    return True


def get_user_list():
    query = """
    SELECT id, username, email, os, status, last_backup, storage_used, storage_total
    FROM user_list;
    """

    try:
        conn = connection_to_db()
        cur = conn.cursor()
        cur.execute(query)
        users = cur.fetchall()
        cur.close()
        conn.close()
        return users
    except Exception as e:
        print("Error while getting users :", e)
        return None

def get_user_by_email(email):
    query = """
    SELECT id, username, email, os, status, last_backup, storage_used, storage_total
    FROM user_list
    WHERE email = %s;
    """

    try:
        conn = connection_to_db()
        cur = conn.cursor()
        cur.execute(query, (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        return user
    except Exception as e:
        print("Error while getting user by email :", e)
        return None

def delete_user(email):
    query = """
    DELETE FROM user_list
    WHERE email = %s;
    """

    try:
        conn = connection_to_db()
        cur = conn.cursor()
        cur.execute(query, (email,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Error while deleting user :", e)
        return False
    return True
