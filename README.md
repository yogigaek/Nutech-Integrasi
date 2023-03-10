# API Documentation

## PRODUCT

### GET ALL PRODUCTS
URL : "/api/product/?skip=0&limit=10",
Method: "GET",
Response: https://prnt.sc/t-JngM-_a6BR,
Description :
This API retrieves all product data, with skip and limit parameters being required.
The product list is sorted by the most recently created product displayed at the top.

### GET PRODUCT BY NAME
URL : "/api/product/?skip=0&limit=10&name=iphone",
Method: "GET",
Response: https://prnt.sc/48urC4vWICch,
Description :
This API is used to retrieve product data that has been filtered by product name, with skip and limit parameters being required.

### CREATE NEW PRODUCT
URL : "/api/product/",
Method: "POST",
Description :
This API creates a new product with the following rules :
- "name", "salePrice", "purchasePrice", and "stock" fields must be entered.
- Only JPG and PNG image formats are allowed, with a maximum file size of 100KB.
- Product names must be unique and cannot be duplicated.
- "purchasePrice", "salePrice", and "stock" can only be filled in with numbers.

### UPDATE EXISTING PRODUCT
URL : "/api/product/:id",
Method: "PUT",
Description :
This API updates an existing product with the following rules:
- Only JPG and PNG image formats are allowed, with a maximum file size of 100KB.
- Product names must be unique and cannot be duplicated.
- "purchasePrice", "salePrice", and "stock" can only be filled in with numbers.

### DELETE PRODUCT
URL : "/api/product/:id",
Method: "POST",
Description :
This API deletes a product.
Note: this API performs a "soft" delete, which means the product will no longer be visible in the product list, but it will still exist in the database.

## USER

### USER REGISTRATION
URL : "/auth/register/",
Method: "POST",
Description :
This API is used by users to register for a new account with the following rules :
- The email field must contain a valid email address.
- Users cannot register with an email that has already been registered.
- Passwords must contain at least one uppercase letter, one lowercase letter, and one number.

### USER LOGIN
URL : "/auth/login/",
Method: "POST",
Description :
This API is used by users to log in to their account.

### USER LOGOUT
URL : "/auth/logout/",
Method: "POST",
Description :
This API is used by users to log out of their account.