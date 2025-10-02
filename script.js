class Calculator {

    constructor(previousOperandTextElement, currentOperandInputField) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandInputField = currentOperandInputField;
        this.operationArr = [];
        this.currentIndex = -1;
        this.previousIndex = 0;
        this.arrLength = 0;
        this.clear();
    }
    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.previousIndex = 0;
        this.currentIndex = -1;
        this.nextIndex = 0;
        this.operation = undefined;
        previousIcon.classList.remove("disable");
        nextIcon.classList.remove("disable");

    }
    getDataFromSession() {

        this.operationArr = JSON.parse(sessionStorage.getItem("operationData")) || [];
        if (this.operationArr == null) return;
        try {
            this.arrLength = this.operationArr.length - 1;
        } catch (error) {
            console.error("Cannot read lenght of and empty array", error.message);
        }
        return this.operationArr;
    }
    storeOperation(prev, current, operation, result) {
        if (prev === undefined && current === undefined && operation === undefined) return;
        this.operationArr.push({
            prev,
            current,
            operation,
            result
        });
        sessionStorage.setItem("operationData", JSON.stringify(this.operationArr));
    }

    operationData(event) {
        const operationArr = this.getDataFromSession();
        if (operationArr.length == 0) {
            this.showMessage();
            return;
        }
        if (event.target.classList.contains("fa-square-caret-left")) {
            if (this.previousIndex >= 0) {
                this.showData(this.previousIndex, operationArr);
                this.currentIndex = this.previousIndex;
                this.previousIndex--;

                if (nextIcon.classList.contains("disable")) nextIcon.classList.remove("disable");
                this.previousOperandTextElement.classList.add("right-to-left");


            }
            else {
                event.target.classList.add("disable");
                if (nextIcon.classList.contains("disable")) nextIcon.classList.remove("disable");
            }

        } else if (event.target.classList.contains("fa-square-caret-right")) {
            if (this.currentIndex < this.arrLength) {
                this.previousIndex = this.currentIndex;
                this.currentIndex++;
                this.showData(this.currentIndex, operationArr);


                if (previousIcon.classList.contains("disable")) previousIcon.classList.remove("disable");
                this.previousOperandTextElement.classList.add("left-to-right");

            } else {
                event.target.classList.add("disable");
                if (previousIcon.classList.contains("disable")) previousIcon.classList.remove("disable");
            }

        } else return;
    }
    showMessage() {
        this.previousOperandTextElement.innerText = "No operation yet"
        setTimeout(() => {
            this.previousOperandTextElement.innerText = "Operation history";
        }, 1000);
    }
    showData(index, arr) {
        const entry = arr[index];
        this.previousOperandTextElement.innerText = `${entry.prev} ${entry.operation} ${entry.current}`;
        this.currentOperandInputField.value = entry.result;
        this.currentOperand = entry.result;
        this.currentOperandInputField.value.length >= 12 ? this.currentOperandInputField.style.fontSize = "20px" : this.currentOperandInputField.style.fontSize = "30px";
        this.previousOperand = "";
        this.operation = undefined;

    }
    deleteHistory() {
        if (this.arrLength < 0) {
            this.showMessage();
            return;
        }
        this.operationArr = [];
        sessionStorage.setItem("operationData", JSON.stringify([]));
        this.currentOperand = "";
        this.updateDisplay();
        alert("History deleted!");

    }

    delete() {
        if (this.currentOperand === '' && this.previousOperand === '') return;

        if (this.currentOperand === '' && this.operation !== undefined) {
            this.operation = undefined;
            this.currentOperand = this.previousOperand;
            this.previousOperand = '';
            return;
        }

        this.currentOperand = this.currentOperand.slice(0, this.currentOperand.length - 1);

    }

    appendNumber(number) {

        if (number === "." && this.currentOperand.includes(".")) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();


    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && this.previousOperand !== '') {

            this.operation = operation;
            return;
        }

        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            console.log("called");
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }


    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '÷':
                result = parseFloat((prev / current).toFixed(2));
                break;
            default:
                return;
        }
        this.currentOperand = result.toString();

        if (this.currentOperand === 'Infinity') {
            this.operation = undefined;
            this.previousOperand = "";
            this.currentOperandInputField.value = this.currentOperand;
            setTimeout(() => {
                this.currentOperandInputField.value = "";
                this.currentOperand = "";

            }, 1000);
            return;

        }

        this.storeOperation(prev, current, this.operation, this.currentOperand);
        this.operationArr = this.getDataFromSession();
        this.arrLength = this.operationArr.length - 1;
        this.previousIndex = this.arrLength;
        this.previousOperand = '';
        this.operation = undefined;

    }


    updateDisplay() {
        if (this.previousOperand !== '' && this.operation !== undefined) {
            this.currentOperandInputField.value = `${this.previousOperand}${this.operation}${this.currentOperand}`.trim();

        } else this.currentOperandInputField.value = this.currentOperand.trim();
        this.currentOperandInputField.value.length >= 12 ? this.currentOperandInputField.style.fontSize = "20px" : this.currentOperandInputField.style.fontSize = "30px";
        if (this.currentOperandInputField.value.trim() === "") {
            this.previousOperandTextElement.innerText = "Operation history";
        }
    }

}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalButton = document.querySelector('[data-equal]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector(".previous-operand");
const currentOperandInputField = document.querySelector('.current-operand');
const previousIcon = document.querySelector('[data-previous-icon]');
const nextIcon = document.querySelector('[data-next-icon]');
const deleteHistoryBtn = document.querySelector(".delete-history button");
const calculator = new Calculator(previousOperandTextElement, currentOperandInputField);

previousOperandTextElement.addEventListener("animationend", () => {
    previousOperandTextElement.classList.remove("right-to-left", "left-to-right");
});


numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});
operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});
equalButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});
deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
});
previousIcon.addEventListener("click", (e) => {
    calculator.operationData(e);
});
nextIcon.addEventListener("click", (e) => {
    calculator.operationData(e);
});
deleteHistoryBtn.addEventListener("click", () => {
    calculator.deleteHistory();
});
window.addEventListener("DOMContentLoaded", () => {
    calculator.operationArr = calculator.getDataFromSession() || [];
    calculator.arrLength = calculator.operationArr.length - 1;
    calculator.previousIndex = calculator.arrLength;
});
document.addEventListener("keydown", (e) => {
    shortcutsAction(e);
});
function shortcutsAction(e) {
    if (e.key == "ArrowLeft") calculator.operationData({
        target: previousIcon
    });
    if (e.key == "ArrowRight") calculator.operationData({
        target: nextIcon
    });
    if(e.key == "d"){
        calculator.delete();
        calculator.updateDisplay();
    }

}