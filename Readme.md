# Addis Eats 🍽️

Addis Eats is a modern food ordering and delivery web application designed to make ordering food in Addis Ababa simple, fast, and convenient. The project provides a complete customer ordering experience together with an admin dashboard for managing menu items, orders, customers, and delivery statuses.

## 📌 Project Overview

Addis Eats allows customers to:

* Browse available food items
* Search for meals
* Filter meals by category
* Add food to a shopping cart
* Increase or decrease item quantities
* Remove items from the cart
* Add meals to favorites
* Switch between light and dark mode
* Complete a checkout form
* Choose a payment method
* Receive an order confirmation
* Get a unique order ID
* Track their order status

The project also includes an **Admin Dashboard** where administrators can manage the restaurant's operations and update customer orders.

---

## ✨ Main Features

### 👤 Customer Side

#### Food Menu

Customers can browse food items loaded dynamically from `menu.json`.

Each food item includes:

* Name
* Category
* Description
* Price
* Image
* Unique ID

#### 🔎 Search

Customers can search the menu by:

* Food name
* Description
* Category

Search results update dynamically as the user types.

#### 🏷️ Category Filtering

The menu can be filtered by categories such as:

* Fast Food
* Chicken & Fish
* Sweets
* Breakfast
* Drinks

An **All** option displays the complete menu.

#### 🛒 Shopping Cart

Customers can:

* Add food items
* Increase quantities
* Decrease quantities
* Remove items
* View subtotal
* View delivery fee
* View total price

The cart automatically calculates the order total.

#### ❤️ Favorites

Customers can save their favorite meals.

Favorites are stored in `localStorage`, allowing them to remain available after refreshing the page.

#### 🌙 Dark Mode

Users can switch between light and dark mode.

The selected theme is saved using `localStorage`.

#### 💳 Checkout

Customers provide:

* Full name
* Phone number
* Delivery address
* Payment method

The form includes validation before an order can be created.

Ethiopian phone numbers are validated using:

```text
09XXXXXXXX
```

#### 📦 Order Creation

After successful checkout, Addis Eats creates an order with:

* Unique order ID
* Customer information
* Ordered items
* Quantities
* Subtotal
* Delivery fee
* Total
* Payment method
* Current order status

Example:

```text
AE-1787304336274
```

The initial order status is:

```text
confirmed
```

#### ✅ Order Confirmation

After placing an order, customers receive an order confirmation containing:

* Order ID
* Total amount
* Option to track the order

#### 📍 Order Tracking

Customers can enter their order ID to see the current delivery progress.

The available statuses are:

```text
Confirmed
    ↓
Preparing
    ↓
On the Way
    ↓
Delivered
```

The tracking interface visually updates according to the current order status.

---

# 🛠️ Admin Dashboard

The Admin Dashboard provides administrators with an overview of the restaurant's activity.

### 📊 Dashboard Statistics

The dashboard displays:

* Total revenue
* Total orders
* Average order value
* Total customers
* Order status statistics
* Top-selling dishes
* Recent orders

### 📦 Order Management

Administrators can view customer orders containing:

* Order ID
* Customer name
* Phone number
* Delivery address
* Ordered items
* Quantity
* Total price
* Current status

Administrators can update an order through:

```text
Confirmed
Preparing
On the Way
Delivered
Cancelled
```

When an administrator changes an order status, the updated status is stored and can be used by the customer's order tracking system.

### 🔎 Order Search & Filtering

Administrators can search orders by:

* Order ID
* Customer name
* Phone number

Orders can also be filtered by status.

### 🍔 Menu Management

Administrators can:

* View menu items
* Search menu items
* Filter menu items by category
* Add new food items
* Edit food information
* Delete food items

Menu information is stored in `localStorage` after administrative changes.

### 🏆 Top-Selling Dishes

The dashboard calculates popular dishes based on order data and displays:

* Ranking
* Food name
* Number of items ordered
* Revenue generated
* Food image

### 👥 Customer Data

The admin system builds a customer list from order information and calculates:

* Customer name
* Phone number
* Address
* Number of orders
* Total amount spent

---

# 💾 Data Storage

Because this project is a frontend-based application, it uses browser `localStorage` instead of a backend database.

Important storage keys include:

```text
addisEatsOrder
addisEatsOrders
addisEatsMenu
addisEatsFavorites
addisEatsTheme
addisEatsAdminLoggedIn
```

### Order Storage

`addisEatsOrders` stores the collection of customer orders.

`addisEatsOrder` stores the latest/current order used by the customer tracking system.

### Menu Storage

The original menu is loaded from:

```text
data/menu.json
```

After admin modifications, the updated menu is stored in:

```text
addisEatsMenu
```

---

# 🧰 Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### JavaScript Concepts

The project uses several important JavaScript concepts:

* DOM manipulation
* Event listeners
* Event delegation
* Arrays
* Objects
* Array methods
* `map()`
* `filter()`
* `reduce()`
* `find()`
* `forEach()`
* Template literals
* Destructuring
* Spread syntax
* Form handling
* FormData
* Regular expressions
* `async/await`
* Fetch API
* JSON
* Local Storage
* Session Storage
* Dynamic HTML generation
* Error handling with `try...catch`

---

# 📁 Project Structure

A simplified project structure looks like:

```text
Addis-Eats/
│
├── index.html
├── admin.html
├── admin-login.html
│
├── css/
│   ├── style.css
│   └── admin.css
│
├── js/
│   ├── app.js
│   └── admin.js
│
├── data/
│   └── menu.json
│
└── images/
    └── ...
```

---

# 🔄 Order Flow

The main order system follows this process:

```text
Customer
   ↓
Browse Menu
   ↓
Add Food to Cart
   ↓
Checkout
   ↓
Validate Customer Information
   ↓
Create Order
   ↓
Generate Order ID
   ↓
Save Order
   ↓
Order Confirmation
   ↓
Admin Dashboard
   ↓
Admin Updates Status
   ↓
Customer Tracks Order
```

The system is designed so that the order status can later be connected to a real backend and database.

---

# 🔐 Admin Authentication

The admin dashboard uses `sessionStorage` to determine whether an administrator is logged in.

The login state is stored using:

```text
addisEatsAdminLoggedIn
```

If an administrator is not logged in, the dashboard redirects to:

```text
admin-login.html
```

Logging out removes the session and returns the administrator to the login page.

> **Note:** This authentication system is suitable for a frontend academic/project implementation. A production application should use secure server-side authentication.

---

# 📱 Responsive Design

Addis Eats is designed to work across different screen sizes, including:

* Desktop
* Tablet
* Mobile

The interface includes responsive layouts for:

* Navigation
* Menu cards
* Shopping cart
* Checkout
* Tracking
* Admin dashboard
* Admin sidebar

---

# 🎨 User Experience

The design focuses on making food ordering straightforward and visually engaging.

The application includes:

* Clear food cards
* Category filters
* Search functionality
* Interactive cart
* Favorite buttons
* Dark mode
* Order confirmation
* Visual order tracking
* Responsive layouts
* Admin management tools

---

# 🚀 Future Improvements

The current project uses browser storage for demonstration purposes. A future production version could introduce:

* Backend API
* Real database
* Secure authentication
* Restaurant accounts
* Real payment integration
* Real-time order tracking
* Delivery driver accounts
* Customer accounts
* Order history
* Restaurant management
* Notifications
* SMS notifications
* Online payment
* Location and map integration
* Real delivery tracking
* Cloud image storage

The existing order status system is already structured around:

```text
Confirmed → Preparing → On the Way → Delivered
```

which makes it suitable for connecting to a backend and real-time status system later.

---

# 🎯 Project Goal

The goal of Addis Eats is to demonstrate how a modern food delivery platform can be built using frontend web technologies while applying practical JavaScript concepts such as dynamic data loading, state management, forms, local storage, filtering, searching, and admin order management.

---

## 👩‍💻 Project

**Project Name:** Addis Eats
**Type:** Food Ordering & Delivery Web Application
**Platform:** Web
**Technologies:** HTML5, CSS3, JavaScript
**Data:** JSON + Browser Storage

---

## 📄 License

This project was created as an educational/project application. It can be modified and extended for learning and development purposes.
