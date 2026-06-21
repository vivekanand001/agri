const storageKey = 'agriInventoryData';
let products = [];
let activeCategory = 'Seeds';
const sampleProducts = [
  { id: crypto.randomUUID(), name: 'Corn Seeds', category: 'Seeds', price: 45.5, stock: 120 },
  { id: crypto.randomUUID(), name: 'Tomato Seeds', category: 'Seeds', price: 18.75, stock: 90 },
  { id: crypto.randomUUID(), name: 'Organic Fertilizer', category: 'Fertilizers', price: 78.0, stock: 60 },
  { id: crypto.randomUUID(), name: 'Nitrogen Booster', category: 'Fertilizers', price: 95.2, stock: 34 },
  { id: crypto.randomUUID(), name: 'Leaf Spray', category: 'Pesticides', price: 64.99, stock: 48 },
  { id: crypto.randomUUID(), name: 'Insect Guard', category: 'Pesticides', price: 53.0, stock: 72 }
];

const homeView = document.getElementById('homeView');
const categoriesView = document.getElementById('categoriesView');
const createView = document.getElementById('createView');
const scannerView = document.getElementById('scannerView');
const searchInput = document.getElementById('searchInput');
const productList = document.getElementById('productList');
const categoryProductList = document.getElementById('categoryProductList');
const categoryTitle = document.getElementById('categoryTitle');
const createForm = document.getElementById('createForm');
const receiptInput = document.getElementById('receiptInput');
const scanButton = document.getElementById('scanButton');
const scannerMessage = document.getElementById('scannerMessage');
const receiptPreview = document.getElementById('receiptPreview');
const previewWrapper = document.getElementById('previewWrapper');
const modeToggle = document.getElementById('modeToggle');

const navButtons = document.querySelectorAll('.nav-button');
const tabButtons = document.querySelectorAll('.tab-button');

function loadProducts() {
  const saved = localStorage.getItem(storageKey);
  try {
    products = saved ? JSON.parse(saved) : [...sampleProducts];
  } catch (error) {
    products = [...sampleProducts];
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function renderProductCard(product, container, showCategory = true) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const row = document.createElement('div');
  row.className = 'product-row';

  const labels = document.createElement('div');
  labels.className = 'product-labels';

  const nameEl = document.createElement('div');
  nameEl.className = 'product-name';
  nameEl.textContent = product.name;

  const meta = document.createElement('div');
  meta.className = 'product-meta';
  if (showCategory) {
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'badge';
    categoryBadge.textContent = product.category;
    meta.appendChild(categoryBadge);
  }

  const priceBadge = document.createElement('span');
  priceBadge.className = 'badge';
  priceBadge.textContent = formatCurrency(product.price);

  const stockBadge = document.createElement('span');
  stockBadge.className = 'badge';
  stockBadge.textContent = `Stock: ${product.stock}`;

  meta.append(priceBadge, stockBadge);
  labels.append(nameEl, meta);

  const editButton = document.createElement('button');
  editButton.className = 'action-button';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => openEditor(card, product));

  row.append(labels, editButton);
  card.appendChild(row);
  container.appendChild(card);
}

function openEditor(card, product) {
  card.innerHTML = '';
  const editor = document.createElement('div');
  editor.className = 'editor-row';

  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.step = '0.01';
  priceInput.min = '0';
  priceInput.value = product.price;
  priceInput.placeholder = 'Price';

  const stockInput = document.createElement('input');
  stockInput.type = 'number';
  stockInput.min = '0';
  stockInput.value = product.stock;
  stockInput.placeholder = 'Stock';

  const saveButton = document.createElement('button');
  saveButton.className = 'primary-button';
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => {
    product.price = Math.max(0, parseFloat(priceInput.value) || 0);
    product.stock = Math.max(0, parseInt(stockInput.value, 10) || 0);
    saveProducts();
    renderViews();
  });

  const cancelButton = document.createElement('button');
  cancelButton.className = 'action-button';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => renderViews());

  editor.append(priceInput, stockInput, saveButton, cancelButton);
  card.appendChild(editor);
}

function renderViews() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));

  productList.innerHTML = '';
  if (!filtered.length) {
    productList.innerHTML = '<p>No matching items found.</p>';
  } else {
    filtered.forEach(product => renderProductCard(product, productList));
  }

  categoryProductList.innerHTML = '';
  const categoryItems = products.filter(product => product.category === activeCategory);
  if (!categoryItems.length) {
    categoryProductList.innerHTML = '<p>No products in this category yet.</p>';
  } else {
    categoryItems.forEach(product => renderProductCard(product, categoryProductList, false));
  }
  categoryTitle.textContent = activeCategory;
}

function switchView(target) {
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.getElementById(target).classList.add('active');
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === target));
}

function switchCategory(category, button) {
  activeCategory = category;
  tabButtons.forEach(tab => tab.classList.toggle('active', tab.dataset.category === category));
  renderViews();
}

function clampStockUpdate(delta) {
  return Math.max(0, delta);
}

async function scanReceipt() {
  const file = receiptInput.files?.[0];
  scannerMessage.textContent = '';
  if (!file) {
    scannerMessage.textContent = 'Please choose an image receipt to scan.';
    return;
  }

  scanButton.disabled = true;
  scanButton.textContent = 'Scanning...';

  try {
    const result = await mockGeminiOCR(file);
    if (!result || !result.name || typeof result.quantity !== 'number') {
      scannerMessage.textContent = 'Unable to read receipt. Try another image or use a file name like `CornSeeds-5.jpg` for demo scanning.';
      return;
    }

    const product = products.find(item => item.name.toLowerCase() === result.name.toLowerCase());
    if (!product) {
      scannerMessage.textContent = `No product named "${result.name}" found. Create it first or adjust the receipt text.`;
      return;
    }

    product.stock = clampStockUpdate(product.stock - result.quantity);
    saveProducts();
    renderViews();
    scannerMessage.textContent = `Updated ${product.name} stock by -${result.quantity}. Current stock: ${product.stock}.`;
  } catch (error) {
    scannerMessage.textContent = 'Scan failed. Try another receipt image or refresh the page.';
  } finally {
    scanButton.disabled = false;
    scanButton.textContent = 'Scan & Update Stock';
  }
}

function mockGeminiOCR(file) {
  return new Promise(resolve => {
    const filename = file.name.replace(/\.[^.]+$/, '');
    const match = filename.match(/(.+)[-_ ](\d+)$/);
    if (match) {
      resolve({ name: match[1].replace(/[-_]/g, ' ').trim(), quantity: parseInt(match[2], 10) });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      receiptPreview.src = imageUrl;
      previewWrapper.classList.remove('hidden');
      resolve({ name: 'Corn Seeds', quantity: 5 });
    };
    reader.readAsDataURL(file);
  });
}

function initializeScannerPreview() {
  receiptInput.addEventListener('change', () => {
    const file = receiptInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        receiptPreview.src = reader.result;
        previewWrapper.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });
}

function initDarkMode() {
  const savedMode = localStorage.getItem('agriDarkMode');
  const isDark = savedMode === 'dark';
  document.documentElement.classList.toggle('dark-mode', isDark);
  modeToggle.textContent = isDark ? '☀️' : '🌙';
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('agriDarkMode', isDark ? 'dark' : 'light');
}

createForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('newName').value.trim();
  const category = document.getElementById('newCategory').value;
  const price = parseFloat(document.getElementById('newPrice').value) || 0;
  const stock = parseInt(document.getElementById('newStock').value, 10) || 0;

  if (!name) return;

  products.unshift({ id: crypto.randomUUID(), name, category, price: Math.max(0, price), stock: Math.max(0, stock) });
  saveProducts();
  createForm.reset();
  scannerMessage.textContent = '';
  switchView('homeView');
  renderViews();
});

scanButton.addEventListener('click', scanReceipt);
modeToggle.addEventListener('click', toggleDarkMode);
searchInput.addEventListener('input', renderViews);

navButtons.forEach(button => {
  button.addEventListener('click', () => switchView(button.dataset.view));
});

tabButtons.forEach(button => {
  button.addEventListener('click', () => switchCategory(button.dataset.category, button));
});

window.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initDarkMode();
  initializeScannerPreview();
  renderViews();
});
