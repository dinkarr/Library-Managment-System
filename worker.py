# This is the code and it will instance my celery 


## What this function is doing -> It is creating a function known as celery inita and args af flask application and with app.app_contxt , running celery inside flask content 
from celery import Celery, Task
from flask import Flask
def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object("celery_config")
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

# Now we have to configure 2 things , 1-> Message broker url and result back url , that will be comming from redis-server , by default port is 6379