"""
Авторизация: регистрация, вход, получение профиля, выход.
POST /register — создать аккаунт
POST /login    — войти
GET  /me       — получить профиль по токену
POST /logout   — выйти
"""

import json
import os
import hashlib
import secrets
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ["MAIN_DB_SCHEMA"]

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def json_response(data: dict, status: int = 200) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    token = (
        event.get("headers", {}).get("X-Authorization", "")
        or event.get("headers", {}).get("Authorization", "")
    ).replace("Bearer ", "").strip()

    # ── POST /register ──────────────────────────────────────────────────────
    if method == "POST" and path.endswith("/register"):
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        role = body.get("role", "student")

        if not name or not email or not password:
            return json_response({"error": "Заполните все поля"}, 400)
        if role not in ("student", "teacher", "admin"):
            return json_response({"error": "Неверная роль"}, 400)
        if len(password) < 6:
            return json_response({"error": "Пароль минимум 6 символов"}, 400)

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return json_response({"error": "Email уже зарегистрирован"}, 409)

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash, role) VALUES (%s, %s, %s, %s) RETURNING id, name, email, role, created_at",
            (name, email, pw_hash, role),
        )
        user = dict(cur.fetchone())
        user["created_at"] = str(user["created_at"])

        token_val = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user["id"], token_val),
        )
        conn.commit()
        conn.close()

        return json_response({"token": token_val, "user": user})

    # ── POST /login ─────────────────────────────────────────────────────────
    if method == "POST" and path.endswith("/login"):
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return json_response({"error": "Введите email и пароль"}, 400)

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            f"SELECT id, name, email, role, password_hash, created_at FROM {SCHEMA}.users WHERE email = %s",
            (email,),
        )
        user = cur.fetchone()

        if not user or user["password_hash"] != hash_password(password):
            conn.close()
            return json_response({"error": "Неверный email или пароль"}, 401)

        user = dict(user)
        user["created_at"] = str(user["created_at"])
        del user["password_hash"]

        token_val = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user["id"], token_val),
        )
        conn.commit()
        conn.close()

        return json_response({"token": token_val, "user": user})

    # ── GET /me ─────────────────────────────────────────────────────────────
    if method == "GET" and path.endswith("/me"):
        if not token:
            return json_response({"error": "Не авторизован"}, 401)

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            f"""
            SELECT u.id, u.name, u.email, u.role, u.created_at
            FROM {SCHEMA}.sessions s
            JOIN {SCHEMA}.users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            """,
            (token,),
        )
        user = cur.fetchone()
        conn.close()

        if not user:
            return json_response({"error": "Сессия истекла"}, 401)

        user = dict(user)
        user["created_at"] = str(user["created_at"])
        return json_response({"user": user})

    # ── POST /logout ─────────────────────────────────────────────────────────
    if method == "POST" and path.endswith("/logout"):
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return json_response({"ok": True})

    return json_response({"error": "Не найдено"}, 404)
