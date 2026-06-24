document.addEventListener('DOMContentLoaded', function() {
    const tiles = document.querySelectorAll('.bingo-tile');
    const clearBtn = document.getElementById('clearBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Load state from localStorage
    loadState();

    // Add event listeners to tiles
    tiles.forEach(tile => {
        const input = tile.querySelector('.tile-input');
        const content = tile.querySelector('.tile-content');

        // Handle input change
        input.addEventListener('change', function() {
            content.textContent = this.value;
            saveState();
        });

        // Handle tile click to mark/unmark
        tile.addEventListener('click', function(e) {
            // Don't toggle mark if clicking on input
            if (e.target === input) {
                return;
            }
            this.classList.toggle('marked');
            saveState();
        });

        // Allow input to be focused for editing
        input.addEventListener('focus', function(e) {
            e.stopPropagation();
        });

        input.addEventListener('blur', function() {
            content.textContent = this.value;
        });
    });

    // Clear all tiles (marks and text)
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all tiles?')) {
            tiles.forEach(tile => {
                const input = tile.querySelector('.tile-input');
                const content = tile.querySelector('.tile-content');
                input.value = '';
                content.textContent = '';
                tile.classList.remove('marked');
            });
            saveState();
        }
    });

    // Reset only the marks
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all marks?')) {
            tiles.forEach(tile => {
                tile.classList.remove('marked');
            });
            saveState();
        }
    });

    // Save state to localStorage
    function saveState() {
        const state = [];
        tiles.forEach((tile, index) => {
            const input = tile.querySelector('.tile-input');
            const isMarked = tile.classList.contains('marked');
            state.push({
                text: input.value,
                marked: isMarked
            });
        });
        localStorage.setItem('bingoState', JSON.stringify(state));
    }

    // Load state from localStorage
    function loadState() {
        const saved = localStorage.getItem('bingoState');
        if (saved) {
            const state = JSON.parse(saved);
            tiles.forEach((tile, index) => {
                const input = tile.querySelector('.tile-input');
                const content = tile.querySelector('.tile-content');
                
                if (state[index]) {
                    input.value = state[index].text;
                    content.textContent = state[index].text;
                    
                    if (state[index].marked) {
                        tile.classList.add('marked');
                    }
                }
            });
        }
    }
});
