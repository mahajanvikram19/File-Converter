import sqlite3

DB_NAME = "db.sqlite3"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create users table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            profile_picture TEXT
        )
    """)

    # Add profile_picture column if it doesn't exist (for existing databases)
    try:
        cursor.execute("SELECT profile_picture FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT")
        print("Added profile_picture column to users table")

    # Add reset_token column if it doesn't exist
    try:
        cursor.execute("SELECT reset_token FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN reset_token TEXT")
        print("Added reset_token column to users table")

    # Add reset_token_expires column if it doesn't exist
    try:
        cursor.execute("SELECT reset_token_expires FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expires TEXT")
        print("Added reset_token_expires column to users table")

    # Add date_of_birth column if it doesn't exist
    try:
        cursor.execute("SELECT date_of_birth FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN date_of_birth TEXT")
        print("Added date_of_birth column to users table")

    # Create History table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT,
            converted_filename TEXT,
            file_type TEXT DEFAULT 'image',
            date TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Add file_type column if it doesn't exist (for existing databases)
    try:
        cursor.execute("SELECT file_type FROM history LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE history ADD COLUMN file_type TEXT DEFAULT 'image'")
        print("Added file_type column to history table")

    # Create Chat Messages table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            user_email TEXT,
            message TEXT,
            is_from_admin INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Create Contact Messages table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            subject TEXT,
            message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("Database initialized successfully!")
