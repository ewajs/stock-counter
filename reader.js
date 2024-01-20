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
const mainMenu = document.getElementById('mainMenu');
let sections = [[]];
let currentSection = 0;

document.addEventListener('DOMContentLoaded', () => {
    barcodeInput.focus()
    const sectionsData = localStorage.getItem('sections');
    if (sectionsData === null) return;
    sections = JSON.parse(sectionsData);
    currentSection = sections.length - 1;
    updateSections();
    updateTotalItems();
    checkSectionControls();
});

function storeChanges() {
    localStorage.setItem('sections', JSON.stringify(sections));
}

function getItemsInSection(section) {
    return section.reduce((acc, line) => acc + line.amount, 0);
}

function updateItemsInSection() {
    totalItemsSection.innerText = getItemsInSection(sections[currentSection]);
}

function updateTotalItems() {
    totalItems.innerText = sections.reduce((acc, section) => acc + getItemsInSection(section), 0);
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
    Swal.fire({
        title: `Borrar Seccion?`,
        text: `Esta sección contiene ${getItemsInSection(sections[currentSection])} items, borrar?`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
    }).then(result => {
        if (result.isConfirmed) {
            sections.splice(currentSection, 1);
            if(currentSection > 0) currentSection--;
            updateSections();
            updateTotalItems();
            checkSectionControls();
            storeChanges();
        }
    })
    
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

function addBarcode(barcode) {
    barcodeInput.focus();
    barcode = barcode.trim();
    if (barcode === '') return;
    // Add to list, table and reset
    const index = sections[currentSection].length;
    const barcodeData = {barcode, index, amount: 1};
    sections[currentSection].push(barcodeData);
    addBarcodeToTable(barcodeData);
    barcodeInput.value = '';
    updateItemsInSection();
    updateTotalItems();
    storeChanges();
}

function addBarcodeToTable(barcodeData) {
    const tr = document.createElement('tr');
    tr.dataset.barcode = barcodeData.barcode;
    tr.dataset.index = barcodeData.index;
    tr.dataset.amount = barcodeData.amount;
    tr.classList.add('barcode');
    const td1 = document.createElement('td');
    td1.innerHTML = '<i class="bi bi-pencil"></i>';
    const td2 = document.createElement('td');
    td2.classList.add('amount');
    td2.innerText = barcodeData.amount;
    const td3 = document.createElement('td');
    td3.classList.add('barcode');
    td3.innerText = barcodeData.barcode;
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

function deleteItem(index) {
    const indexToRemove = sections[currentSection].findIndex(el => el.index === index);
    sections[currentSection].splice(indexToRemove, 1);
    reindexSection();
}

function reindexSection() {
    sections[currentSection] = sections[currentSection].map((item, index) => {
        return {...item, index};
    });
    updateSections();
    updateTotalItems();
    storeChanges();
}

tableBody.addEventListener('click', (e) => {
    // Only listen for clicks on the edit button
    if (!e.target.classList.contains('bi-pencil')) return;
    const targetBarcodeRow = e.target.closest('tr');
    const index = parseInt(targetBarcodeRow.dataset.index);
    Swal.fire({
        title: `Editar ${targetBarcodeRow.dataset.barcode}`,
        html: `
        <div class="swal-edit">
            <p>Código de Barras/Cantidad</p>
            <div class="input-group">
                <input type="text" value="${targetBarcodeRow.dataset.barcode}" class="form-control barcode"/>
                <input type="number" value="${targetBarcodeRow.dataset.amount}" class="form-control amount"/>
            </div>
        </div>
        `,
        focusConfirm: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return [
            document.querySelector('.swal-edit .barcode').value,
            document.querySelector('.swal-edit .amount').value
          ];
        }
      }).then((result) => {
            if (result.isDismissed) return;
            else if (result.isDenied) deleteItem(index);
            else if (result.isConfirmed) {
                const [barcode, amount] = result.value;
                console.log("Updating", barcode, amount)
                targetBarcodeRow.dataset.barcode = barcode;
                targetBarcodeRow.dataset.amount = amount;
                const indexToEdit = sections[currentSection].findIndex(el => el.index === index);
                sections[currentSection][indexToEdit] = {index, barcode, amount: parseInt(amount)};
                targetBarcodeRow.querySelector('.barcode').innerText = barcode;
                targetBarcodeRow.querySelector('.amount').innerText = amount;
                updateItemsInSection();
                updateTotalItems();
                storeChanges();
            }
      });
});

function exportCSV() {
    let csvString = 'data:text/csv;charset=utf-8,Cantidad,Codigo,Seccion\r\n';
    sections.forEach((section, section_idx) => 
        section.forEach(item => 
            csvString += `"${item.amount}","${item.barcode}","${section_idx}"\r\n`));
    window.open(encodeURI(csvString.trim()));
    Swal.close();
    barcodeInput.focus();
}

function importCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.accept = ".csv, text/csv";
    
    fileInput.addEventListener('change', (e) => {
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                // Parse the results into a JSON
                const parsedCSV = Papa.parse(reader.result, { header: true });
                deleteAll();

                const validData =  parsedCSV.data.filter(item => 
                    item.hasOwnProperty('Cantidad') && item.hasOwnProperty('Codigo') && item.hasOwnProperty('Seccion'));
                const detectedSections = new Set();
                validData.forEach((item) => detectedSections.add(parseInt(item['Seccion'])));
                const sortedSections = [...detectedSections].sort()
                console.log(sortedSections);
            }
            reader.readAsText(fileInput.files[0]);
        }
    });
    
    fileInput.click();
}

function deleteAll() {
    sections = [[]];
    currentSection = 0;
    storeChanges();
    updateSections();
    updateTotalItems();
    Swal.close();
    barcodeInput.focus();
}

mainMenu.addEventListener('click', () => {
    Swal.fire({
        title: `Menú Principal`,
        customClass: 'main-menu',
        html: `
        <div class="container">
            <div class="row mt-2">
                <div class="col">
                    <button class="btn btn-primary export">Exportar</button>
                    <button class="btn btn-success import">Importar</button>
                    <button class="btn btn-danger delete">Borrar</button>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <button class="btn btn-light cancel">Cancelar</button>
                </div>
            </div>
        </div>
        `,
        showConfirmButton: false,
        didOpen() {
            document.querySelector('.main-menu .export').addEventListener('click', exportCSV);
            document.querySelector('.main-menu .import').addEventListener('click', importCSV);
            document.querySelector('.main-menu .delete').addEventListener('click', deleteAll);
            document.querySelector('.main-menu .cancel').addEventListener('click', () => Swal.close());

        }
      });
})