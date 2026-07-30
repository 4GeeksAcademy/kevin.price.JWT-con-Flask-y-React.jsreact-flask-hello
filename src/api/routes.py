"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"message": "Debes enviar un body en formato JSON"}), 400

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if email == "" or password == "":
        return jsonify({"message": "El email y la contraseña son obligatorios"}), 400
    if "@" not in email:
        return jsonify({"message": "El email no tiene un formato válido"}), 400
    if len(password) < 6:
        return jsonify({"message": "La contraseña debe tener al menos 6 caracteres"}), 400

    existing = db.session.scalar(db.select(User).where(User.email == email))
    if existing is not None:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    user = User(email=email, is_active=True)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Usuario creado correctamente",
        "user": user.serialize()
    }), 201


@api.route('/token', methods=['POST'])
def create_token():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"message": "Debes enviar un body en formato JSON"}), 400

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if email == "" or password == "":
        return jsonify({"message": "El email y la contraseña son obligatorios"}), 400

    user = db.session.scalar(db.select(User).where(User.email == email))

    if user is None or not user.check_password(password):
        return jsonify({"message": "Email o contraseña incorrectos"}), 401

    if not user.is_active:
        return jsonify({"message": "Esta cuenta está desactivada"}), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404

    return jsonify({
        "message": f"Bienvenido de nuevo, {user.email}",
        "user": user.serialize()
    }), 200