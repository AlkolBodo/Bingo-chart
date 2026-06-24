document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resetBtn = document.getElementById('resetBtn');
    const inputSection = document.getElementById('inputSection');
    const chartSection = document.getElementById('chartSection');
    const bingoGrid = document.getElementById('bingoGrid');
    const inputs = document.querySelectorAll('.bingo-input');

    // Load saved state on page load
    loadState();

    // Generate the bingo chart from inputs
    generateBtn.addEventListener('click', function () {
        const values = Array.from(inputs).map(input => input.value.trim());

        if (values.every(v => v === '')) {
            alert('Please fill in at least one tile before generating!');
            return;
        }

        generateChart(values);
        inputSection.classList.add('hidden');
        chartSection.classList.remove('hidden');
        saveState(values, []);
    });

    // Go back to edit the inputs
    editBtn.addEventListener('click', function () {
        chartSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });

    // Reset only marks
    resetBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset all marks?')) {
            document.querySelectorAll('.bingo-tile').forEach(tile => {
                tile.classList.remove('marked');
            });
            saveCurrentState();
        }
    });

    // Clear all tiles and go back to input
    clearBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear everything?')) {
            inputs.forEach(input => input.value = '');
            bingoGrid.innerHTML = '';
            chartSection.classList.add('hidden');
            inputSection.classList.remove('hidden');
            localStorage.removeItem('bingoState');
        }
    });

    function generateChart(values) {
        bingoGrid.innerHTML = '';
        values.forEach((text, index) => {
            const tile = document.createElement('div');
            tile.classList.add('bingo-tile');

            const content = document.createElement('span');
            content.classList.add('tile-content');
            content.textContent = text || '';

            const mark = document.createElement('div');
            mark.classList.add('tile-mark');

            tile.appendChild(content);
            tile.appendChild(mark);

            tile.addEventListener('click', function () {
                this.classList.toggle('marked');
                saveCurrentState();
            });

            bingoGrid.appendChild(tile);
        });
    }

    function saveState(values, markedIndexes) {
        const state = {
            values: values,
            marked: markedIndexes
        };
        localStorage.setItem('bingoState', JSON.stringify(state));
    }

    function saveCurrentState() {
        const values = Array.from(inputs).map(i => i.value.trim());
        const marked = [];
        document.querySelectorAll('.bingo-tile').forEach((tile, i) => {
            if (tile.classList.contains('marked')) marked.push(i);
        });
        saveState(values, marked);
    }

    function loadState() {
        const saved = localStorage.getItem('bingoState');
        if (saved) {
            const state = JSON.parse(saved);
            if (state.values && state.values.some(v => v !== '')) {
                state.values.forEach((val, i) => {
                    if (inputs[i]) inputs[i].value = val;
                });
                generateChart(state.values);
                state.marked.forEach(i => {
                    const tiles = document.querySelectorAll('.bingo-tile');
                    if (tiles[i]) tiles[i].classList.add('marked');
                });
                inputSection.classList.add('hidden');
                chartSection.classList.remove('hidden');
            }
        }
    }
});
