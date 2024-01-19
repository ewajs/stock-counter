const barcodeInput = document.getElementById('barcodeInput');
const currentSectionSpan = document.getElementById('currentSectionSpan');
const totalItemsSection = document.getElementById('totalItemsSection');
const sectionPlus = document.getElementById('sectionPlus');
const sectionMinus = document.getElementById('sectionMinus');
const sections = {};

let currentSection = 1;

function updateSections() {
    currentSectionSpan.innerText = currentSection;
    if (sections[currentSection]){ 
        barcodeInput.value = sections[currentSection].join('\n') + '\n';
        totalItemsSection.innerText = sections[currentSection].length;
    } else {
        barcodeInput.value = "";
        totalItemsSection.innerText = 0;
    }
    barcodeInput.focus();
}

sectionPlus.addEventListener('click', () => {
    currentSection++;
    sectionMinus.classList.remove('disabled');
    updateSections();
});


sectionMinus.addEventListener('click', () => {
    currentSection--;
    if (currentSection < 2) sectionMinus.classList.add('disabled');
    updateSections();
});


document.addEventListener('DOMContentLoaded', () => barcodeInput.focus());

barcodeInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        const lines = barcodeInput.value.split("\n");
        // Iterate until length -1 because the last line will be empty
        for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i].includes(',')) continue; // Already processed
            lines[i] = lines[i] + ',1';
        }
        barcodeInput.value = lines.join("\n");
        totalItemsSection.innerText = lines.length - 1;
        sections[currentSection] = lines.slice(0, -1);
    }
});