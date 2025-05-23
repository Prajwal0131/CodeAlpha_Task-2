document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const numberButtons = document.querySelectorAll('.btn.number');
    const operatorButtons = document.querySelectorAll('.btn.operator');
    const clearButton = document.getElementById('clear');
    const equalButton = document.getElementById('equal');

    let currentInput = '0'; // Stores the current number being entered
    let firstOperand = null; // Stores the first number in an operation
    let operator = null; // Stores the selected operator (+, -, *, /)
    let waitingForSecondOperand = false; // Flag to check if we're ready for the next number

    // Function to update the display
    function updateDisplay() {
        display.value = currentInput;
    }

    // Handle number button clicks
    numberButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const digit = event.target.textContent;

            if (waitingForSecondOperand === true) {
                currentInput = digit;
                waitingForSecondOperand = false;
            } else {
                // Prevent multiple leading zeros, but allow '0.'
                if (currentInput === '0' && digit !== '.') {
                    currentInput = digit;
                } else if (digit === '.' && currentInput.includes('.')) {
                    // Do nothing if decimal already exists
                    return;
                } else {
                    currentInput += digit;
                }
            }
            updateDisplay();
        });
    });

    // Handle operator button clicks
    operatorButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const nextOperator = event.target.textContent;
            const inputValue = parseFloat(currentInput);

            if (operator && waitingForSecondOperand) {
                // If an operator was pressed twice in a row, update the operator
                operator = nextOperator;
                return;
            }

            if (firstOperand === null) {
                firstOperand = inputValue;
            } else if (operator) {
                const result = operate(firstOperand, inputValue, operator);
                currentInput = String(result);
                firstOperand = result;
            }

            waitingForSecondOperand = true;
            operator = nextOperator;
            updateDisplay(); // Update display to show the current result/first operand before next input
        });
    });

    // Handle the equals button
    equalButton.addEventListener('click', () => {
        if (firstOperand === null || operator === null) {
            return; // Not enough info to calculate
        }

        const secondOperand = parseFloat(currentInput);
        const result = operate(firstOperand, secondOperand, operator);

        currentInput = String(result);
        firstOperand = null; // Reset for next calculation
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    });

    // Handle the clear button
    clearButton.addEventListener('click', () => {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    });

    // Function to perform arithmetic operations
    function operate(num1, num2, op) {
        switch (op) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                if (num2 === 0) {
                    alert("Cannot divide by zero!");
                    return 0; // Or handle as an error state
                }
                return num1 / num2;
            default:
                return num2; // Should not happen
        }
    }

    // Initialize display on load
    updateDisplay();
});