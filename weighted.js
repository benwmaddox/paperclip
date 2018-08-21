"use strict";
var WeightedNamespace;
(function (WeightedNamespace) {
    var Phase1State = /** @class */ (function () {
        function Phase1State() {
            this.unsoldClips = getNumber('unsoldClips');
            this.totalClips = getNumber('clips');
        }
        return Phase1State;
    }());
    var Phase2State = /** @class */ (function () {
        function Phase2State() {
            this.memory = getNumber('memory');
        }
        return Phase2State;
    }());
    var Phase3State = /** @class */ (function () {
        function Phase3State() {
            this.increaseProbeTrustAvailable = elementExists('btnIncreaseProbeTrust') && buttonEnabled('btnIncreaseProbeTrust');
            this.processors = getNumber('processors');
        }
        return Phase3State;
    }());
    var Phase1Action = /** @class */ (function () {
        function Phase1Action() {
        }
        return Phase1Action;
    }());
    var Phase2Action = /** @class */ (function () {
        function Phase2Action() {
        }
        return Phase2Action;
    }());
    var Phase3Action = /** @class */ (function () {
        function Phase3Action() {
        }
        Phase3Action.prototype.increaseProbeTrust = function () {
            clickButton('btnIncreaseProbeTrust');
        };
        return Phase3Action;
    }());
    var CurrentState = /** @class */ (function () {
        function CurrentState() {
            this.now = new Date().getTime();
            this.phase1 = new Phase1State();
            this.phase2 = new Phase2State();
            this.phase3 = new Phase3State();
            this.phase1Action = new Phase1Action();
            this.phase2Action = new Phase2Action();
            this.phase3Action = new Phase3Action();
            // Shared    
            this.creativity = getNumber('creativity');
            if (elementExists('probeDesignDiv')) {
                this.number = 3;
            }
            else if (elementExists('powerConsumptionRate')) {
                this.number = 2;
            }
            else if (elementExists('btnMakePaperclip')) {
                this.number = 1;
            }
            else {
                throw 'Can\'t find state';
            }
        }
        return CurrentState;
    }());
    var state = new CurrentState();
    // var getCurrentState : CurrentState = function(){
    //     var state = new CurrentState();
    //     return state;
    // };
    var positionIndicator = function (target) {
        var element = document.getElementById('selectedIndicatorBorder');
        if (element === null) {
            var item = document.createElement('div');
            item.id = "selectedIndicatorBorder";
            item.style.border = "3px red dashed";
            item.style.position = "absolute";
            document.body.appendChild(item);
            element = item;
        }
        element.style.left = (target.offsetLeft - 2).toString() + "px";
        element.style.top = (target.offsetTop - 2).toString() + "px";
        element.style.width = (target.offsetWidth).toString() + "px";
        element.style.height = (target.offsetHeight).toString() + "px";
        element.style.opacity = "1.0";
    };
    var fadePositionIndicator = function () {
        var element = document.getElementById('selectedIndicatorBorder');
        if (element !== null) {
            var opacity = Number(element.style.opacity);
            if (opacity > 0) {
                opacity -= 0.01;
                element.style.opacity = opacity.toString();
            }
            else {
                element.style.left = "-10px";
                element.style.top = "-10px";
                element.style.width = "0px";
                element.style.height = "0px";
            }
        }
    };
    setInterval(fadePositionIndicator, 15);
    function getById(elementId) {
        return document.getElementById(elementId);
    }
    function clickButton(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            positionIndicator(element);
            element.click();
        }
    }
    function getNumber(elementId) {
        var element = document.getElementById(elementId);
        if (!element) {
            return 0;
        }
        return Number(element.innerText.replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', ''));
    }
    function cleanNumber(numberString) {
        return Number(numberString.replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace('$', ''));
    }
    function elementExists(elementId) {
        var element = document.getElementById(elementId);
        return element != null && element.offsetParent !== null;
    }
    function buttonEnabled(elementId) {
        var element = document.getElementById(elementId);
        if (element == null) {
            return false;
        }
        return element.attributes.getNamedItem("disabled") == undefined || element.attributes.getNamedItem("disabled") == null;
    }
    var projectPriority;
    (function (projectPriority) {
        projectPriority[projectPriority["Highest"] = 0] = "Highest";
        projectPriority[projectPriority["High"] = 1] = "High";
        projectPriority[projectPriority["Medium"] = 2] = "Medium";
        projectPriority[projectPriority["Low"] = 3] = "Low";
        projectPriority[projectPriority["Lowest"] = 4] = "Lowest";
    })(projectPriority || (projectPriority = {}));
    var projectList = [];
    var initialClipLastRun = new Date().getTime() - 11000;
    var actions = [];
    actions.push({ id: "btnMakePaperclip", value: "click", increase: ["clips"], decrease: ["wire"] });
    actions.push({ id: "btnBuyWire", value: "click", increase: ["wire"], decrease: ["funds"] });
    actions.push({ id: "btnExpandMarketing", value: "click", increase: ["avgRev"], decrease: ["funds", "secValue"] });
    actions.push({ id: "btnMakeClipper", value: "click", increase: ["unsoldClips"], decrease: ["funds", "wire"] });
    actions.push({ id: "btnLowerPrice", value: "click", increase: ["avgRev"], decrease: [] });
    actions.push({ id: "btnRaisePrice", value: "click", increase: ["unsoldClips"], decrease: [] });
    actions.push({ id: "btnAddProc", value: "click", increase: ["creativity", "processors"], decrease: ["trust"] });
    actions.push({ id: "btnAddMem", value: "click", increase: ["operations", "memory"], decrease: ["trust"] });
    actions.push({ id: "btnQcompute", value: "click", increase: ["qChip"], decrease: [] });
    actions.push({ id: "btnNewTournament", value: "click", increase: ["yomiDisplay"], decrease: ["operations"] });
    actions.push({ id: "btnRunTournament", value: "click", increase: ["yomiDisplay"], decrease: [] });
    actions.push({ id: "stratPicker", value: function () { return document.getElementById('stratPicker').length - 1; }, increase: ["yomiDisplay"], decrease: ["operations"] });
    actions.push({ id: "btnMakeMegaClipper", value: "click", increase: ["unsoldClips", "clips"], decrease: ["funds"] });
    actions.push({ id: "btnImproveInvestments", value: "click", increase: ["secValue"], decrease: ["yomiDisplay"] });
    actions.push({ id: "btnInvest", value: "click", increase: ["secValue"], decrease: ["funds"] });
    actions.push({ id: "btnWithdraw", value: "click", increase: ["funds"], decrease: ["secValue"] });
    actions.push({ id: "investStrat", value: function () {
            if (getNumber('investmentLevel') <= 2) {
                return 0;
            }
            else if (getNumber('investmentLevel') <= 4) {
                return 1;
            }
            else
                return 2;
        }, increase: ["secValue"], decrease: ["funds"] });
    // actions.push({id: "", value: "click", increase: ["trust"], decrease: ["unsoldClips"] });
    var goals = [];
    var weightedGoals = {};
    var applyGoal = function (goal, weight) {
        if (weight == 0)
            return;
        if (weightedGoals[goal] === undefined) {
            weightedGoals[goal] = 0;
        }
        weightedGoals[goal] = weightedGoals[goal] += weight;
        // console.log('Applied Goal ' + goal);
    };
    function reduceWeighting(goal, multipleToReduce) {
        weightedGoals[goal] = Math.floor(weightedGoals[goal] * (1 - multipleToReduce));
    }
    goals.push({ target: "clips", weight: function () { return getNumber("clips") < 3000 ? 10 : 0; } });
    goals.push({ target: "unsoldClips", weight: function () { return getNumber("unsoldClips") < 1000 && getNumber("wire") < 1000 && getNumber('clipmakerRate') > 5 ? 10 : 0; } });
    goals.push({ target: "unsoldClips", weight: function () { return getNumber("unsoldClips") < 3000 ? 1 : 0; } });
    goals.push({ target: "unsoldClips", weight: function () { return getNumber("unsoldClips") < getNumber("clipmakerRate") * 5 ? 100 : 0; } });
    goals.push({ target: "wire", weight: function () { return getNumber("wire") < 2000 && getNumber('clipmakerRate') > 5 && !elementExists('btnToggleWireBuyer') ? 10 : 0; } });
    goals.push({ target: "wire", weight: function () { return getNumber("wire") === 0 ? 100 : 0; } });
    goals.push({ target: "processors", weight: function () { return getNumber("creativity") <= 100 && getNumber('memory') > 1 ? 1 : 0; } });
    goals.push({ target: "clips", weight: function () { return getNumber('wire') > 500 ? 10 : 0; } });
    goals.push({ target: "clips", weight: function () { return getNumber('clips') < 3000 && getNumber('wire') > 1000 ? 100 : 0; } });
    goals.push({ target: "avgRev", weight: function () { return 1; } });
    goals.push({ target: "avgRev", weight: function () { return getNumber('clips') < 1000 && getNumber("unsoldClips") > 1000 ? 10 : 0; } });
    goals.push({ target: "avgRev", weight: function () { return getNumber('funds') < 1000 && getNumber("unsoldClips") > 1000 ? 10 : 0; } });
    goals.push({ target: "yomiDisplay", weight: function () { return elementExists('yomiDisplay') && getNumber('operations') * 2 >= getNumber("maxOps") ? 10 : 0; } });
    goals.push({ target: "secValue", weight: function () { return elementExists('investmentEngine') ? 1 : 0; } });
    goals.push({ target: "qChip", weight: function () {
            return sum(document.getElementsByClassName('qChip'), function (element) { return Number(element.style.opacity); }) > 0.2 && getNumber('operations') < getNumber('maxOps') ? 100 : 0;
        } });
    function sum(list, selectionMethod) {
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            total += selectionMethod(list.item(i));
        }
        return total;
    }
    var getProjectsThatCouldBeRun = function () {
        var enabledButtons = [];
        var disabledButtons = [];
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (elementExists(projectButtons[i].id) && buttonEnabled(projectButtons[i].id)) {
                enabledButtons.push(projectButtons[i].id);
            }
            else if (elementExists(projectButtons[i].id)) {
                disabledButtons.push(projectButtons[i].id);
            }
            var textContent = projectButtons[i].childNodes[0].textContent || "";
        }
        return {
            enabled: enabledButtons,
            disabled: disabledButtons
        };
    };
    WeightedNamespace.automationTimeout = 300; // Math.random() > 0.99 ? 15000 : 1000;
    WeightedNamespace.automation = function () {
        for (var i = 0; i < goals.length; i++) {
            var weight = goals[i].weight();
            if (weight > 0) {
                applyGoal(goals[i].target, weight);
            }
        }
        var goal = getRandomWeightedGoal();
        if (goal != null) {
            var action = findMatchingAction(goal);
            applyAction(goal, action);
        }
        projectRunning();
        addGoalsForNeededProjects();
        // runNextProject();        
        console.log(weightedGoals);
        setTimeout(WeightedNamespace.automation, WeightedNamespace.automationTimeout);
    };
    function projectRunning() {
        var projects = getProjectsThatCouldBeRun();
        if (projects.enabled.length > 0) {
            clickButton(projects.enabled[0]);
        }
    }
    // lookup projects and take needed items, compare to what is already there and add appropriately
    function addGoalsForNeededProjects() {
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            var costText = projectButtons[i].childNodes[1].data;
            costText = costText.replace(')', '').replace('(', '');
            var costs = costText.split(', ');
            for (var j = 0; j < costs.length; j++) {
                var costSplit = costs[j].split(" ");
                var number = cleanNumber(costSplit[0]);
                var type = costSplit.length > 0 ? costSplit[1] : "";
                if (costSplit[0].indexOf("$") > -1 && number > getNumber('funds')) {
                    applyGoal("funds", 1);
                    applyGoal("secValue", 10);
                }
                if (type == "ops" && number > getNumber('maxOps')) {
                    applyGoal("operations", 1);
                }
                if (type == "creat") {
                    applyGoal("creativity", 1);
                }
            }
        }
    }
    function getRandomWeightedGoal() {
        var totalWeights = 0;
        for (var key in weightedGoals) {
            totalWeights += weightedGoals[key];
        }
        if (totalWeights <= 10) {
            return null;
        }
        var randomGoal = Math.random() * totalWeights;
        var cumulativeSum = 0;
        for (var key in weightedGoals) {
            cumulativeSum += weightedGoals[key];
            if (randomGoal <= cumulativeSum) {
                return key;
            }
        }
        return null;
    }
    function findMatchingAction(target) {
        var matchingActions = [];
        for (var i = 0; i < actions.length; i++) {
            var increase = actions[i].increase;
            if (increase == null)
                continue;
            if (!elementExists(actions[i].id))
                continue;
            for (var j = 0; j < increase.length; j++) {
                if (increase[j] == target) {
                    // if (actions[i].value == "click" && !buttonEnabled(actions[i].id)){
                    //     continue;
                    // }            
                    // else if (document.getElementById(actions[i].id) != null ){
                    //     var element = document.getElementById(actions[i].id);
                    //     if (element != null 
                    //         && element.tagName == "SELECT" 
                    //         && getNumberFromValue(actions[i]) === (<HTMLSelectElement>element).selectedIndex ){
                    //         continue;
                    //     }
                    // }    
                    matchingActions.push(actions[i]);
                }
            }
        }
        return matchingActions[Math.floor(Math.random() * matchingActions.length)];
    }
    function getNumberFromValue(action) {
        return typeof action.value === "function" ? action.value() : action.value;
    }
    WeightedNamespace.reserveCosts = {};
    function setReserveCost(id, item) {
        var reservation = WeightedNamespace.reserveCosts[item] || {
            item: item,
            id: id,
            ticks: 25
        };
        WeightedNamespace.reserveCosts[item] = reservation;
    }
    function isCostReserved(id, items) {
        if (items == null) {
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            var reservation = WeightedNamespace.reserveCosts[items[i]];
            return reservation && reservation.id != id && reservation.ticks > 0;
        }
        return false;
    }
    function reduceReserveCost(items) {
        if (items == null) {
            return;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var reservation = WeightedNamespace.reserveCosts[item];
            if (reservation == undefined) {
                continue;
            }
            if (reservation.ticks > 0) {
                reservation.ticks--;
            }
            if (reservation.ticks <= 0) {
                delete WeightedNamespace.reserveCosts[item];
            }
            else {
                WeightedNamespace.reserveCosts[item] = reservation;
            }
        }
    }
    function applyAction(goalTarget, action) {
        if (action == null) {
            reduceWeighting(goalTarget, 0.1);
            console.log(goalTarget + " goal was given with no action");
        }
        else if (action.value == "click") {
            if (buttonEnabled(action.id)) {
                if (isCostReserved(action.id, action.decrease)) {
                    reduceReserveCost(action.decrease);
                    console.log(goalTarget + " with " + action.id + " had reservation blocking it.");
                }
                else {
                    clickButton(action.id);
                    reduceWeighting(goalTarget, 0.5);
                    console.log('Clicked ' + action.id);
                }
            }
            else if (action.decrease != null) {
                if (isCostReserved(action.id, action.decrease)) {
                    reduceReserveCost(action.decrease);
                    return;
                }
                for (var i = 0; i < action.decrease.length; i++) {
                    applyGoal(action.decrease[i], 1);
                    setReserveCost(action.id, action.decrease[i]);
                    console.log(goalTarget + " with " + action.id + " was not enabled.");
                }
            }
        }
        else if (typeof action.value === "function") {
            var number = action.value();
            var target = document.getElementById(action.id);
            if (target == null) {
                console.log('Target not found');
                return;
            }
            if (target.tagName === "SELECT") {
                console.log('Changed index of ' + action.id + ' to ' + number);
                target.selectedIndex = number;
                reduceWeighting(goalTarget, 0.5);
            }
            else {
                // debugger;
                console.log('Not sure what this is');
                console.log(target);
            }
        }
        else {
            console.log('not ready');
        }
    }
    var runNextProject = function () {
        state = new CurrentState();
        var enumsToLoop = [projectPriority.Highest, projectPriority.High, projectPriority.Medium, projectPriority.Low, projectPriority.Lowest];
        for (var i = 0; i < enumsToLoop.length; i++) {
            var canRunInPriorityLevel = [];
            for (var j = 0; j < projectList.length; j++) {
                if (projectList[j].priority == enumsToLoop[i] &&
                    projectList[j].canRun()) {
                    canRunInPriorityLevel.push(projectList[j]);
                }
            }
            if (canRunInPriorityLevel.length > 0) {
                var selectedProject = canRunInPriorityLevel[Math.floor(Math.random() * canRunInPriorityLevel.length)];
                selectedProject.run();
                console.log((new Date()).toLocaleString() + " (" + canRunInPriorityLevel.length + ")  " + selectedProject.name);
                return;
            }
        }
    };
})(WeightedNamespace || (WeightedNamespace = {}));
setTimeout(WeightedNamespace.automation, WeightedNamespace.automationTimeout);
