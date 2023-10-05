# django-e-commerce

## Run with docker

```bash
make d
```

or

```bash
docker compose -p e-commerce-app-9c06b9f13011495c -f docker/docker-compose.dev.yml --env-file .env up --build
```

## Apps

- `FRONTEND CLIENT` -> `http://localhost:5173/`
- `API` -> `http://localhost:8000/api`

## Postman

- Postman collection and environment in `postman`
- All Postman screenshots in `doc/img/postman`

## Additional Features
- Send Payment Reminder Task with Celery
  ![mail-recv](doc/img/postman/mail-payment-reminder.png)
- Ensure that the product quantity does not exceed the quantity available in stock when make order.
  ![ensure](doc/img/postman/client-post-order-not-enough-products.png)

## Frontend demo
- CLIENT post order
  ![client-post-order](doc/img/frontend/client-make-order.mp4) 
- SELLER update/delete product
  ![seller-update-product](doc/img/frontend/seller-update-product.mp4) 
- UNAUTHORIZED list/sort/filter products
  ![unauth-list-products](doc/img/frontend/unauthorized-search.mp4)

