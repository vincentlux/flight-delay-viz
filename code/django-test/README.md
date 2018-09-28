# Django notes

## Run server

```
python manage.py runserver 8080
```
## model flow (sql query generation)
* Change your models (in `models.py`).
* Run `python manage.py makemigrations` to create migrations for those changes
* Run `python manage.py migrate` to apply those changes to the database.