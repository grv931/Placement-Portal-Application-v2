from flask import Flask
from flask_cors import CORS
from apps.config import Config
from apps.extensions import db, jwt, cache, mail
from apps.celery_workers import celery
from apps.models import User, Role

def create_app():
    import os
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    mail.init_app(app)

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    from apps.routes.auth_routes import auth_bp
    from apps.routes.admin_routes import admin_bp
    from apps.routes.company_routes import company_bp
    from apps.routes.student_routes import student_bp

    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(admin_bp,url_prefix="/api/admin")
    app.register_blueprint(company_bp,url_prefix="/api/company")
    app.register_blueprint(student_bp,url_prefix="/api/student")

    with app.app_context():
        db.create_all()
        create_admin()

    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask

    from apps import tasks

    return app


def create_admin():
    admin = User.query.filter_by(role=Role.ADMIN).first()
    if not admin:
        admin = User(name="Admin", email="a@a.com", role=Role.ADMIN)
        admin.set_password("a")
        db.session.add(admin)
        db.session.commit()
        print("Admin created")


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

