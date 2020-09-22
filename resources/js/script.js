/*----------------------------------------Calculator Controller----------------------------------------*/
var calculatorController = (function() {
    var parameters_contr_inPerc, parameters_contr_inPln, data;

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

            // Adding calculated values to history
            var position;
            if(data.history.length > 0) {
                position = data.history.length + 1;
            } else { position = 1; }

            historyValue = {
                id: position,
                monthly: monthly,
                value: data.elements[0][0],
                percentage: data.elements[0][1]
            }

            // Push into data
            data.history.push(historyValue);

            return parameters;
        },

        clearData: function() {
            data.items.perc = [];
            data.items.pln = [];
            data.elements = [];
            data.calculated = [];
        },

        historyList: function() {
            var historyData = [];
            if(data.history.length > 0) {
                historyData.push(data.history);
            }
            console.log(historyData);
            return historyData;
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
        typeContribution: '.type_contribution',
        displayResults: '.results_container',
        historyContainer: '.history-container'

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

        displayResults: function(par) {
            var resultHtml, newHtml, mapObj;

            resultHtml = '<div class="heading">Miesięczna rata wynosi: </div><div class="monthly">x_1</div><div class="heading">Kapitał: </div><div class="capital">x_2</div><div class="heading">Odsetki:</div><div class="interest">x_3</div><div class="heading">Ilość rat: </div><div class="amount">x_4</div><div class="heading">Ilość takich mieszkań jaką można by kupić za pieniądze,</br> które zmarnował Sasin na druk nielegalnych kart wyborczych:</div><div class="flats">x_5</div>'

            mapObj = {
                x_1: par.month.toFixed(2) + ' pln',
                x_2: par.cap.toFixed(2) + ' pln',
                x_3: par.inter.toFixed(2) + ' pln',
                x_4: par.amountInstall,
                x_5: par.amountFl
            };

            newHtml = resultHtml.replace(/x_1|x_2|x_3|x_4|x_5/gi, function(matched) {
                return mapObj[matched];
            })

            // Insert the html into the DOM
            document.querySelector(DOMstrings.displayResults).innerHTML = newHtml;
        },

        displayHistory: function(his) {
            var historyHtml, newHtml, mapObj;

            historyHtml = '<div class="item" id="number-0"><div class="number"><strong>x_1.</strong></div><div class="history_value">x_2</div><div class="history_installment">x_3</div><div class="history_percentage">x_4</div></div>'

            mapObj = {
                x_1: his[0][his[0].length-1].id,
                x_2: his[0][his[0].length-1].value + ' pln',
                x_3: his[0][his[0].length-1].monthly.toFixed(2) + ' pln',
                x_4: his[0][his[0].length-1].percentage.toFixed(2) + ' %'
            };

            if(his[0].length <= 15) {
                newHtml = historyHtml.replace(/x_1|x_2|x_3|x_4/gi, function(matched) {
                    return mapObj[matched];
                })

                document.querySelector(DOMstrings.historyContainer).insertAdjacentHTML('beforeend', newHtml);
            }
        },

        showContainer: function() {
            document.querySelector(DOMstrings.displayResults).style.display = 'block';
        },

        hideContainer: function() {
            document.querySelector(DOMstrings.displayResults).style.display = 'none';
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
            if(event.keyCode === 13 || event.which === 13) { calcItem(); }
        });
        document.querySelector(DOM.resetButton).addEventListener('click', resetItem)
	};

    var calcItem = function() {
        var input, newItem, calculated, x;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the items to the calculator controller (items based on % and pln)
        // Validation
        var a, b, c, d, e, error;
        a = document.querySelector('.flat_value').value;
        b = document.querySelector('.credit_percentage').value;
        c = document.querySelector('.credit_period').value;
        d = document.querySelector('.credit_contribution').value;
        e = document.querySelector('.type_contribution').value;
        error = document.getElementById("error");

        if(isNaN(a) || a < 1){
            error.textContent = "Błędnie wypełniony formularz!";
        } else {
            if(isNaN(b) || b < 1 || b > 100) {
                error.textContent = "Błędnie wypełniony formularz!";
            } else {
                if(isNaN(c) || c < 1) {
                    error.textContent = "Błędnie wypełniony formularz!";
                } else{
                    if(e === 'pln') {
                        if(isNaN(d) || d < 1) {
                            error.textContent = "Błędnie wypełniony formularz!";
                        } else {
                            document.querySelector(DOM.calcButton).href = "#section3";
                            error.textContent = "";
                            newItem = calcCtrl.addItem(input.price, input.percentage, input.period, input.contribution, input.type);
                        }
                    } else if(e === 'perc') {
                        if(isNaN(d) || d < 1 || d > 100) {
                            error.textContent = "Błędnie wypełniony formularz!";
                        } else {
                            document.querySelector(DOM.calcButton).href = "#section3";
                            error.textContent = "";
                            newItem = calcCtrl.addItem(input.price, input.percentage, input.period, input.contribution, input.type);
                        }
                    }
                }
            }
        };

        // 3. Map the elements of object in array
        mapedElements = calcCtrl.mapElements(input.type);
        // 3. Calculate the credit parameters and adding results to history
        calculated = calcCtrl.calculateParameters(input.type);

        // 4. Display results
        UICtrl.displayResults(calculated);

        // 5. Show the item in the UI controller
        UICtrl.showContainer();
        // 6. Calculate and display results and history sections
        x = calcCtrl.historyList();
        UICtrl.displayHistory(x);
        // 7. Adding credit parameters to the history
    };

    var resetItem = function() {
        // 1. Clear the fields
        UICtrl.clear();
        // 2. Clear arrays
        calcCtrl.clearData();
        // 3. Hide item from the UI controller
        UICtrl.hideContainer();
    };

    return {
        init: function() {
            setupEventListeners();
            console.log('aplikacja działa');
        }

    }

})(calculatorController, UIController);

controller.init();