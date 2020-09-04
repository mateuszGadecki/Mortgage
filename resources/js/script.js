/*----------------------------------------Calculator Controller----------------------------------------*/
var calculatorController = (function() {
    var credit_history, parameters_contr_inPerc, parameters_contr_inPln, data;

    credit_history = function(flatValue, percentage, period, contribution) {
        this.flatValue = flatValue;
        this.percentage = percentage;
        this.period = period;
        this.contribution = contribution;
    };
    parameters_contr_inPerc = function(flatValue, percentage, period, contribution, type) {
        this.flatValue = flatValue;
        this.percentage = percentage;
        this.period = period;
        this.contribution = contribution;
        this.type = type;
    };
    parameters_contr_inPln = function(flatValue, percentage, period, contribution, type) {
        this.flatValue = flatValue;
        this.percentage = percentage;
        this.period = period;
        this.contribution = contribution;
        this.type = type;
    };

    data = {
        items: {
            perc: [],
            pln: []
        },
        elements: [],
        calculated: [],
        history: []
    };

    return {
        addItem: function(flatVal, perc, per, contr, type) {
            var newPosition;
            // Create new item based on pln or percentage
            if(type === 'perc') {
                newPosition = new parameters_contr_inPerc(flatVal, perc, per, contr, type)
            } else if (type = 'pln') {
                newPosition = new parameters_contr_inPln(flatVal, perc, per, contr, type)
            }
            // Push into data
            data.items[type].push(newPosition);

            return newPosition;
        },

        addToHistory: function(flatVal, perc, per, contr) {
            var historyPosition;
            // Create new history item
            historyPosition = new credit_history(flatVal, perc, per, contr);
            // Push into data
            data.history.push(historyPosition);

            return historyPosition;
        },

        mapElements: function(type) {
            var elements = [];
            data.items[type].map(function(cur) {
                elements.push(cur)
            })
            elements = Object.values(elements[0]);
            data.elements.push(elements);
        },

        calculateParameters: function(type) {
            var monthly, capital, interest, amountInstallment, amountFlats, q, parameters;
            // Factor
            q = 1 + (data.elements[0][1] / 12);
            // Credit value - Contribution
            if (type === 'pln') {
                x = data.elements[0][0] - data.elements[0][3];
            } else if (type === 'perc') {
                x = data.elements[0][0] - ((data.elements[0][3] / 100) * data.elements[0][0]);
            };
            // 1. Calculate capital
            capital = x / (data.elements[0][2] * 12);
            // 2. Calculate interest
            interest = x * (data.elements[0][1] / 100) * 30 / 365;
            // 3. Calculate amount of intallments
            amountInstallment = (data.elements[0][2] * 12);
            // 4. Calculate amounts of flats
            amountFlats = Math.round(70000000/data.elements[0][0]);
            // 5. Calculate Monthly installment
            monthly = capital + interest;

            parameters = {
                month: monthly,
                cap: capital,
                inter: interest,
                amountInstall: amountInstallment,
                amountFl: amountFlats
            }

            data.calculated.push(parameters);
        },

        clearData: function() {
            data.items.perc = [];
            data.items.pln = [];
            data.elements = [];
            data.calculated = [];
        },

        testing: function() {
            console.log(data);
        }
    }

})();

/*----------------------------------------User Interface Controller----------------------------------------*/
var UIController = (function() {

    var DOMstrings = {
        calcButton: '.submit_btn',
        resetButton: '.reset_btn',
        flatValue: '.flat_value',
        creditPercentage: '.credit_percentage',
        creditPeriod: '.credit_period',
        creditContribution: '.credit_contribution',
        typeContribution: '.type_contribution'

    };


    return {
        getInput: function() {
            return {
                price: parseFloat(document.querySelector(DOMstrings.flatValue).value),
                percentage: parseFloat(document.querySelector(DOMstrings.creditPercentage).value),
                period: parseFloat(document.querySelector(DOMstrings.creditPeriod).value),
                contribution: parseFloat(document.querySelector(DOMstrings.creditContribution).value),
                type: document.querySelector(DOMstrings.typeContribution).value
            }
        },

        clear: function() {
            var inputFields, convertToArr;
            // 1. Clear the fields
            inputFields =document.querySelectorAll(DOMstrings.flatValue + ', ' + DOMstrings.creditPercentage + ', ' + DOMstrings.creditPeriod + ', ' + DOMstrings.creditContribution);
            convertToArr = Array.prototype.slice.call(inputFields);
            convertToArr.forEach(function(current, index, array) {
                current.value = "";
            })
        },

        getDomStrings : function() {
            return DOMstrings;
        },
    }

})();

/*----------------------------------------App Controller----------------------------------------*/
var controller = (function(calcCtrl, UICtrl) {

    var DOM = UICtrl.getDomStrings();

	var setupEventListeners = function() {
        document.querySelector(DOM.calcButton).addEventListener('click', calcItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) { ctrlAddItem(); }
        });
        document.querySelector(DOM.resetButton).addEventListener('click', resetItem)
	};

    var calcItem = function() {
        var input, newItem, newHistory, calculated;
        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the items to the calculator controller (items based on % and pln + history)
        newItem = calcCtrl.addItem(input.price, input.percentage, input.period, input.contribution, input.type);
        newHistory = calcCtrl.addToHistory(input.price, input.percentage, input.period, input.contribution);

        // 3. Map the elements of object in array
        mapedElements = calcCtrl.mapElements(input.type);
        // 3. Calculate the credit parameters
        calculated = calcCtrl.calculateParameters(input.type);

        // 4. Add the item to the UI controller

        // 5. Calculate and display results and history sections

        // 6. Adding credit parameters to the history
    };

    var resetItem = function() {
        // 1. Clear the fields
        UICtrl.clear();
        // 2. Clear arrays
        calcCtrl.clearData();
    };

    return {
        init: function() {
            setupEventListeners();
            console.log('aplikacja działa');
        }
    }

})(calculatorController, UIController);

controller.init();