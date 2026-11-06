const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let historyInput = '';
let shouldResetScreen = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value !== null) {
            handleNumberOrOperator(value);
        } else if (action !== null) {
            handleAction(action);
        }
    });
});

function handleNumberOrOperator(value) {
    if (currentInput === '0' || shouldResetScreen) {
        if (value === '.') {
            currentInput = '0.';
        } else if (isOperator(value)) {
            return;
        } else {
            currentInput = value;
        }
        shouldResetScreen = false;
    } else {
        if (value === '.' && getLastNumber().includes('.')) return;
        
        if (isOperator(value) && isOperator(currentInput.slice(-1))) {
            currentInput = currentInput.slice(0, -1) + value;
            updateDisplay();
            return;
        }

        currentInput += value;
    }
    updateDisplay();
}

function handleAction(action) {
    switch (action) {
        case 'clear':
            currentInput = '0';
            historyInput = '';
            shouldResetScreen = false;
            break;
        case 'del':
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            break;
        case 'calculate':
            try {
                historyInput = currentInput + ' =';
                let sanitizedInput = currentInput
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');
                
                let evalResult = eval(sanitizedInput);
                
                if (!Number.isInteger(evalResult)) {
                    evalResult = parseFloat(evalResult.toFixed(8));
                }
                
                currentInput = String(evalResult);
                shouldResetScreen = true;
            } catch (error) {
                currentInput = 'Error';
                shouldResetScreen = true;
            }
            break;
    }
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '×', '÷', '%'].includes(char);
}

function getLastNumber() {
    const parts = currentInput.split(/[\+\-\×\÷%]/);
    return parts[parts.length - 1];
}

function updateDisplay() {
    resultElement.textContent = currentInput;
    historyElement.textContent = historyInput;
}

// Tambahan fitur dukungan keyboard
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleNumberOrOperator(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let op = e.key;
        if (op === '*') op = '×';
        if (op === '/') op = '÷';
        handleNumberOrOperator(op);
    } else if (e.key === 'Enter' || e.key === '=') {
        handleAction('calculate');
    } else if (e.key === 'Backspace') {
        handleAction('del');
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleAction('clear');
    }
});