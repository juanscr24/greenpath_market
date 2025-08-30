# TODO: Make Profile Dynamic and Editable

## Tasks
- [x] Modify profile.js to fetch user data from /users/me/profile on page load
- [x] Update HTML elements with dynamic data (name, email, address)
- [x] Replace "Mi Perfil" with user's full_name
- [x] Handle authentication errors
- [x] Test the changes (ensure backend is running on port 8000 and user is logged in)
- [x] Add edit functionality for email and address fields
- [x] Add save/cancel buttons for inline editing
- [x] Implement PUT request to update user data via API
- [x] Fix HTML structure to preserve help and payment method sections

# TODO: Fix Add Products Button and Image Upload

## Tasks
- [x] Load addProduct.js in my_shop.html
- [x] Replace image URL input with file input in addProduct.js
- [x] Update submitForm to handle file upload with FormData to /products/upload
- [x] Fix API endpoints to use endpointProducts instead of undefined API_URL
- [x] Add required fields like id_category and id_shop
- [x] Fix product id to id_product in frontend
- [x] Filter products to show only those from the current shop
- [x] Test the add product functionality with file upload to Cloudinary
