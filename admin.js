const dashboard = document.querySelector("#admin-dashboard");
const sidebar = document.querySelector("#admin-sidebar");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const logoutButton = document.querySelector("#admin-logout");
const settingsLogout = document.querySelector("#settings-logout");
const notificationButton = document.querySelector("#admin-notification");
const notificationBadge = document.querySelector("#notification-badge");
const adminName = document.querySelector("#admin-name");
const dashboardDate = document.querySelector("#dashboard-date");
const totalRevenue = document.querySelector("#total-revenue");
const totalOrders = document.querySelector("#total-orders");
const averageOrderValue = document.querySelector("#average-order-value");
const totalCustomers = document.querySelector("#total-customers");
const revenueChange = document.querySelector("#revenue-change");
const ordersChange = document.querySelector("#orders-change");
const averageChange = document.querySelector("#average-change");
const customersChange = document.querySelector("#customers-change");
const topSellingList = document.querySelector("#top-selling-list");
const viewMenuButton = document.querySelector("#view-menu-button");
const statusTotalOrders = document.querySelector("#status-total-orders");
const statusChartTotal = document.querySelector("#status-chart-total");
const statusChart = document.querySelector("#status-chart");
const confirmedCount = document.querySelector("#confirmed-count");
const preparingCount = document.querySelector("#preparing-count");
const onTheWayCount = document.querySelector("#on-the-way-count");
const deliveredCount = document.querySelector("#delivered-count");
const recentOrdersBody = document.querySelector("#recent-orders-body");
const adminMenuGrid = document.querySelector("#admin-menu-grid");
const adminMenuSearch = document.querySelector("#admin-menu-search");
const menuFilterButtons = document.querySelectorAll(".admin-menu-filter");
const addMenuButton = document.querySelector("#add-menu-button");
const ordersContainer = document.querySelector("#orders-container");
const orderSearch = document.querySelector("#order-search");
const orderStatusFilter = document.querySelector("#order-status-filter");
const navLinks = document.querySelectorAll(".admin-nav-link");
let menu = [];
let orders = [];
let customers = [];
async function loadMenu() {
    const savedMenu = localStorage.getItem("addisEatsMenu");
    if (savedMenu) {
        try {
            menu = JSON.parse(savedMenu);
            displayAdminMenu(menu);
            updateDashboard();
            displayTopSellingDishes();
            return;
        } catch (error) {
            console.error("Could not read saved menu:", error);
        }
    }
    try {
        const response = await fetch("data/menu.json");
        if (!response.ok) throw new Error("Could not load menu.json");
        menu = await response.json();
        localStorage.setItem("addisEatsMenu", JSON.stringify(menu));
        displayAdminMenu(menu);
        updateDashboard();
        displayTopSellingDishes();
    }
    catch (error) {
        console.error("Error loading menu:", error);
        menu = [];
        displayAdminMenu(menu);
        updateDashboard();
        displayTopSellingDishes();
    }
}
function loadOrders() {
    let savedOrders = localStorage.getItem("addisEatsOrders");
    if (savedOrders) {
        try {
            orders = JSON.parse(savedOrders);
        } catch (error) {
            console.error("Could not read orders:", error);
            orders = [];
        }
    } else {
        const singleOrder = localStorage.getItem("addisEatsOrder");
        if (singleOrder) {
            try {
                const parsedOrder = JSON.parse(singleOrder);
                orders = [parsedOrder];
                localStorage.setItem("addisEatsOrders", JSON.stringify(orders));
            } catch (error) {
                console.error("Could not read order:", error);
                orders = [];
            }
        } else {
            orders = [];
        }
    }
    orders = orders.map(order => ({ ...order, status: normalizeStatus(order.status) }));
    saveOrders();
    refreshAllOrderDisplays();
}
function normalizeStatus(status) {
    if (!status) return "confirmed";
    const value = String(status).toLowerCase().trim();
    if (value === "on the way" || value === "ontheway" || value === "on_the_way") return "on-the-way";
    if (value === "confirm") return "confirmed";
    if (value === "preparing") return "preparing";
    if (value === "delivered") return "delivered";
    if (value === "cancelled" || value === "canceled") return "cancelled";
    if (value === "confirmed") return "confirmed";
    if (value === "on-the-way") return "on-the-way";
    return "confirmed";
}
function saveOrders() {
    const data = JSON.stringify(orders);
    localStorage.setItem("addisEatsOrders", data);
    if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        localStorage.setItem("addisEatsOrder", JSON.stringify(latestOrder));
    }
}
function saveOrderToBothKeys(order) {
    const data = JSON.stringify(order);
    localStorage.setItem("addisEatsOrder", data);
    const allOrders = JSON.parse(localStorage.getItem("addisEatsOrders") || "[]");
    const index = allOrders.findIndex(item => String(item.id) === String(order.id));
    if (index !== -1) {
        allOrders[index] = order;
    } else {
        allOrders.push(order);
    }
    localStorage.setItem("addisEatsOrders", JSON.stringify(allOrders));
}
function refreshAllOrderDisplays() {
    updateDashboard();
    updateOrderStatus();
    displayTopSellingDishes();
    displayRecentOrders();
    displayOrders(orders);
    createCustomers();
}
function updateDashboard() {
    const revenue = orders.reduce((total, order) => total + Number(order.total || 0), 0);
    const average = orders.length > 0 ? revenue / orders.length : 0;
    const customerSet = new Set();
    orders.forEach(order => {
        const phone = order.customer?.phone;
        if (phone) customerSet.add(phone);
    });
    if (totalRevenue) totalRevenue.textContent = `${revenue.toLocaleString()} ETB`;
    if (totalOrders) totalOrders.textContent = orders.length;
    if (averageOrderValue) averageOrderValue.textContent = `${Math.round(average).toLocaleString()} ETB`;
    if (totalCustomers) totalCustomers.textContent = customerSet.size;
    if (revenueChange) revenueChange.textContent = "0%";
    if (ordersChange) ordersChange.textContent = "0%";
    if (averageChange) averageChange.textContent = "0%";
    if (customersChange) customersChange.textContent = "0%";
    updateNotificationBadge();
}
function updateNotificationBadge() {
    if (!notificationBadge) return;
    const pendingOrders = orders.filter(order => order.status === "confirmed" || order.status === "preparing");
    notificationBadge.textContent = pendingOrders.length;
    notificationBadge.style.display = pendingOrders.length === 0 ? "none" : "flex";
}
function updateOrderStatus() {
    const confirmed = orders.filter(order => order.status === "confirmed").length;
    const preparing = orders.filter(order => order.status === "preparing").length;
    const onTheWay = orders.filter(order => order.status === "on-the-way").length;
    const delivered = orders.filter(order => order.status === "delivered").length;
    const total = orders.length;
    if (statusTotalOrders) statusTotalOrders.textContent = total;
    if (statusChartTotal) statusChartTotal.textContent = total;
    if (confirmedCount) confirmedCount.textContent = confirmed;
    if (preparingCount) preparingCount.textContent = preparing;
    if (onTheWayCount) onTheWayCount.textContent = onTheWay;
    if (deliveredCount) deliveredCount.textContent = delivered;
    if (statusChart) {
        if (total === 0) {
            statusChart.style.background = "conic-gradient(#e5e7eb 0deg 360deg)";
        } else {
            const confirmedDegrees = confirmed / total * 360;
            const preparingDegrees = preparing / total * 360;
            const onTheWayDegrees = onTheWay / total * 360;
            const confirmedEnd = confirmedDegrees;
            const preparingEnd = confirmedEnd + preparingDegrees;
            const onTheWayEnd = preparingEnd + onTheWayDegrees;
            statusChart.style.background = `conic-gradient(#ef4444 0deg ${confirmedEnd}deg,#f59e0b ${confirmedEnd}deg ${preparingEnd}deg,#3b82f6 ${preparingEnd}deg ${onTheWayEnd}deg,#22c55e ${onTheWayEnd}deg 360deg)`;
        }
    }
}
function displayAdminMenu(items) {
    if (!adminMenuGrid) return;
    adminMenuGrid.innerHTML = "";
    if (items.length === 0) {
        adminMenuGrid.innerHTML = `<div class="admin-empty-state"><p>No menu items found.</p></div>`;
        return;
    }
    items.forEach(food => {
        const card = document.createElement("article");
        card.className = "admin-menu-card";
        const image = food.image ? food.image.replace("../", "") : "";
        card.innerHTML = `
    <div class="admin-menu-image">${image ? `<img src="${image}" alt="${food.name}">` : `<span>🍽️</span>`}</div>
    <div class="admin-menu-content">
        <span class="admin-menu-category">${food.category || "Other"}</span>
        <h3>${food.name}</h3>
        <p>${food.description || ""}</p>
    <div class="admin-menu-bottom">
        <strong>${Number(food.price || 0).toLocaleString()} ETB</strong>
    <div class="admin-menu-actions">
        <button type="button" class="edit-menu-button" data-id="${food.id}">Edit</button>
        <button type="button" class="delete-menu-button" data-id="${food.id}">Delete</button>
    </div>
    </div>
    </div>`;
        adminMenuGrid.appendChild(card);
    });
}
function filterMenu() {
    const searchTerm = adminMenuSearch ? adminMenuSearch.value.toLowerCase().trim() : "";
    const activeButton = document.querySelector(".admin-menu-filter.active");
    const category = activeButton ? activeButton.dataset.category.toLowerCase() : "all";
    const results = menu.filter(food => {
        const matchesSearch = (food.name || "").toLowerCase().includes(searchTerm) || (food.description || "").toLowerCase().includes(searchTerm) || (food.category || "").toLowerCase().includes(searchTerm);
        const matchesCategory = category === "all" || (food.category || "").trim().toLowerCase() === category;
        return matchesSearch && matchesCategory;
    });
    displayAdminMenu(results);
}
if (adminMenuSearch) adminMenuSearch.addEventListener("input", filterMenu);
menuFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
        menuFilterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        filterMenu();
    });
});
if (adminMenuGrid) {
    adminMenuGrid.addEventListener("click", event => {
        const editButton = event.target.closest(".edit-menu-button");
        const deleteButton = event.target.closest(".delete-menu-button");
        if (editButton) editMenuItem(editButton.dataset.id);
        if (deleteButton) deleteMenuItem(deleteButton.dataset.id);
    });
}
function editMenuItem(foodId) {
    const food = menu.find(item => String(item.id) === String(foodId));
    if (!food) return;
    const newName = prompt("Food name:", food.name);
    if (newName === null || !newName.trim()) return;
    const newPrice = prompt("Food price:", food.price);
    if (newPrice === null) return;
    const price = Number(newPrice);
    if (!Number.isFinite(price) || price < 0) {
        alert("Please enter a valid price.");
        return;
    }
    const newDescription = prompt("Food description:", food.description || "");
    if (newDescription === null) return;
    food.name = newName.trim();
    food.price = price;
    food.description = newDescription.trim();
    saveMenu();
    displayAdminMenu(menu);
    updateDashboard();
}
function deleteMenuItem(foodId) {
    const food = menu.find(item => String(item.id) === String(foodId));
    if (!food) return;
    if (!confirm(`Delete ${food.name} from the menu?`)) return;
    menu = menu.filter(item => String(item.id) !== String(foodId));
    saveMenu();
    displayAdminMenu(menu);
    updateDashboard();
}
function saveMenu() {
    localStorage.setItem("addisEatsMenu", JSON.stringify(menu));
}
if (addMenuButton) {
    addMenuButton.addEventListener("click", () => {
        const name = prompt("Food name:");
        if (!name || !name.trim()) return;
        const price = Number(prompt("Food price:"));
        if (!Number.isFinite(price) || price < 0) {
            alert("Please enter a valid price.");
            return;
        }
        const category = prompt("Food category:");
        if (!category || !category.trim()) return;
        const description = prompt("Food description:") || "";
        const image = prompt("Food image path:") || "";
        const newFood = {
            id: Date.now(),
            name: name.trim(),
            price: price,
            category: category.trim().toLowerCase(),
            description: description.trim(),
            image: image.trim()
        };
        menu.push(newFood);
        saveMenu();
        displayAdminMenu(menu);
        updateDashboard();
    });
}
function displayOrders(items) {
    if (!ordersContainer) return;
    ordersContainer.innerHTML = "";
    if (items.length === 0) {
        ordersContainer.innerHTML = `<div class="admin-empty-state"><p>No orders found.</p></div>`;
        return;
    }
    items.forEach(order => {
        const orderCard = document.createElement("article");
        orderCard.className = "admin-order-card";
        const itemHTML = order.items?.map(item => `
<div class="admin-order-item">
<span>${item.name || "Item"} × ${Number(item.quantity || 0)}</span>
<strong>${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()} ETB</strong>
</div>`).join("") || "";
        orderCard.innerHTML = `
<div class="admin-order-header">
<div><span>Order</span><h3>${order.id || "N/A"}</h3></div>
<span class="order-status ${order.status || ""}">${formatStatus(order.status)}</span>
</div>
<div class="admin-order-customer">
<strong>${order.customer?.name || "Unknown"}</strong>
<span>${order.customer?.phone || ""}</span>
<span>${order.customer?.address || ""}</span>
</div>
<div class="admin-order-items">${itemHTML}</div>
<div class="admin-order-footer">
<strong>Total: ${Number(order.total || 0).toLocaleString()} ETB</strong>
<select class="order-status-select" data-id="${order.id || ""}">
<option value="confirmed" ${order.status === "confirmed" ? "selected" : ""}>Confirmed</option>
<option value="preparing" ${order.status === "preparing" ? "selected" : ""}>Preparing</option>
<option value="on-the-way" ${order.status === "on-the-way" ? "selected" : ""}>On the Way</option>
<option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
<option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelled</option>
</select>
</div>`;
        ordersContainer.appendChild(orderCard);
    });
}
if (ordersContainer) {
    ordersContainer.addEventListener("change", event => {
        if (!event.target.classList.contains("order-status-select")) return;
        updateOrderStatusById(event.target.dataset.id, event.target.value);
    });
}
function updateOrderStatusById(orderId, newStatus) {
    const index = orders.findIndex(item => String(item.id) === String(orderId));
    if (index === -1) {
        alert("Order could not be found.");
        return;
    }
    const updatedOrder = {
        ...orders[index],
        status: normalizeStatus(newStatus),
        updatedAt: new Date().toISOString()
    };
    orders[index] = updatedOrder;
    saveOrders();
    saveOrderToBothKeys(updatedOrder);
    refreshAllOrderDisplays();
    const orderTrackerData = {
        id: updatedOrder.id,
        status: updatedOrder.status,
        customer: updatedOrder.customer,
        items: updatedOrder.items,
        total: updatedOrder.total,
        createdAt: updatedOrder.createdAt || updatedOrder.date || updatedOrder.timestamp,
        updatedAt: updatedOrder.updatedAt
    };
    localStorage.setItem("addisEatsOrder", JSON.stringify(orderTrackerData));
    alert(`Order ${updatedOrder.id} is now ${formatStatus(updatedOrder.status)}.`);
}
function filterOrders() {
    const searchTerm = orderSearch ? orderSearch.value.toLowerCase().trim() : "";
    const selectedStatus = orderStatusFilter ? orderStatusFilter.value : "all";
    const filteredOrders = orders.filter(order => {
        const id = String(order.id || "").toLowerCase();
        const name = String(order.customer?.name || "").toLowerCase();
        const phone = String(order.customer?.phone || "").toLowerCase();
        const matchesSearch = id.includes(searchTerm) || name.includes(searchTerm) || phone.includes(searchTerm);
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });
    displayOrders(filteredOrders);
}
if (orderSearch) orderSearch.addEventListener("input", filterOrders);
if (orderStatusFilter) orderStatusFilter.addEventListener("change", filterOrders);
function createCustomers() {
    const customerMap = new Map();
    orders.forEach(order => {
        const phone = order.customer?.phone;
        if (!phone) return;
        if (!customerMap.has(phone)) {
            customerMap.set(phone, { name: order.customer?.name || "Unknown", phone: phone, address: order.customer?.address || "", orders: 0, totalSpent: 0 });
        }
        const customer = customerMap.get(phone);
        customer.orders++;
        customer.totalSpent += Number(order.total || 0);
    });
    customers = Array.from(customerMap.values());
}
function displayTopSellingDishes() {
    if (!topSellingList) return;
    const dishStats = {};
    orders.forEach(order => {
        if (!order.items) return;
        order.items.forEach(item => {
            const id = item.id || item.name;
            if (!dishStats[id]) {
                dishStats[id] = { id: item.id, name: item.name, quantity: 0, revenue: 0, image: item.image || "" };
            }
            dishStats[id].quantity += Number(item.quantity || 0);
            dishStats[id].revenue += Number(item.price || 0) * Number(item.quantity || 0);
        });
    });
    const topDishes = Object.values(dishStats).sort((a, b) => b.quantity - a.quantity).slice(0, 4);
    topSellingList.innerHTML = "";
    if (topDishes.length === 0) {
        topSellingList.innerHTML = `<div class="admin-empty-state"><p>No sales data available yet.</p></div>`;
        return;
    }
    topDishes.forEach((dish, index) => {
        const menuItem = menu.find(item => item.id === dish.id || item.name === dish.name);
        const image = dish.image || menuItem?.image || "";
        const item = document.createElement("article");
        item.className = "selling-item";
        item.innerHTML = `
<div class="selling-rank">${String(index + 1).padStart(2, "0")}</div>
<div class="selling-image">${image ? `<img src="${image.replace("../", "")}" alt="${dish.name}">` : `<span>🍽️</span>`}</div>
<div class="selling-info"><h3>${dish.name}</h3><p>${dish.quantity} orders</p></div>
<div class="selling-revenue">${dish.revenue.toLocaleString()} ETB</div>`;
        topSellingList.appendChild(item);
    });
}
function displayRecentOrders() {
    if (!recentOrdersBody) return;
    recentOrdersBody.innerHTML = "";
    const recentOrders = [...orders].reverse().slice(0, 5);
    if (recentOrders.length === 0) {
        recentOrdersBody.innerHTML = `<tr><td colspan="7">No orders found.</td></tr>`;
        return;
    }
    recentOrders.forEach(order => {
        const row = document.createElement("tr");
        const itemCount = order.items ? order.items.reduce((total, item) => total + Number(item.quantity || 0), 0) : 0;
        const customerName = order.customer?.name || "Unknown";
        row.innerHTML = `
<td>${order.id || "N/A"}</td>
<td>${customerName}</td>
<td>${itemCount}</td>
<td>${Number(order.total || 0).toLocaleString()} ETB</td>
<td><span class="order-status ${order.status || ""}">${formatStatus(order.status)}</span></td>
<td>${formatOrderDate(order)}</td>
<td><button type="button" class="view-order-button" data-id="${order.id || ""}">View</button></td>`;
        recentOrdersBody.appendChild(row);
    });
}
function formatOrderDate(order) {
    const dateValue = order.updatedAt || order.date || order.createdAt || order.timestamp;
    if (!dateValue) return "Today";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Today";
    return date.toLocaleDateString();
}
function formatStatus(status) {
    if (!status) return "Unknown";
    return String(status).replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}
if (recentOrdersBody) {
    recentOrdersBody.addEventListener("click", event => {
        const button = event.target.closest(".view-order-button");
        if (!button) return;
        const order = orders.find(item => String(item.id) === String(button.dataset.id));
        if (!order) return;
        const customerName = order.customer?.name || "Unknown";
        alert(`Order: ${order.id}\nCustomer: ${customerName}\nStatus: ${formatStatus(order.status)}\nTotal: ${Number(order.total || 0).toLocaleString()} ETB`);
    });
}
function setDashboardDate() {
    if (!dashboardDate) return;
    dashboardDate.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function setupSidebar() {
    if (!sidebarToggle || !sidebar) return;
    sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(navLink => navLink.classList.remove("active"));
            link.classList.add("active");
            if (sidebar) sidebar.classList.remove("open");
        });
    });
}
function setupViewMenuButton() {
    if (!viewMenuButton) return;
    viewMenuButton.addEventListener("click", () => {
        document.querySelector("#menu-management")?.scrollIntoView({ behavior: "smooth" });
        navLinks.forEach(link => link.classList.remove("active"));
        const menuLink = document.querySelector('a[href="#menu-management"]');
        if (menuLink) menuLink.classList.add("active");
    });
}
function setupNotifications() {
    if (!notificationButton) return;
    notificationButton.addEventListener("click", () => {
        const pendingOrders = orders.filter(order => order.status === "confirmed" || order.status === "preparing");
        if (pendingOrders.length === 0) {
            alert("No new notifications.");
            return;
        }
        alert(`You have ${pendingOrders.length} order(s) that need attention.`);
    });
}
function setupLogout() {
    const buttons = [logoutButton, settingsLogout];
    buttons.forEach(button => {
        if (!button) return;
        button.addEventListener("click", () => {
            sessionStorage.removeItem("addisEatsAdminLoggedIn");
            window.location.href = "admin-login.html";
        });
    });
}
function checkAdminLogin() {
    const loggedIn = sessionStorage.getItem("addisEatsAdminLoggedIn");
    if (loggedIn !== "true") {
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}
window.addEventListener("storage", event => {
    if (event.key === "addisEatsOrders" || event.key === "addisEatsOrder") {
        loadOrders();
    }
});
window.addEventListener("focus", () => {
    loadOrders();
});
setInterval(() => {
    const latestOrders = localStorage.getItem("addisEatsOrders");
    if (latestOrders) {
        try {
            const parsedOrders = JSON.parse(latestOrders);
            if (JSON.stringify(parsedOrders) !== JSON.stringify(orders)) {
                orders = parsedOrders.map(order => ({ ...order, status: normalizeStatus(order.status) }));
                refreshAllOrderDisplays();
            }
        } catch (error) {
            console.error("Could not refresh orders:", error);
        }
    }
}, 2000);
function initializeDashboard() {
    if (!checkAdminLogin()) return;
    setupSidebar();
    setupNavigation();
    setupViewMenuButton();
    setupNotifications();
    setupLogout();
    setDashboardDate();
    loadMenu();
    loadOrders();
}
initializeDashboard();