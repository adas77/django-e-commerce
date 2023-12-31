include .env

host = $(LOCALHOST)
port = $(DJANGO_APP_PORT)
python_container = $(PYTHON_CONTAINER_NAME)

compose_cmd = docker compose
compose_file = docker/docker-compose.dev.yml
compose_env_file = .env

compose_run = $(compose_cmd) -p ${DOCKER_COMPOSE_PROJECT_NAME} -f $(compose_file) --env-file $(compose_env_file)

py = python3
backend = backend

super_user_name = admin
super_user_email = admin@example.com
super_user_password = fF1aqm18
app = api

sqlite = $(backend)/db.sqlite3
migrations_dir = $(backend)/$(app)/migrations
manage = ${backend}/manage.py

fixture_path = $(backend)/api/fixtures/

fixture_users = $(fixture_path)users.json
fixture_categories = $(fixture_path)categories.json
fixture_products = $(fixture_path)products.json
fixture_orders_items = $(fixture_path)orders_items.json
fixture_orders = $(fixture_path)orders.json

run = $(py) $(manage)
migrate_make = $(py) makemigrations


# FIXTURES
f:
	$(run) loaddata $(fixture_users) $(fixture_categories) $(fixture_products) $(fixture_orders_items) $(fixture_orders)

# RUN
r:
	$(run) runserver $(host):$(port)

# r: f run

# REGISTER ADMIN
u:
	DJANGO_SUPERUSER_USERNAME=${super_user_name} \
	DJANGO_SUPERUSER_PASSWORD=${super_user_password} \
	DJANGO_SUPERUSER_EMAIL=${super_user_email} \
	${run} createsuperuser --noinput

# RUN TESTS
t:
	$(run) test $(app) --parallel


# MIGRATIONS
m-make:
	$(run) makemigrations

m-run:
	$(run) migrate

m-del:
	sudo rm -rf $(migrations_dir) $(sqlite)

m-up:
	$(run) makemigrations $(app)

m-seed:
	$(run) seed

# DOCKER
d-build:
	$(compose_run) build

d-upd:
	$(compose_run) up -d

d-up:
	$(compose_run) up

d-down:
	$(compose_run) down --rmi all --remove-orphans -v 

d-run-py:
	$(run) runserver 0.0.0.0:$(port)

# d-cmd: m-make m-run d-run-py
d-cmd: m-make m-run m-seed d-run-py
# d-cmd: m-make m-run f d-run-py

d-test:
	docker exec $(python_container) $(run) test $(app) --parallel

d:
	$(compose_run) up --build

# RESET
m: m-make m-run
mm: m-del m-up m-run f