const cartButton = document.querySelector("#cart-button");
const themeButton = document.querySelector("#theme-button");
const menuGrid = document.querySelector("#menu-grid");
const searchInput = document.querySelector("#menu-search");

const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");
const cartClose = document.querySelector("#cart-close");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const deliveryFee = document.querySelector("#delivery-fee");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const filterButtons = document.querySelectorAll(".filter-btn");
const checkoutPanel = document.querySelector("#checkout-panel");
const checkoutOverlay = document.querySelector("#checkout-overlay");
const checkoutClose = document.querySelector("#checkout-close");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutTotal = document.querySelector("#checkout-total");
const popularGrid = document.querySelector("#popular-grid");
const orderConfirmation = document.querySelector("#order-confirmation");
const confirmationOrderId = document.querySelector("#confirmation-order-id");
const confirmationTotal = document.querySelector("#confirmation-total");
const trackOrderButton = document.querySelector("#track-order-button");
const searchButton = document.querySelector("#search-button");
const trackingForm = document.querySelector("#tracking-form");
const orderIdInput = document.querySelector("#order-id");
const navToggle = document.querySelector("#nav-toggle");
const navLinks = document.querySelector("#nav-links");
const foodModal = document.querySelector("#food-modal");
const foodModalOverlay = document.querySelector("#food-modal-overlay");
const foodModalClose = document.querySelector("#food-modal-close");
const foodModalImage = document.querySelector("#food-modal-image");
const foodModalCategory = document.querySelector("#food-modal-category");
const foodModalTitle = document.querySelector("#food-modal-title");
const foodModalDescription = document.querySelector("#food-modal-description");
const foodModalIngredientsList = document.querySelector("#food-modal-ingredients-list");

let menu = [];
let cart = [];
let favorites = JSON.parse(localStorage.getItem("addisEatsFavorites")) || [];

const DELIVERY_FEE = 50;

async function loadMenu() {
    try {
        const response = await fetch("data/menu.json");

        if (!response.ok) {
            throw new Error("Could not load menu.json");
        }

        menu = await response.json();

        displayMenu(menu);
        displayPopularMenu();
    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

function displayMenu(items) {
    if (!menuGrid) {
        return;
    }

    menuGrid.innerHTML = "";

    items.forEach(food => {
        const card = document.createElement("article");
        card.className = "food-card";
        card.dataset.id = food.id;

        card.innerHTML = `
            <div class="food-card-image">
                <img
                    src="${food.image.replace("../", "")}"
                    alt="${food.name}"
                >
            </div>

            <div class="food-card-content">
                <span class="food-category">
                    ${food.category}
                </span>

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-card-bottom">
                    <span class="food-price">
                        ${food.price} ETB
                    </span>

                    <div class="food-card-actions">

                        <button
                            type="button"
                            class="favorite-button"
                            data-id="${food.id}"
                            aria-label="Add ${food.name} to favorites"
                        >
                            ${favorites.includes(food.id) ? "♥" : "♡"}
                        </button>

                        <button
                            type="button"
                            class="add-cart"
                            data-id="${food.id}"
                            aria-label="Add ${food.name} to cart"
                        >
                            +
                        </button>

                    </div>
                </div>
            </div>
        `;

        menuGrid.appendChild(card);
    });
}

function setupFoodCardInteractions(container) {

    if (!container) {
        return;
    }

    container.addEventListener("click", function (event) {

        const addButton = event.target.closest(".add-cart");
        const favoriteButton = event.target.closest(".favorite-button");
        const card = event.target.closest(".food-card");

        if (addButton) {

            const foodId = Number(addButton.dataset.id);

            const food = menu.find(item => item.id === foodId);

            if (!food) {
                return;
            }

            const existingItem = cart.find(
                item => item.food.id === foodId
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    food: food,
                    quantity: 1
                });
            }

            updateCartCount();
            renderCart();
            return;
        }

        if (favoriteButton) {

            const foodId = Number(favoriteButton.dataset.id);

            toggleFavorite(foodId);

            favoriteButton.textContent =
                favorites.includes(foodId) ? "♥" : "♡";
            return;
        }

        if (card) {

            const foodId = Number(card.dataset.id);

            const food = menu.find(item => item.id === foodId);

            if (food) {
                openFoodModal(food);
            }
        }
    });
}

setupFoodCardInteractions(menuGrid);
setupFoodCardInteractions(popularGrid);

function renderCart() {
    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let subtotal = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        if (cartSubtotal) {
            cartSubtotal.textContent = "0 ETB";
        }

        if (deliveryFee) {
            deliveryFee.textContent = "0 ETB";
        }

        if (cartTotal) {
            cartTotal.textContent = "0 ETB";
        }

        return;
    }

    cart.forEach(item => {

        const itemTotal =
            item.food.price * item.quantity;

        subtotal += itemTotal;

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="${item.food.image.replace("../", "")}"
                    alt="${item.food.name}"
                >
            </div>

            <div class="cart-item-info">

                <h4>${item.food.name}</h4>

                <p>
                    ${item.food.price} ETB each
                </p>

                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="quantity-minus"
                        data-id="${item.food.id}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-plus"
                        data-id="${item.food.id}"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        class="remove-item"
                        data-id="${item.food.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

            <div class="cart-item-price">
                ${itemTotal} ETB
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    const total = subtotal + DELIVERY_FEE;

    if (cartSubtotal) {
        cartSubtotal.textContent =
            `${subtotal} ETB`;
    }

    if (deliveryFee) {
        deliveryFee.textContent =
            `${DELIVERY_FEE} ETB`;
    }

    if (cartTotal) {
        cartTotal.textContent =
            `${total} ETB`;
    }
}

if (cartItems) {
    cartItems.addEventListener("click", function (event) {

        const foodId =
            Number(event.target.dataset.id);

        if (event.target.classList.contains("quantity-plus")) {

            const item = cart.find(
                item => item.food.id === foodId
            );

            if (item) {
                item.quantity++;
            }
        }

        if (event.target.classList.contains("quantity-minus")) {

            const item = cart.find(
                item => item.food.id === foodId
            );

            if (item) {
                item.quantity--;

                if (item.quantity <= 0) {
                    cart = cart.filter(
                        item => item.food.id !== foodId
                    );
                }
            }
        }

        if (event.target.classList.contains("remove-item")) {

            cart = cart.filter(
                item => item.food.id !== foodId
            );
        }

        updateCartCount();
        renderCart();
    });
}

function updateCartCount() {

    if (!cartCount) {
        return;
    }

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = count;

    if (count === 0) {
        cartCount.classList.add("hidden");
    } else {
        cartCount.classList.remove("hidden");
    }
}

function openCart() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (cartClose) {
    cartClose.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        updateCheckoutSummary();

        closeCart();

        checkoutPanel.classList.add("active");
        checkoutOverlay.classList.add("active");
    });
}

function updateCheckoutSummary() {

    let subtotal = 0;

    cart.forEach(item => {
        subtotal +=
            item.food.price * item.quantity;
    });

    const total =
        subtotal + DELIVERY_FEE;

    if (checkoutSubtotal) {
        checkoutSubtotal.textContent =
            `${subtotal} ETB`;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent =
            `${total} ETB`;
    }
}

function closeCheckout() {

    if (!checkoutPanel || !checkoutOverlay) {
        return;
    }

    checkoutPanel.classList.remove("active");
    checkoutOverlay.classList.remove("active");
}

if (checkoutClose) {
    checkoutClose.addEventListener(
        "click",
        closeCheckout
    );
}

if (checkoutOverlay) {
    checkoutOverlay.addEventListener(
        "click",
        closeCheckout
    );
}

if (checkoutForm) {
    checkoutForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            const formData =
                new FormData(checkoutForm);

            const name =
                formData.get("name")?.trim();

            const phone =
                formData.get("phone")?.trim();

            const address =
                formData.get("address")?.trim();

            const payment =
                formData.get("payment");

            if (!name || name.length < 2) {
                alert("Please enter your full name.");
                return;
            }

            if (!phone || !/^09\d{8}$/.test(phone)) {
                alert(
                    "Please enter a valid Ethiopian phone number."
                );
                return;
            }

            if (!address || address.length < 5) {
                alert(
                    "Please enter your delivery address."
                );
                return;
            }

            if (!payment) {
                alert(
                    "Please select a payment method."
                );
                return;
            }

            createOrder(
                name,
                phone,
                address,
                payment
            );
        }
    );
}

function createOrder(
    name,
    phone,
    address,
    paymentMethod
) {

    let subtotal = 0;

    cart.forEach(item => {
        subtotal +=
            item.food.price * item.quantity;
    });

    const order = {

        id: `AE-${Date.now()}`,

        customer: {
            name: name,
            phone: phone,
            address: address
        },

        paymentMethod: paymentMethod,

        items: cart.map(item => ({
            id: item.food.id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity
        })),

        subtotal: subtotal,

        deliveryFee: DELIVERY_FEE,

        total: subtotal + DELIVERY_FEE,

        status: "confirmed"
    };



    localStorage.setItem(
        "addisEatsOrder",
        JSON.stringify(order)
    );


    const savedOrders =
        JSON.parse(
            localStorage.getItem("addisEatsOrders") || "[]"
        );


    savedOrders.push(order);

    localStorage.setItem(
        "addisEatsOrders",
        JSON.stringify(savedOrders)
    );

    console.log("Order created:", order);

    showOrderConfirmation(order);

    clearCart();
}

function showOrderConfirmation(order) {

    if (confirmationOrderId) {
        confirmationOrderId.textContent =
            order.id;
    }

    if (confirmationTotal) {
        confirmationTotal.textContent =
            `${order.total} ETB`;
    }

    closeCheckout();

    if (orderConfirmation) {
        orderConfirmation.classList.add("active");
    }
}

function clearCart() {

    cart = [];

    updateCartCount();

    renderCart();

    if (checkoutForm) {
        checkoutForm.reset();
    }
}

if (trackOrderButton) {
    trackOrderButton.addEventListener(
        "click",
        function () {

            if (orderConfirmation) {
                orderConfirmation.classList.remove(
                    "active"
                );
            }

            if (orderIdInput && confirmationOrderId) {

                orderIdInput.value =
                    confirmationOrderId.textContent;
            }

            const tracking =
                document.querySelector("#tracking");

            if (tracking) {
                tracking.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}

if (trackingForm) {
    trackingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const enteredId =
                orderIdInput.value.trim();

            if (enteredId === "") {
                alert("Please enter your order ID.");
                return;
            }

            const savedOrders = JSON.parse(
                localStorage.getItem("addisEatsOrders") || "[]"
            );


            const savedOrder = savedOrders.find(
                order =>
                    String(order.id).trim() === String(enteredId).trim()
            );

            if (!savedOrder) {
                alert("Order ID not found.");
                return;
            }


            localStorage.setItem(
                "addisEatsOrder",
                JSON.stringify(savedOrder)
            );

            updateTracking(savedOrder);
        }
    );
}

function updateTracking(order) {


    const steps =
        document.querySelectorAll(".progress-step");


    const statusIndex = {

        confirmed: 0,

        preparing: 1,

        "on-the-way": 2,

        delivered: 3
    };

    const status =
        String(order.status || "confirmed")
            .toLowerCase()
            .trim();


    const currentIndex =
        statusIndex[status];


    if (currentIndex === undefined) {
        console.error(
            "Unknown order status:",
            order.status
        );
        return;
    }

    steps.forEach((step, index) => {

        step.classList.remove(
            "active",
            "completed"
        );


        if (index < currentIndex) {
            step.classList.add("completed");
        }


        if (index === currentIndex) {
            step.classList.add("active");
        }
    });
}
filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        const selectedCategory =
            button.dataset.category
                .trim()
                .toLowerCase();


        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        if (selectedCategory === "all") {
            displayMenu(menu);
            return;
        }


        const filteredMenu = menu.filter(food => {

            const foodCategory =
                food.category
                    .trim()
                    .toLowerCase();

            return foodCategory === selectedCategory;
        });

        displayMenu(filteredMenu);
    });
});

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const results =
                menu.filter(food => {

                    return (
                        food.name
                            .toLowerCase()
                            .includes(searchTerm) ||

                        food.description
                            .toLowerCase()
                            .includes(searchTerm) ||

                        food.category
                            .toLowerCase()
                            .includes(searchTerm)
                    );
                });

            displayMenu(results);
        }
    );
}

function openFoodModal(food) {

    if (!foodModal || !foodModalOverlay) {
        return;
    }

    if (foodModalImage) {
        foodModalImage.src = food.image.replace("../", "");
        foodModalImage.alt = food.name;
    }

    if (foodModalCategory) {
        foodModalCategory.textContent = food.category;
    }

    if (foodModalTitle) {
        foodModalTitle.textContent = food.name;
    }

    if (foodModalDescription) {
        foodModalDescription.textContent = food.description;
    }

    if (foodModalIngredientsList) {

        foodModalIngredientsList.innerHTML = "";

        const ingredients = Array.isArray(food.ingredients)
            ? food.ingredients
            : [];

        ingredients.forEach(function (ingredient) {
            const li = document.createElement("li");
            li.textContent = ingredient;
            foodModalIngredientsList.appendChild(li);
        });
    }

    foodModal.classList.add("active");
    foodModalOverlay.classList.add("active");
}

function closeFoodModal() {

    if (!foodModal || !foodModalOverlay) {
        return;
    }

    foodModal.classList.remove("active");
    foodModalOverlay.classList.remove("active");
}

if (foodModalClose) {
    foodModalClose.addEventListener("click", closeFoodModal);
}

if (foodModalOverlay) {
    foodModalOverlay.addEventListener("click", closeFoodModal);
}

function openMobileNav() {

    if (!navLinks || !navToggle) {
        return;
    }

    navLinks.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
}

function closeMobileNav() {

    if (!navLinks || !navToggle) {
        return;
    }

    navLinks.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle) {
    navToggle.addEventListener("click", function () {

        if (navLinks && navLinks.classList.contains("active")) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });
}

if (navLinks) {
    navLinks.addEventListener("click", function (event) {

        if (event.target.tagName === "A") {
            closeMobileNav();
        }
    });
}

document.addEventListener("click", function (event) {

    if (!navLinks || !navToggle) {
        return;
    }

    if (!navLinks.classList.contains("active")) {
        return;
    }

    if (navLinks.contains(event.target) || navToggle.contains(event.target)) {
        return;
    }

    closeMobileNav();
});

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeMobileNav();
        closeFoodModal();
    }
});

function toggleFavorite(foodId) {

    const index =
        favorites.indexOf(foodId);

    if (index === -1) {
        favorites.push(foodId);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem(
        "addisEatsFavorites",
        JSON.stringify(favorites)
    );
}
loadMenu();
updateCartCount();
renderCart();
if (searchButton && searchInput) {
    searchButton.addEventListener("click", function () {
        searchInput.focus();
    });
}
const favoritesButton =
    document.querySelector("#favorites-button");
if (favoritesButton) {
    favoritesButton.addEventListener("click", function () {

        const favoriteMenu = menu.filter(food =>
            favorites.includes(food.id)
        );

        displayMenu(favoriteMenu);
    });
}
const savedTheme = localStorage.getItem("addisEatsTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "addisEatsTheme",
            isDark ? "dark" : "light"
        );
    });
}
function displayPopularMenu() {

    if (!popularGrid) {
        return;
    }

    // Take the first 4 items from the menu
    const popularItems = menu.slice(0, 4);

    popularGrid.innerHTML = "";

    popularItems.forEach(food => {

        const card = document.createElement("article");
        card.className = "food-card";
        card.dataset.id = food.id;

        card.innerHTML = `
            <div class="food-card-image">
                <img
                    src="${food.image.replace("../", "")}"
                    alt="${food.name}"
                >
            </div>

            <div class="food-card-content">

                <span class="food-category">
                    ${food.category}
                </span>

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-card-bottom">

                    <span class="food-price">
                        ${food.price} ETB
                    </span>

                    <div class="food-card-actions">

                        <button
                            type="button"
                            class="favorite-button"
                            data-id="${food.id}"
                            aria-label="Add ${food.name} to favorites"
                        >
                            ${favorites.includes(food.id) ? "♥" : "♡"}
                        </button>

                        <button
                            type="button"
                            class="add-cart"
                            data-id="${food.id}"
                            aria-label="Add ${food.name} to cart"
                        >
                            +
                        </button>

                    </div>

                </div>

            </div>
        `;

        popularGrid.appendChild(card);
    });
}
const loader = document.querySelector("#loader");

window.addEventListener("load", function () {
    setTimeout(function () {
        loader.classList.add("hidden");
    }, 800);
});