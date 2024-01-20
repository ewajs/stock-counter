const barcodeInput = document.getElementById('barcodeInput');
const barcodeEnter = document.getElementById('barcodeEnter')
const tableBody = document.getElementById('tableBody');
const currentSectionSpan = document.getElementById('currentSectionSpan');
const totalSectionsSpan = document.getElementById('totalSectionsSpan');
const totalItemsSection = document.getElementById('totalItemsSection');
const totalItems = document.getElementById('totalItems');
const sectionPlus = document.getElementById('sectionPlus');
const sectionMinus = document.getElementById('sectionMinus');
const sectionDelete = document.getElementById('sectionDelete');
let sections = [];

let currentSection = 0;

sections[currentSection] = [];

function updateItemsInSection() {
    totalItemsSection.innerText = sections[currentSection].length;
}

function updateTotalItems() {
    totalItems.innerText = sections.reduce((acc, section) => acc + section.length, 0);
}

function updateSections() {
    currentSectionSpan.innerText = currentSection + 1;
    barcodeInput.value = "";
    tableBody.innerHTML = '';
    if (sections[currentSection]){ 
        sections[currentSection].forEach(addBarcodeToTable);
    } else { // Initialize to empty array on first time
        sections[currentSection] = [];
    }
    updateItemsInSection();
    totalSectionsSpan.innerText = sections.length;
    barcodeInput.focus();
}

function deleteSection() {
    sections.splice(currentSection, 1);
    if(currentSection > 0) currentSection--;
    updateSections();
    updateTotalItems();
    checkSectionControls();
}

function checkSectionControls() {
    if (currentSection < 1) {
        sectionMinus.classList.add('disabled');
        sectionDelete.classList.add('disabled');
    } else {
        sectionMinus.classList.remove('disabled');
        sectionDelete.classList.remove('disabled');
    }
}

function sectionBack() {
    currentSection--;
    checkSectionControls();
    updateSections();
}

function sectionForward() {
    currentSection++;
    checkSectionControls();
    updateSections();
}

sectionPlus.addEventListener('click', sectionForward);
sectionMinus.addEventListener('click', sectionBack);
sectionDelete.addEventListener('click', deleteSection)


document.addEventListener('DOMContentLoaded', () => barcodeInput.focus());

function addBarcode(barcode) {
    barcodeInput.focus();
    barcode = barcode.trim();
    if (barcode === '') return;
    // Add to list, table and reset
    sections[currentSection].push(barcode);
    addBarcodeToTable(barcode, sections[currentSection].length - 1);
    barcodeInput.value = '';
    updateItemsInSection();
    updateTotalItems();
}

function addBarcodeToTable(barcode, idx) {
    const tr = document.createElement('tr');
    tr.dataset.barcode = barcode;
    tr.dataset.index = idx;
    tr.classList.add('barcode');
    const td1 = document.createElement('td');
    td1.innerHTML = '<i class="bi bi-pencil"></i>';
    const td2 = document.createElement('td');
    td2.innerText = 1;
    const td3 = document.createElement('td');
    td3.innerText = barcode;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tableBody.appendChild(tr);
}


barcodeInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        addBarcode(barcodeInput.value);
    }
});

barcodeEnter.addEventListener('click', () => addBarcode(barcodeInput.value));

