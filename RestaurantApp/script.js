const menuItems = [
  { id: 1, name: "Chicken Biryani", course: "main", price: 200 },
  { id: 2, name: "Veg Biryani", course: "main", price: 150 },
  { id: 3, name: "Egg Biryani", course: "main", price: 170 },
  { id: 4, name: "Hyderabadi Dum Biryani", course: "main", price: 220 },
  { id: 5, name: "Veg Thali", course: "main", price: 130 },
  { id: 6, name: "Punjabi Thali", course: "main", price: 150 },
  { id: 7, name: "Veg Pulao", course: "main", price: 140 },
  { id: 8, name: "Chicken Tikka", course: "starters", price: 160 },
  { id: 9, name: "Chicken 65", course: "starters", price: 170 },
  { id: 10, name: "Tandoori Chicken", course: "starters", price: 200 },
  { id: 11, name: "Veg Manchurian", course: "starters", price: 100 },
  { id: 12, name: "Paneer Tikka", course: "starters", price: 140 },
  { id: 13, name: "Chocolate Ice Cream", course: "desserts", price: 80 },
  { id: 14, name: "Vanilla Ice Cream", course: "desserts", price: 60 },
  { id: 15, name: "Chocolate Brownie", course: "desserts", price: 100 },
  { id: 16, name: "Gulab Jamun", course: "desserts", price: 60 },
  { id: 17, name: "Rasgulla", course: "desserts", price: 50 },
  { id: 18, name: "Tea", course: "beverages", price: 40 },
  { id: 19, name: "Coffee", course: "beverages", price: 50 },
  { id: 20, name: "Cappuccino", course: "beverages", price: 70 },
];

const tables = [
  { tableno: "Table-1", order: [] },
  { tableno: "Table-2", order: [] },
  { tableno: "Table-3", order: [] },
  { tableno: "Table-4", order: [] },
  { tableno: "Table-5", order: [] },
  { tableno: "Table-6", order: [] },
  { tableno: "Table-7", order: [] },
  { tableno: "Table-8", order: [] },
  { tableno: "Table-9", order: [] },
  { tableno: "Table-10", order: [] },
];

const menuItemsContainer = document.querySelector(".menu-items");
const tableContainer = document.querySelector(".tables");
const tableCards = document.querySelectorAll(".tableCard");
const orderDetailsModal = document.getElementById("orderDetailsModal");
const modalOrderItems = document.getElementById("modalOrderItems");
const searchTableInput = document.getElementById("searchTableInput");
const bill = document.getElementById("bill");

function renderTables(tables) {
  tableContainer.innerHTML = "";

  tables.forEach((table) => {
    const tabNo = document.createElement("div");
    tabNo.className = "tableCard";
    tabNo.id = `tableCard-${table.tableno}`;
    tabNo.addEventListener("click", () => {
      showOrderDetails(table);
    });

    tabNo.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.target.classList.add("drag-over");
    });

    tabNo.addEventListener("dragleave", (e) => {
      e.target.classList.remove("drag-over");
    });

    tabNo.addEventListener("drop", handleDrop);

    const tableNumber = document.createElement("h2");
    tableNumber.innerText = `${table.tableno}`;
    tabNo.appendChild(tableNumber);

    const tableData = document.createElement("div");
    tableData.className = "table-data";

    const totalItems = document.createElement("span");
    totalItems.innerText = "Total Items : 0";
    totalItems.className = "totalitems";

    const totalCost = document.createElement("span");
    totalCost.innerText = "Rs. 0.00";
    totalCost.className = "totalcost";

    const space = document.createElement("span");
    space.innerText = "|";

    tableData.appendChild(totalCost);
    tableData.appendChild(space);
    tableData.appendChild(totalItems);

    tabNo.appendChild(tableData);

    tableContainer.appendChild(tabNo);
  });
}

function renderMenuItems(items) {
  menuItemsContainer.innerHTML = "";

  items.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.draggable = true;
    menuItem.dataset.itemId = item.id;
    menuItem.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.id.toString());
    });
    menuItem.addEventListener("dragend", (e) => {
      menuItem.classList.remove("dragging");
    });

    const itemName = document.createElement("span");
    itemName.className = "menu-item-name";
    itemName.innerText = item.name;

    const itemPrice = document.createElement("p");
    itemPrice.className = "menu-item-price";
    itemPrice.innerText = `₹${item.price}.00`;

    menuItem.appendChild(itemName);
    menuItem.appendChild(itemPrice);

    menuItemsContainer.appendChild(menuItem);
  });
}

function filterTables(searchTerm) {
  const filteredTables = tables.filter((table) => {
    const tableNo = table.tableno.toLowerCase();
    searchTerm = searchTerm.toLowerCase();

    const isTableMatch = tableNo.includes(searchTerm);
    return isTableMatch;
  });
  renderTables(filteredTables);
}

function filterMenuItems(searchTerm, courseType) {
  const filteredItems = menuItems.filter((item) => {
    const itemName = item.name.toLowerCase();
    const course = item.course.toLowerCase();
    searchTerm = searchTerm.toLowerCase();

    const isItemMatch = itemName.includes(searchTerm);
    const isCourseMatch = courseType === "" || course === courseType;

    return isItemMatch && isCourseMatch;
  });

  renderMenuItems(filteredItems);
}

document.getElementById("searchTableInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  filterTables(searchTerm);
});

document.getElementById("searchItemInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  const courseType = document.getElementById("courseTypeSelect").value;
  filterMenuItems(searchTerm, courseType);
});

document.getElementById("courseTypeSelect").addEventListener("change", (e) => {
  const searchTerm = document.getElementById("searchItemInput").value;
  const courseType = e.target.value;
  filterMenuItems(searchTerm, courseType);
});

function showOrderDetails(table) {
  modalOrderItems.innerHTML = "";

  const tableNumber = table.tableno;

  const heading = document.createElement("h3");
  heading.textContent = `${tableNumber} | Order Details`;
  modalOrderItems.appendChild(heading);
  let totalCost = 0;

  const headrow = document.createElement("tr");
  headrow.className = "headrow";
  const sno = document.createElement("td");
  sno.textContent = "Sno";
  headrow.appendChild(sno);

  const item = document.createElement("td");
  item.textContent = "Menu item";
  headrow.appendChild(item);

  const price = document.createElement("td");
  price.textContent = "Item price";
  headrow.appendChild(price);

  const servings = document.createElement("td");
  servings.textContent = "No of servings";
  headrow.appendChild(servings);

  const totalpri = document.createElement("td");
  totalpri.textContent = "Total Price";
  headrow.appendChild(totalpri);

  modalOrderItems.appendChild(headrow);

  table.order.forEach((item, index) => {
    const row = document.createElement("tr");

    const snoCell = document.createElement("td");
    snoCell.textContent = index + 1;
    row.appendChild(snoCell);

    const itemCell = document.createElement("td");
    itemCell.textContent = item.name;
    row.appendChild(itemCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `₹${item.price}.00`;
    row.appendChild(priceCell);

    const servingsCell = document.createElement("td");
    const servingsInput = document.createElement("input");
    servingsInput.type = "number";
    servingsInput.min = 1;
    servingsInput.value = 1;
    servingsInput.addEventListener("change", () => {
      updateServings(table, index, servingsInput.value);
    });
    servingsCell.appendChild(servingsInput);
    row.appendChild(servingsCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `₹${(item.price * servingsInput.value).toFixed(2)}`;
    row.appendChild(totalCell);

    const total = item.price * servingsInput.value;

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteItemFromOrder(table, index);
    });
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    totalCost += total;

    modalOrderItems.appendChild(row);
  });

  const bottomcontainer = document.createElement("div");
  bottomcontainer.className="bottomcontainer";
  const totalprice = document.createElement("span");
  totalprice.textContent = `Total Cost: ₹${totalCost.toFixed(2)}`;
  bottomcontainer.appendChild(totalprice);

  const closeSession = document.createElement("button");
  closeSession.textContent="Close Session (Generate Bill)";
  closeSession.addEventListener("click", () => {
    generatebill(table);
  });
  bottomcontainer.appendChild(closeSession);
  modalOrderItems.appendChild(bottomcontainer);

  orderDetailsModal.style.display = "block";
}

function generatebill(table){
  bill.innerHTML="";
  const heading = document.createElement("h3");
  heading.textContent = `Bill Details`;
  bill.appendChild(heading);
  let totalCost = 0;

  const headrow = document.createElement("tr");
  headrow.className = "headrow";
  const sno = document.createElement("td");
  sno.textContent = "Sno";
  headrow.appendChild(sno);

  const item = document.createElement("td");
  item.textContent = "Menu item";
  headrow.appendChild(item);

  const price = document.createElement("td");
  price.textContent = "Item price";
  headrow.appendChild(price);

  const servings = document.createElement("td");
  servings.textContent = "No of servings";
  headrow.appendChild(servings);

  const totalpri = document.createElement("td");
  totalpri.textContent = "Total Price";
  headrow.appendChild(totalpri);

  bill.appendChild(headrow);

  table.order.forEach((item, index) => {
    const row = document.createElement("tr");

    const snoCell = document.createElement("td");
    snoCell.textContent = index + 1;
    row.appendChild(snoCell);

    const itemCell = document.createElement("td");
    itemCell.textContent = item.name;
    row.appendChild(itemCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `₹${item.price}.00`;
    row.appendChild(priceCell);

    const servingsCell = document.createElement("td");
    servingsCell.textContent = table.order[index].servings;
    row.appendChild(servingsCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `₹${(item.price * table.order[index].servings).toFixed(2)}`;
    row.appendChild(totalCell);

    const total = item.price * table.order[index].servings;


    totalCost += total;

    bill.appendChild(row);

  });

  const totalprice = document.createElement("p");
  totalprice.className= "billprice";
  totalprice.textContent = `Total Cost: ₹${totalCost.toFixed(2)}`;
  bill.appendChild(totalprice);

  orderDetailsModal.style.display="none";
  bill.style.display="block";
}


function updateServings(table, index, servings) {
  table.order[index].servings = parseInt(servings);

  updateOrderDetails(table);
}

function deleteItemFromOrder(table, index) {
  table.order.splice(index, 1);
  updateOrderDetails(table);
}

function updateOrderDetails(table) {
  let totalCost = 0;
  const tableNumber = table.tableno;
  modalOrderItems.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = `${tableNumber} | Order Details`;
  modalOrderItems.appendChild(heading);

  const headrow = document.createElement("tr");
  headrow.className = "headrow";
  const sno = document.createElement("td");
  sno.textContent = "Sno";
  headrow.appendChild(sno);

  const item = document.createElement("td");
  item.textContent = "Menu item";
  headrow.appendChild(item);

  const price = document.createElement("td");
  price.textContent = "Item price";
  headrow.appendChild(price);

  const servings = document.createElement("td");
  servings.textContent = "No of servings";
  headrow.appendChild(servings);

  const totalpri = document.createElement("td");
  totalpri.textContent = "Total Price";
  headrow.appendChild(totalpri);

  modalOrderItems.appendChild(headrow);

  table.order.forEach((item, index) => {
    const row = document.createElement("tr");

    const snoCell = document.createElement("td");
    snoCell.textContent = index + 1;
    row.appendChild(snoCell);

    const itemCell = document.createElement("td");
    itemCell.textContent = item.name;
    row.appendChild(itemCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `₹${item.price}.00`;
    row.appendChild(priceCell);

    const servingsCell = document.createElement("td");
    const servingsInput = document.createElement("input");
    servingsInput.type = "number";
    servingsInput.min = 1;
    servingsInput.value = item.servings || 1;
    servingsInput.addEventListener("change", () => {
      updateServings(table, index, servingsInput.value);
    });
    servingsCell.appendChild(servingsInput);
    row.appendChild(servingsCell);

    const totalCell = document.createElement("td");
    const total = item.price * servingsInput.value;
    totalCell.textContent = `₹${total.toFixed(2)}`;
    row.appendChild(totalCell);

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteItemFromOrder(table, index);
    });
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    modalOrderItems.appendChild(row);

    totalCost += total;
  });

  const totalCostElement = document.createElement("p");
  totalCostElement.textContent = `Total Cost: ₹${totalCost.toFixed(2)}`;
  modalOrderItems.appendChild(totalCostElement);

  const tableCard = document.getElementById(`tableCard-${table.tableno}`);
  const totalCostCard = tableCard.querySelector(".totalcost");
  totalCostCard.textContent = `Rs. ${totalCost.toFixed(2)}`;
}

function closeOrderDetailsModal() {
  orderDetailsModal.style.display = "none";
}

orderDetailsModal.querySelector(".close").addEventListener("click", () => {
  closeOrderDetailsModal();
});

function handleDrop(e) {
  e.preventDefault();
  const itemId = e.dataTransfer.getData("text/plain");
  const tableCard = e.target.closest(".tableCard");
  const tableNumber = tableCard.querySelector("h2").innerText;

  const table = tables.find((table) => table.tableno === tableNumber);

  const menuItem = menuItems.find((item) => item.id.toString() === itemId);

  if (table && menuItem) {
    table.order.push(menuItem);

    const totalItemsElement = tableCard.querySelector(".totalitems");
    const totalCostElement = tableCard.querySelector(".totalcost");
    const totalItems = table.order.length;
    const totalCost = table.order.reduce(
      (total, item) => total + item.price,
      0
    );

    totalItemsElement.innerText = `Total Items: ${totalItems}`;
    totalCostElement.innerText = `Rs. ${totalCost.toFixed(2)}`;
  }

  e.target.classList.remove("drag-over");
  const draggingItem = document.querySelector(".dragging");
  if (draggingItem) {
    draggingItem.classList.remove("dragging");
  }
}

renderTables(tables);
renderMenuItems(menuItems);
