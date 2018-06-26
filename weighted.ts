namespace WeightedNamespace { 
    class Phase1State {
        public unsoldClips : number = getNumber('unsoldClips');    
        public totalClips : number = getNumber('clips');    
    }

    class Phase2State{
        public memory : number = getNumber('memory');
    }

    class Phase3State {
        public increaseProbeTrustAvailable : boolean = elementExists('btnIncreaseProbeTrust') && buttonEnabled('btnIncreaseProbeTrust');
        public processors : number = getNumber('processors');
    }

    class Phase1Action {

    }

    class Phase2Action {

    }

    class Phase3Action{
        public increaseProbeTrust() {
            clickButton('btnIncreaseProbeTrust');
        }
    }

    class CurrentState {
        constructor() {        
            if (elementExists('probeDesignDiv')){
                this.number = 3;
            }
            else if (elementExists('powerConsumptionRate')){
                this.number = 2;
            }
            else if (elementExists('btnMakePaperclip')){
                this.number = 1;
            }
            else{
                throw 'Can\'t find state';
            }
            
        }
        public number : 1 | 2 | 3;
        public now : number = new Date().getTime();      
        public phase1 : Phase1State = new Phase1State();
        public phase2 : Phase2State = new Phase2State();
        public phase3 : Phase3State = new Phase3State();
        public phase1Action : Phase1Action = new Phase1Action();
        public phase2Action : Phase2Action = new Phase2Action();
        public phase3Action : Phase3Action = new Phase3Action();

        // Shared    
        public creativity : number = getNumber('creativity');  
    }
    var state = new CurrentState();

    // var getCurrentState : CurrentState = function(){
    //     var state = new CurrentState();

    //     return state;
    // };

    var positionIndicator = function(target : HTMLElement){
        var element = <HTMLDivElement>document.getElementById('selectedIndicatorBorder');
        if (element === null){
            var item = document.createElement('div');        
            item.id = "selectedIndicatorBorder";
            item.style.border = "3px red dashed";
            item.style.position = "absolute";
            document.body.appendChild(item);
            element = item;
        }
        element.style.left = (target.offsetLeft-2).toString() + "px";
        element.style.top = (target.offsetTop-2).toString() + "px";
        element.style.width = (target.offsetWidth).toString() + "px";
        element.style.height = (target.offsetHeight).toString() + "px";
        element.style.opacity = "1.0";    
    }

    var fadePositionIndicator= function(){
        var element = <HTMLDivElement>document.getElementById('selectedIndicatorBorder');
        if (element !== null){
            var opacity = Number(element.style.opacity);
            if (opacity > 0){
                opacity -= 0.01;
                element.style.opacity = opacity.toString();
            }
            else{            
                element.style.left = "-10px";
                element.style.top = "-10px";
                element.style.width = "0px";
                element.style.height = "0px";
            }
        }
    }
    setInterval(fadePositionIndicator, 15);
    function getById(elementId : string): HTMLElement | null{
        return document.getElementById(elementId);
    }
    function clickButton(elementId: string){    
        var element = document.getElementById(elementId);
        if (element){
            positionIndicator(element);
            element.click();
        }            
    }
    function getNumber(elementId : (Resource|Velocity)){
        var element = document.getElementById(elementId);
        if (!element){
            return 0;
        }
        return Number( element.innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''))
    }
    function cleanNumber(numberString : string){
        return Number( numberString.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''))
    }
    function elementExists(elementId : string) {
        var element = document.getElementById(elementId) ;
        return element != null && element.offsetParent !== null;
    }
    function buttonEnabled(elementId : string){
        var element = document.getElementById(elementId);
        if (element == null){
            
            return false;
        }
        return element.attributes.getNamedItem("disabled") == undefined || element.attributes.getNamedItem("disabled") == null
    }
    enum projectPriority {
        Highest,
        High,
        Medium,
        Low,
        Lowest
    }
    interface IProject {
        name: string,
        canRun: () => boolean,
        run: () => void,
        priority: projectPriority
    }
    var projectList : IProject[]= [];
    var initialClipLastRun : number = new Date().getTime() - 11000;


    type Resource = "clips" 
                    | "unsoldClips"
                    | "wire"
                    | "funds"
                    | "marketingLvl"
                    | "operations"
                    | "processors"
                    | "memory"
                    | "creativity"
                    | "trust"
                    | "maxOps"
                    | "yomiDisplay"
                    | "secValue" // Stocks
                    | "investmentLevel"
                    ;

    type Velocity = "avgRev"
                    | "clipmakerRate"
                    | "qChip"
                    ;

    type ResourceOrVelocity = Resource | Velocity;

    interface Action {
        id: string;
        value: "click" | number | (() => number),
        increase?: (Resource|Velocity)[];
        decrease?: (Resource|Velocity)[];
    }
    
    interface Goal {
        target: (Resource|Velocity);
        weight: () => 0|1|10|100;
        currentWeight?: number;
    }
    


    var actions : Action[] = [];
    actions.push({id: "btnMakePaperclip", value: "click", increase: ["clips"], decrease: ["wire"]})
    actions.push({id: "btnBuyWire", value: "click", increase: ["wire"], decrease: ["funds"]})
    actions.push({id: "btnExpandMarketing", value: "click", increase: ["avgRev"], decrease: ["funds", "secValue"]})
    actions.push({id: "btnMakeClipper", value: "click", increase: ["unsoldClips", "clips"], decrease: ["funds"]})
    actions.push({id: "btnLowerPrice", value: "click", increase: ["funds", "avgRev"], decrease: ["unsoldClips"]})    
    actions.push({id: "btnRaisePrice", value: "click", increase: ["unsoldClips"], decrease: ["funds", "avgRev"]})
    actions.push({id: "btnAddProc", value: "click", increase: ["creativity", "processors"], decrease: ["trust"]})    
    actions.push({id: "btnAddMem", value: "click", increase: ["operations", "memory"], decrease: ["trust"]})
    actions.push({id: "btnQcompute", value: "click", increase: ["qChip"], decrease: []})    
    actions.push({id: "btnNewTournament", value: "click", increase: ["yomiDisplay"], decrease: ["operations"]})    
    actions.push({id: "stratPicker", value: () => { return (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex - 1}, increase: ["yomiDisplay"], decrease: ["operations"] });
    actions.push({id: "btnRunTournament", value: "click", increase: ["yomiDisplay"], decrease: []})    
    actions.push({id: "stratPicker", value: () => (<HTMLSelectElement>document.getElementById('stratPicker')).length -1, increase: ["yomiDisplay"], decrease: ["operations"]})
    actions.push({id: "btnMakeMegaClipper", value: "click", increase: ["unsoldClips", "clips"], decrease: ["funds"] });
    actions.push({id: "btnImproveInvestments", value: "click", increase: ["secValue"], decrease: ["yomiDisplay"] });
    actions.push({id: "btnInvest", value: "click", increase: ["secValue"], decrease: ["funds"] });    
    actions.push({id: "investStrat", value: () => {
        if (getNumber('investmentLevel') < 3){
            return 0;
        }
        else if (getNumber('investmentLevel') < 6){
            return 1;
        }
        else return 2;
    }, increase: ["secValue"], decrease: ["funds"] });    
    
    
    var goals : Goal[] = []
    var weightedGoals : { [s:string]: number}= {};

    var applyGoal = function(goal:  (Resource|Velocity), weight: 0|1|10|100){
        if (weight == 0) return;
        if (weightedGoals[goal] === undefined){
            weightedGoals[goal] = 0;
        }
        weightedGoals[goal] = weightedGoals[goal] += weight;
        // console.log('Applied Goal ' + goal);
    }
    function reduceWeighting(goal : Resource|Velocity, multipleToReduce : number){        
        weightedGoals[goal] = Math.floor(weightedGoals[goal] * (1-multipleToReduce));
    }


    goals.push({ target: "clips", weight: function () { return getNumber("clips") < 3000 ? 10 : 0; } });
    goals.push({ target: "unsoldClips", weight: function () { return getNumber("unsoldClips") < 1000 && getNumber("wire") < 1000 ? 10 : 0; } });
    goals.push({ target: "unsoldClips", weight: function () { return getNumber("unsoldClips") < getNumber("clipmakerRate") * 5 ? 100 : 0; } });
    goals.push({ target: "wire", weight: function () { return getNumber("wire") < 1000 && !elementExists('btnToggleWireBuyer') ? 10 : 0; } });
    goals.push({ target: "wire", weight: function () { return getNumber("wire") === 0 ? 100 : 0; } });
    goals.push({ target: "processors", weight: function () { return getNumber("creativity") <= 100 && getNumber('memory') > 1 ? 1 : 0; } });
    goals.push({ target: "clips", weight: function () { return getNumber('wire') > 500 ? 10 : 0; } });
    goals.push({ target: "clips", weight: function () { return getNumber('clips') < 3000 && getNumber('wire') > 1000 ? 100 : 0; } });
    goals.push({ target: "avgRev", weight: function () { return 1 } });
    goals.push({ target: "avgRev", weight: function () { return getNumber('clips') < 1000 && getNumber("unsoldClips") > 100 ? 10 : 0; } });
    goals.push({ target: "avgRev", weight: function () { return getNumber('funds') < 1000 && getNumber("unsoldClips") > 100 ? 10 : 0; } });
    goals.push({target: "yomiDisplay", weight: () => elementExists('yomiDisplay') ? 1 : 0 })
    goals.push({target: "secValue", weight: () => elementExists('investmentEngine') ? 1 : 0 })    
    goals.push({target: "qChip", weight: () => {        
        return sum<Element>(document.getElementsByClassName('qChip'), (element) =>  Number ((<HTMLElement>element).style.opacity)) > 0.2 && getNumber('operations') < getNumber('maxOps') ? 100 : 0;
    }})

    function sum<T extends Element>(list : HTMLCollectionOf<T>, selectionMethod: (e : T) => number){
        var total = 0;
        
        for (var i = 0; i < list.length; i++){ 
            total += selectionMethod(list.item(i));
        }
        return total;
    }
    // TODO: lookup projects and take needed items, compare to what is already there and add appropriately


    var getProjectsThatCouldBeRun = function() : {enabled : string[], disabled: string[]} {

        var enabledButtons : string[] = []
        var disabledButtons : string[]= [];    
        var projectButtons  =  document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++){
            if (elementExists(projectButtons[i].id) && buttonEnabled(projectButtons[i].id)  ){                               
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
    }

    export var automationTimeout = 1000;// Math.random() > 0.99 ? 15000 : 1000;
    export var automation = function () {
        for(var i =0; i< goals.length; i++){
            var weight = goals[i].weight();
            if (weight > 0){
                applyGoal(goals[i].target, weight);
            }
        }

        var goal  = getRandomWeightedGoal();
        if (goal != null){
            var action : Action = findMatchingAction(goal);
            applyAction(goal, action);
        }

        projectRunning();
        addGoalsForNeededProjects();
        // runNextProject();        
        console.log(weightedGoals);
        setTimeout(automation, automationTimeout);
    };    
function projectRunning(){

    var projects = getProjectsThatCouldBeRun();
    if (projects.enabled.length > 0){
        clickButton(projects.enabled[0])
    }

}
function addGoalsForNeededProjects(){    
    var projectButtons = document.getElementsByClassName('projectButton');
    for (var i =0; i < projectButtons.length; i++){
        var costText : string = (<Text> projectButtons[i].childNodes[1]).data;
        costText = costText.replace(')','').replace('(','');
        var costs = costText.split(', ');
        for (var j=0; j < costs.length; j++){
            var costSplit = costs[j].split(" ");
            var number = cleanNumber(costSplit[0]);
            var type = costSplit[1];

            if (type == "ops" && number > getNumber('maxOps') ){
                applyGoal("operations", 1);
            }
            if (type == "creat"){
                applyGoal("creativity", 1);
            }
        }
        
    }
}

function getRandomWeightedGoal() : ResourceOrVelocity | null{

    var totalWeights = 0;    
    for (let key in weightedGoals){
        totalWeights += weightedGoals[key];
    }
    if (totalWeights <= 10){
        return null;
    }
    var randomGoal = Math.random() * totalWeights;
    var cumulativeSum =0;
    for (let key in weightedGoals){

        cumulativeSum += weightedGoals[key];
        if (randomGoal <= cumulativeSum){
            return <ResourceOrVelocity>key;
        }
    }
    return null;

    // TODO: add weighting...

    // return goals[Math.floor(Math.random() * goals.length)];
    // var goal = goals[0]
    // return goal;
}

function findMatchingAction(target : ResourceOrVelocity){
    var matchingActions : Action[] = [];
    for (var i=0; i < actions.length; i++){
        var increase = actions[i].increase;        
        if (increase == null) continue;
        for (var j=0; j< increase.length;j++){
            if (increase[j] == target){
                if (actions[i].value == "click" && !buttonEnabled(actions[i].id)){
                    continue;
                }            
                else if (document.getElementById(actions[i].id).tagName == "SELECT" 
                    && getNumberFromValue(actions[i]) === (<HTMLSelectElement>document.getElementById(actions[i].id)).selectedIndex ){
                    continue;
                }    

                matchingActions.push(actions[i]);
            }
        }
    }

    return matchingActions[Math.floor(Math.random() * matchingActions.length)];
}
function getNumberFromValue(action : Action){
    return typeof action.value === "function" ? action.value() : action.value;
}
function applyAction(goalTarget : ResourceOrVelocity, action : Action){
    if (action == null) {
        reduceWeighting(goalTarget, 0.1);
    }
    else if (action.value == "click"){
        if (buttonEnabled(action.id)) {
            clickButton(action.id);
            reduceWeighting(goalTarget, 1.0);
            console.log('Clicked ' + action.id);
        }
        else if (action.decrease != null){
            for(var i =0;i< action.decrease.length;i++){
                applyGoal(action.decrease[i], 1);
            }            
        }
    }
    else if (typeof action.value === "function"){
        var number = action.value();
        var target = document.getElementById(action.id);
        if (target.tagName === "SELECT"){            
            console.log('Changed index of ' + action.id + ' to ' + number);
            (<HTMLSelectElement>target).selectedIndex = number;
        }
        else{
            // debugger;
            console.log('Not sure what this is');
            console.log(target);
        }
    }
    else {
        console.log('not ready')
    }    
}




    // projectList.push({
    //     name: "Initial clip clicks",
    //     canRun: () => {
            
                    
    //         return state.phase1.totalClips < 3000 && state.phase1.unsoldClips < 500  && buttonEnabled('btnMakePaperclip') && (state.now - initialClipLastRun > 10000) && getNumber('clipmakerLevel2') < 5;
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {
    //         initialClipLastRun = new Date().getTime();
    //         for (var i = 0; i < 250; i++){
    //             setTimeout(() => {                
    //                 clickButton('btnMakePaperclip');
    //             }, 60*i);
    //         }
    //     }
    // })
    // //
    // projectList.push({
    //     name: 'Buy wire when low',
    //     canRun: () => {
    //         var wire = getNumber('wire');
    //         return wire < 1500 && buttonEnabled('btnBuyWire') && !elementExists('btnToggleWireBuyer') && elementExists('btnBuyWire');
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {
    //         clickButton('btnBuyWire');
    //     }
    // })
    // // Marketing
    // projectList.push({
    //     name: 'Marketing upgrade',
    //     canRun: () => {
    //         var wire = getNumber('wire');
    //         var marketingCost = getNumber('adCost');
    //         var funds = getNumber('funds');
    //         return (wire > 1500 || marketingCost * 2 < funds)  && buttonEnabled('btnExpandMarketing') && (getNumber('marketingLvl') < 17 || getNumber('margin') < 0.05);
    //     },
    //     priority: projectPriority.High,
    //     run: () => {
    //         clickButton('btnExpandMarketing');
    //     }
    // })
    // //
    // projectList.push({
    //     name: 'Adjust price lower',
    //     canRun: () => {
    //         var totalClips = getNumber('clips');
    //         var unsoldClips= getNumber('unsoldClips');
    //         var clipMakerRate = getNumber('clipmakerRate');
    //         var averagesale = getNumber('avgSales');
    //         var rateElement = elementExists('clipmakerRate');
    //         return elementExists('avgSales') && rateElement && totalClips > 800 && (clipMakerRate+1) * 30 < unsoldClips && unsoldClips >= 1000 && averagesale - clipMakerRate < 0  && buttonEnabled('btnLowerPrice');
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {
    //         clickButton('btnLowerPrice');
    //     }
    // })
    // // Adjust price higher
    // projectList.push({
    //     name: 'Adjust price higher',
    //     canRun: () => {
    //         var totalClips = getNumber('clips');
    //         var unsoldClips= getNumber('unsoldClips');
    //         var clipMakerRate = getNumber('clipmakerRate');
    //         var rateElement = elementExists('clipmakerRate');
    //         return elementExists('avgSales') && getNumber('avgSales') > 0 && rateElement && (totalClips > 800 && ((clipMakerRate+1) * 10 > unsoldClips && getNumber('avgSales')  - clipMakerRate > 0) || (totalClips > 1800  && unsoldClips < 1000))   && buttonEnabled('btnRaisePrice');
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {
    //         clickButton('btnRaisePrice');
    //     }
    // })

    // projectList.push({
    //     name: 'Wow. We really need to increase prices',
    //     canRun: () => {
    //         return elementExists('unsoldClips') && elementExists('clipmakerRate') && getNumber('unsoldClips') < getNumber('clipmakerRate') && getNumber('wire') > 0 && getNumber('clipmakerRate') > 500;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {
    //         clickButton('btnRaisePrice');
    //         clickButton('btnRaisePrice');
    //         clickButton('btnRaisePrice');
    //         clickButton('btnRaisePrice');
    //         clickButton('btnRaisePrice');
    //     }
    // })


    // var lowerPriceTime : number = new Date().getTime() - 120000;
    // projectList.push({
    //     name: 'Adjust price lower in early game',
    //     canRun: function () {
    //         return getNumber('clips') < 3000 && getNumber('margin') > 0.10;
    //     },
    //     priority: projectPriority.Lowest,
    //     run: function () {
    //         clickButton('btnLowerPrice');
    //     }
    // });

    // projectList.push({
    //     name: 'Adjust price lower',
    //     canRun: function () {
    //         var totalClips = getNumber('clips');
    //         var unsoldClips = getNumber('unsoldClips');
    //         var clipMakerRate = getNumber('clipmakerRate');
    //         var averagesale = getNumber('avgSales');
    //         var rateElement = elementExists('clipmakerRate');
    //         return elementExists('avgSales') && rateElement && totalClips > 800 && (clipMakerRate + 1) * 30 < unsoldClips && unsoldClips >= 1000 && averagesale - clipMakerRate < 0 && buttonEnabled('btnLowerPrice');
    //     },
    //     priority: projectPriority.Low,
    //     run: function () {
    //         clickButton('btnLowerPrice');
    //     }
    // });

    // var marketLoadTest : number = new Date().getTime() - 300000;
    // // Adjust price higher
    // projectList.push({
    //     name: 'Increasing prices to check market load',
    //     canRun: () => {        
    //         return elementExists('btnRaisePrice') && (new Date()).getTime() - marketLoadTest > 300000 && getNumber('clips') > 10000 && getNumber('unsoldClips') < 10 + getNumber('clipmakerRate') * 5;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {
    //         marketLoadTest = new Date().getTime();
    //         for (var i = 0; i < 10; i++){
    //             setTimeout(() => {                
    //                 clickButton('btnRaisePrice');
    //             }, 4100);
    //         }
    //     }
    // })

    // var boostedCreativity : boolean = true;
    // var boostedCreativityTime : number = new Date().getTime() - 570000;
    // projectList.push({
    //     name: 'Force minimum creativity for harder to get projects',
    //     canRun: () => {        
    //         if (state.now - boostedCreativityTime < 600000){
    //             return false;
    //         }
    //         var lowLevelCheck = state.number === 1 && state.phase3.processors >= 5 && boostedCreativity == true && state.creativity < state.phase3.processors * 50 ;
    //         if (lowLevelCheck){
    //             return true;
    //         }
    //         var rushNumber2 = state.number === 2 && boostedCreativity == true && state.phase2.memory > 80 && state.phase2.memory < 120 && productionWorking();
    //         if (rushNumber2){
    //             return true;
    //         }
    //         var rushLater = state.number === 3 && state.phase3.processors >= 150 && getNumber('creativity') < 125000 && boostedCreativity == true;
            
    //         return rushLater;
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {
    //         boostedCreativity = false;
    //         boostedCreativityTime = new Date().getTime();
    //     }
    // });

    // projectList.push({
    //     name: 'Creativity goal took too long. Pausing it.',
    //     canRun: function () {
    //         var slider = document.getElementById('slider');
    //         return boostedCreativity == false && (state.now - boostedCreativityTime > 300000);
    //     },
    //     priority: projectPriority.Highest,
    //     run: function () {
    //         boostedCreativity = true;
    //         boostedCreativityTime = new Date().getTime();
    //     }
    // });

    // projectList.push({
    //     name: 'Creativity Goal started, so move slider to right',
    //     canRun: () => {        
    //         var slider = (<HTMLInputElement>document.getElementById('slider'));
                
    //         return boostedCreativity == false && Number(slider.value) < 195 && elementExists('slider') ;
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {
    //         var slider = (<HTMLInputElement>document.getElementById('slider'));
    //         slider.value  = "195";
    //     }
    // });


    // projectList.push({
    //     name: 'Minimum creativity goal met',
    //     canRun: () => {        
    //         // Force creativity use too
            
    //         var lowLevelMet = boostedCreativity == false && ((getNumber('creativity') > getNumber('processors') * 50) || !elementExists('processors'));
    //         if (state.number === 2 &&  boostedCreativity == false){            
    //             if (state.number === 2 && state.phase2.memory < 120) {
    //                 return false;
    //             }
    //             else{
    //                 return true;
    //             }
    //         }
    //         var rushLaterMet = getNumber('processors') < 150 || getNumber('creativity') > 125000;
    //         return lowLevelMet && rushLaterMet;
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {
    //         boostedCreativity = true;
    //         boostedCreativityTime = new Date().getTime();
    //     }
    // });


    // projectList.push({
    //     name: 'The time is right to cash in investments',
    //     canRun: () => {        
    //         return buttonEnabled('btnWithdraw') && getNumber('trust') > 97 && getNumber('investmentBankroll') > 0;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {
    //         clickButton('btnWithdraw');
    //     }
    // });


    // var isEndGameProject = function(name: string){
    //     return name === "Reject " || name === "Accept ";
    // }
    // // run projects
    // var buttonsThatHoldUpOtherProjects : string[] = [
    //     "projectButton14", // Combinatory Harmonics 
    //     "projectButton15", // The Hadwiger Problem 
    //     "projectButton16", // Hadwiger Clip Diagrams 
    //     "projectButton17", // The Tóth Sausage Conjecture 
    //     "projectButton19", // Donkey Space
    //     "projectButton134", // Glory
    //     "projectButton11", // New Slogan
    //     "projectButton12", // Catchy Jingle
    //     // "projectButton20", //Strategic Modeling
    //     'projectButton51', // Photonic chip    
    //     //"projectButton30", // Global Warming
    //     //"projectButton29", // World Peace
    //     //"projectButton38", // Full Monopoly
    //     "projectButton102", // Self-correcting Supply Chain
    //     "projectButton28", // Cure for Cancer
    //     "projectButton31", // Male Pattern Baldness
    //     "projectButton10b", // Quantum Foam Annealment 
    //     // 'projectButton27' // Coherent Extrapolated Volition
    //     "projectButton34", // Hypno Harmonics
    //     "projectButton50", // Quantum Computing
    //     "projectButton26", // Wirebuyer 
    //     "projectButton126", // Swarm Computing
    //     "projectButton100" // Upgraded Factories
    //     ];
        
    // var removeButtonsThatHoldUpOtherProjects = function(id: string){
    //     buttonsThatHoldUpOtherProjects = buttonsThatHoldUpOtherProjects.filter(x => x !== id);
    // }
    // var getProjectsThatCouldBeRun = function() : {enabled : string[], disabled: string[]} {

    //     var enabledButtons : string[] = []
    //     var disabledButtons : string[]= [];    
    //     var projectButtons  =  document.getElementsByClassName('projectButton');
    //     for (var i = 0; i < projectButtons.length; i++){
    //         if (elementExists(projectButtons[i].id) && buttonEnabled(projectButtons[i].id)  ){                               
    //             enabledButtons.push(projectButtons[i].id);
    //         }
    //         else if (elementExists(projectButtons[i].id)) {                 
    //             disabledButtons.push(projectButtons[i].id);
    //         }
    //         var textContent = projectButtons[i].childNodes[0].textContent || "";
    //         if (isEndGameProject(textContent)){
    //             return {
    //                 enabled: [],
    //                 disabled: []
    //             }
    //         };
    //     }
        
    //     var holdUpEnabledProjects = enabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) !== -1);
    //     var normalEnabled = enabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) === -1);
    //     var holdUpDisabledProjects = disabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) !== -1);
    //     return {
    //             enabled: holdUpEnabledProjects.length == 0 && holdUpDisabledProjects.length == 0 ? enabledButtons : holdUpEnabledProjects,
    //             disabled: disabledButtons
    //         }
    //     }
    // projectList.push({
    //     name: 'Run projects',
    //     canRun: () => {
    //         if (getNumber('processors') > 5 && boostedCreativity == false){
    //             return false;
    //         }
    //         var buttons = getProjectsThatCouldBeRun();
            
    //         return boostedCreativity == true && buttons.enabled.length > 0;
            
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {        
    //         // var projectButtons  =  document.getElementsByClassName('projectButton');
    //         var buttonIds = getProjectsThatCouldBeRun();
            
    //         for (var i = 0; i < buttonIds.enabled.length; i++){
    //             var id = buttonIds.enabled[i];
    //             var element = getById(id);
    //             if (element === null) continue;

    //             var textContent = element.childNodes[0].textContent || "";
    //             if (buttonEnabled(id) && !isEndGameProject(textContent)){
    //                 setTimeout(function(){
    //                     console.log(textContent);
    //                 }, 10)
                    
    //                 clickButton(id)
    //                 removeButtonsThatHoldUpOtherProjects(id);
    //                 return;
    //             }
    //         }
                
    //     }
    // })
    // // buy autoclipper
    // projectList.push({
    //     name: 'Buy autoclipper',
    //     canRun: () => {
    //         var totalClips = getNumber('clips');
    //         var wire = getNumber('wire');    
    //         return elementExists('btnMakeClipper') && buttonEnabled('btnMakeClipper') && getNumber('clipmakerLevel2') - 10  < getNumber('marketingLvl') * 10 && wire > 1000  && getNumber('clipmakerLevel2')  < 130 && getNumber('margin') > 0.02
    //         && (getNumber('avgRev') * 10 > getNumber('clipperCost') - 1000)
    //         ;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {        
    //         clickButton('btnMakeClipper')
            
                
    //     }
    // })
    // // buy mega clippers
    // projectList.push({
    //     name: 'Buy mega clippers',
    //     canRun: () => {
    //         var wire = getNumber('wire');
    //         return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('megaClipperLevel')  < getNumber('marketingLvl') * 8 && wire > 1500 && getNumber('megaClipperLevel')  < 105 && getNumber('margin') > 0.02
    //         && (getNumber('avgRev') * 10 > getNumber('megaClipperCost') - 1000);
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {        
    //         clickButton('btnMakeMegaClipper')
                
    //     }
    // })

    // // buy mega clippers
    // projectList.push({
    //     name: 'Buy mega clippers when prices are high',
    //     canRun: () => {
    //         var wire = getNumber('wire');
    //         return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('margin') > 0.25 && getNumber('megaClipperLevel') < 120;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {        
    //         clickButton('btnMakeMegaClipper')
                
    //     }
    // })
    // // upgrade computational resources
    // projectList.push({
    //     name: 'Upgrade computational resources',
    //     canRun: () => {
    //         return elementExists('btnAddProc') && buttonEnabled('btnAddProc');
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {        
    //         var upgradeFunction = function(){
    //             var processors  = getNumber('processors');
    //             var memory = getNumber('memory') ;
    //             if ((processors < 5 || 
    //                 (memory < 90 && processors * 4 < memory) ||
    //                 // (memory > 100 && memory < 120 && processors * 0.75 < memory) ||
    //                 (memory >= 120 && processors  < memory) ||
    //                 memory > 300)) {
    //                 clickButton('btnAddProc');
    //             }
    //             else {
    //                 clickButton('btnAddMem');
    //             }
    //             if (buttonEnabled('btnAddProc') || buttonEnabled('btnAddMem'))   {
    //                 setTimeout(() => {
    //                     upgradeFunction();
    //                 }, (100));
    //             }
    //         };
    //         upgradeFunction();
    //     }
    // })
    // projectList.push({
    //     name: 'Set investments to medium risk',
    //     canRun: () => {
    //         return elementExists('investStrat') && (<HTMLSelectElement>document.getElementById('investStrat')).selectedIndex != 1;
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {        
    //         (<HTMLSelectElement>document.getElementById('investStrat')).selectedIndex = 1
    //     }
    // })
    // projectList.push({
    //     name: 'Improve investments',
    //     canRun: () => {
    //         return elementExists('btnImproveInvestments') && buttonEnabled('btnImproveInvestments') && getNumber('investmentLevel') < 9;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {        
    //         clickButton('btnImproveInvestments')
    //     }
    // })
    // projectList.push({
    //     name: 'Quantum Computing Click',
    //     canRun: () => {       

    //         var qChipItems =   document.getElementsByClassName('qChip')
    //         var totalOpacity = 0;
    //         for (var i = 0; i < qChipItems.length; i++){ 
    //             totalOpacity += Number ((<HTMLElement>qChipItems[i]).style.opacity);
    //         }
    //         return totalOpacity > 0.2 && getNumber('operations') < getNumber('maxOps');
    //     },
    //     priority: projectPriority.High,
    //     run: () => {        
    //         for (var i = 0; i < 10; i++) {
    //             setTimeout(function(){  clickButton('btnQcompute'); }, i * 33);
    //     }
    //     }
    // })

    // var lastDepositTime : number = (new Date()).getTime() - 100000;
    // projectList.push({
    //     name: 'Deposit',
    //     canRun: () => {
    //         var trust = getNumber('trust');
    //         var now : number = (new Date()).getTime();
    //         return elementExists('investmentEngine') && elementExists('btnInvest') != null && buttonEnabled('btnInvest') && (trust < 95 || ( trust > 29 && trust < 32)) && (now - lastDepositTime > 30000) && getNumber('investmentLevel') > 0;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {        
    //         clickButton('btnInvest')
    //         lastDepositTime =  (new Date()).getTime();
    //     }
    // })

    // var lastSliderTime : number = (new Date()).getTime() - 90000;
    // projectList.push({
    //     name: 'Set slider somewhere near the middle',
    //     canRun: () => {
    //         return boostedCreativity == true && elementExists('slider') && (new Date().getTime() - lastSliderTime > 90000) ;
    //     },
    //     priority: projectPriority.High,
    //     run: () => {    
    //         var slider = (<HTMLInputElement>document.getElementById('slider'));
    //         // A little variety permitted. Random within the range of half the slider. 
    //         var random = ((Math.random() * 0.5) * Number(slider.max));
    //         if (getNumber('memory') < 100){
    //             // Push for some thinking in this period
    //             random +=  Number(slider.max)*0.25;
    //         }
    //         // else if (getNumber('memory') < 300){
    //         //     // Push for more thinking in this period
    //         //     random +=  Number(slider.max)*0.5;
    //         // }      

    //         slider.value = random.toString();
            
    //         lastSliderTime =  (new Date()).getTime();
    //     }
    // })

    // var lastWithdrawTime : number = (new Date()).getTime();
    // var minimumWithdrawAmount : number = 250000;
    // projectList.push({
    //     name: 'Withdraw',
    //     canRun: () => {
    //         var trust = getNumber('trust');
    //         var now : number = (new Date()).getTime();
    //         return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw')  && (now - lastWithdrawTime > 30000)
    //         && trust > 30 && ((getNumber('investmentBankroll') > minimumWithdrawAmount && getNumber('portValue') > getNumber('investmentBankroll') * 2) ||
    //         ( getNumber('clips') > 300000000 &&getNumber('investmentBankroll')>0));
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {        
            
    //         lastWithdrawTime =  (new Date()).getTime();
    //         minimumWithdrawAmount = minimumWithdrawAmount * 2;
    //         clickButton('btnWithdraw')
    //     }
    // })
    // projectList.push({
    //     name: 'Set strategic modeling to last model.',
    //     canRun: () => {
    //         return elementExists('stratPicker') && (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex !=  (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {        
    //         (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex = (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    //     }
    // })

    // projectList.push({
    //     name: 'Early Tournament Push',
    //     canRun: () => {
    //         var yomi = getNumber('yomiDisplay');          
    //         var operation = getNumber('operations');    
    //         var trust = getNumber('trust');
    //         return elementExists('btnNewTournament') && buttonEnabled('btnNewTournament')  && getNumber('yomiDisplay') <= 7000;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {      
    //         (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex = (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    //         clickButton('btnNewTournament');
    //         setTimeout(() => {
    //             clickButton('btnRunTournament');
    //         }, 500);
            
    //     }
    // })

    // projectList.push({
    //     name: 'Run tournament',
    //     canRun: () => {
    //         var yomi = getNumber('yomiDisplay');          
    //         var operation = getNumber('operations');    
    //         var trust = getNumber('trust');
    //         return boostedCreativity === true && (elementExists('investmentEngineUpgrade') || elementExists('tournamentManagement')) && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament')  && getNumber('maxOps') <= getNumber('operations');
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {      
    //         clickButton('btnNewTournament');
    //         setTimeout(() => {
    //             clickButton('btnRunTournament');
    //         }, 500);
    //         (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex = (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    //     }
    // })


    // // Level 2

    // projectList.push({
    //     name: 'Entertain the Swarm',
    //     canRun: () => {        
    //         return elementExists('btnEntertainSwarm') &&  buttonEnabled('btnEntertainSwarm') ;
    //     },
    //     priority: projectPriority.High,
    //     run: () => {    
    //         clickButton('btnEntertainSwarm');
    //     }
    // })
    // var productionWorking = function() {
    //     return getNumber('harvesterLevelDisplay')>0 &&
    //     getNumber('wireDroneLevelDisplay')>0 &&
    //     getNumber('factoryLevelDisplay')>0 &&
    //     getNumber('farmLevel')>0 &&
    //     getNumber('batteryLevel')>0 &&
    //     (getNumber('powerConsumptionRate') <= getNumber('powerProductionRate'))    ;
    // }
    // projectList.push({
    //     name: 'Make Solar',
    //     canRun: () => {        
    //         var consumption = getNumber('powerConsumptionRate');
    //         var production = getNumber('powerProductionRate');
    //         return elementExists('btnMakeFarm') && consumption * 1.5 > production && buttonEnabled('btnMakeFarm')  && getNumber('farmLevel') < 1900;
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {    
    //         clickButton('btnMakeFarm');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Solar (already behind)',
    //     canRun: function () {
    //         var consumption = getNumber('powerConsumptionRate');
    //         var production = getNumber('powerProductionRate');
    //         return elementExists('btnMakeFarm') && consumption >= production && buttonEnabled('btnMakeFarm');
    //     },
    //     priority: projectPriority.High,
    //     run: function () {
    //         clickButton('btnFarmx100');
    //         clickButton('btnFarmx10');
    //         clickButton('btnMakeFarm');
    //     }
    // });
    // projectList.push({
    //     name: 'Make Solar X 100',
    //     canRun: () => {        
    //         var consumption = getNumber('powerConsumptionRate');
    //         var production = getNumber('powerProductionRate');
    //         return elementExists('btnFarmx100') && consumption * 1.2 >= production && buttonEnabled('btnFarmx100') && getNumber('farmLevel') < 1700;
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {    
    //         clickButton('btnFarmx100');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Battery Storage',
    //     canRun: () => {        
    //         return (productionWorking() || getNumber('factoryLevelDisplay')==0) && elementExists('btnMakeBattery') && buttonEnabled('btnMakeBattery') && getNumber('maxStorage') < 10000000 && getNumber('maxStorage') == getNumber('storedPower');        
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {    
    //         clickButton('btnMakeBattery');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Battery Storage X 10',
    //     canRun: () => {        
    //         return elementExists('btnBatteryx10') && buttonEnabled('btnBatteryx10') && getNumber('maxStorage') < 9900000 && getNumber('maxStorage') == getNumber('storedPower');        
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {    
    //         clickButton('btnBatteryx10');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Battery Storage X 100',
    //     canRun: () => {        
    //         return elementExists('btnBatteryx100') && buttonEnabled('btnBatteryx100') && getNumber('maxStorage') < 9000000 && getNumber('maxStorage') == getNumber('storedPower');        
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {    
    //         clickButton('btnBatteryx100');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Factory',
    //     canRun: () => { 
    //         return (productionWorking() || getNumber('factoryLevelDisplay')==0) && getNumber('wire') != 0 && elementExists('unusedClipsDisplay')&& elementExists('btnMakeFactory') && buttonEnabled('btnMakeFactory') && getNumber('factoryLevelDisplay') < 175        
    //         && (!elementExists('projectButton102') ||  getNumber('factoryLevelDisplay') < 50);        
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {            
    //         clickButton('btnMakeFactory');
    //     }
    // })

    // projectList.push({
    //     name: 'Make Wire Drone when nano wire is 0',
    //     canRun: () => {        
    //         return  productionWorking()  && getNumber('nanoWire') == 0 && buttonEnabled('btnMakeWireDrone') && getNumber('wireDroneLevelDisplay') < 500        
    //         ;        
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {            
    //         clickButton('btnWireDronex1000');
    //         clickButton('btnWireDronex100');
    //         clickButton('btnWireDronex10');
    //         clickButton('btnMakeWireDrone');
    //     }
    // })


    // projectList.push({
    //     name: 'Make Wire Drone',
    //     canRun: () => {        
    //         return  (productionWorking() || getNumber('wireDroneLevelDisplay')==0) && elementExists('btnMakeWireDrone') && buttonEnabled('btnMakeWireDrone') && getNumber('wireDroneLevelDisplay') < 27000
    //         && (getNumber('wireDroneLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
    //         && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
    //         ;        
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {    
    //         clickButton('btnMakeWireDrone');
    //     }
    // })


    // projectList.push({
    //     name: 'Make Harvester',
    //     canRun: () => {        
    //         return (productionWorking() || getNumber('harvesterLevelDisplay')==0) && elementExists('btnMakeHarvester') && buttonEnabled('btnMakeHarvester') && getNumber('harvesterLevelDisplay') < 23000
    //         && (getNumber('harvesterLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
    //         && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
    //         ;        
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {    
    //         clickButton('btnMakeHarvester');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Harvester when matter is 0',
    //     canRun: () => {        
    //         return  productionWorking() && getNumber('acquiredMatterDisplay') == 0 && buttonEnabled('btnMakeHarvester') && getNumber('harvesterLevelDisplay') < 500        
    //         ;        
    //     },
    //     priority: projectPriority.Low,
    //     run: () => {    
    //         clickButton('btnHarvesterx1000');
    //         clickButton('btnHarvesterx100');
    //         clickButton('btnHarvesterx10');
    //         clickButton('btnMakeHarvester');
    //     }
    // })


    // projectList.push({
    //     name: 'Make Harvester X 100',
    //     canRun: () => {        
    //         return elementExists('btnHarvesterx100') && buttonEnabled('btnHarvesterx100') && getNumber('harvesterLevelDisplay') < 22900 && getNumber('harvesterLevelDisplay') > 300 && getNumber('wireDroneLevelDisplay') > 300
    //         && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);

    //     },
    //     priority: projectPriority.Low,
    //     run: () => {    
    //         clickButton('btnHarvesterx100');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Wire Drone X 100',
    //     canRun: () => {        
    //         return elementExists('btnWireDronex100') && buttonEnabled('btnWireDronex100') && getNumber('wireDroneLevelDisplay') < 26900 && getNumber('harvesterLevelDisplay') > 300 && getNumber('wireDroneLevelDisplay') > 300
    //         && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
    //         ;       

    //     },
    //     priority: projectPriority.Low,
    //     run: () => {    
    //         clickButton('btnWireDronex100');
    //     }
    // })

    // projectList.push({
    //     name: 'Make Harvester X 1000',
    //     canRun: () => {         
    //         return elementExists('btnHarvesterx1000') && buttonEnabled('btnHarvesterx1000') && getNumber('harvesterLevelDisplay') < 21000 && getNumber('harvesterLevelDisplay') > 1000
    //         && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);        
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {    
    //         clickButton('btnHarvesterx1000');
    //     }
    // })
    // projectList.push({
    //     name: 'Make Wire Drone X 1000',
    //     canRun: () => {        
    //         return elementExists('btnWireDronex1000') && buttonEnabled('btnWireDronex1000') && getNumber('wireDroneLevelDisplay') < 25000 && getNumber('wireDroneLevelDisplay') > 1000
    //         && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);        
    //     },
    //     priority: projectPriority.Medium,
    //     run: () => {    
    //         clickButton('btnWireDronex1000');
    //     }
    // })


    // // projectList.push({
    // //     name: 'Disassembling Factories, Harvester Drones, Wire Drones',
    // //     canRun: () => {        
    // //         return elementExists('btnFactoryReboot') && buttonEnabled('btnFactoryReboot') && getNumber('availableMatterDisplay') == 0 && getNumber('acquiredMatterDisplay') == 0 
    // //         && getNumber('nanoWire') == 0 && getNumber('operations') > 120000;        
    // //     },
    // //     priority: projectPriority.High,
    // //     run: () => {    
    // //         clickButton('btnFactoryReboot');
    // //         clickButton('btnHarvesterReboot');
    // //         clickButton('btnWireDroneReboot');
    // //     }
    // // })




    // // Space

    // projectList.push({
    //     name: 'Increase Probe Trust',
    //     canRun: () => {
    //         return state.phase3.increaseProbeTrustAvailable;
    //     },
    //     priority: projectPriority.Highest,
    //     run: () => {    
    //         state.phase3Action.increaseProbeTrust();
    //     }
    // })
    // projectList.push({
    //     name: 'Make Probe',
    //     canRun: () => {
    //         return elementExists('btnMakeProbe') && getNumber('probesTotalDisplay') < 1000;
    //     },
    //     priority: projectPriority.Lowest,
    //     run: () => {    
    //         clickButton('btnMakeProbe');
    //     }
    // })

    // projectList.push({
    //     name: 'Sync Swarm',
    //     canRun: () => {
    //         return elementExists('btnSynchSwarm') && buttonEnabled('btnSynchSwarm');
    //     },
    //     priority: projectPriority.High,
    //     run: () => {    
    //         clickButton('btnSynchSwarm');
    //     }
    // })

    // projectList.push({
    //     name: 'Increase Max Trust',
    //     canRun: () => {
    //         return elementExists('btnIncreaseMaxTrust') && buttonEnabled('btnIncreaseMaxTrust');
    //     },
    //     priority: projectPriority.High,
    //     run: () => {    
    //         clickButton('btnIncreaseMaxTrust');
    //     }
    // })



    // var rebalanceProbeLastRun : number = new Date().getTime() - 60000;
    // projectList.push({
    //     name: 'Rebalance Probes',
    //     canRun: function () {
            
    //         if (getNumber('probeTrustDisplay') < 3){
    //             return false;
    //         }
    //         return elementExists('probeTrustUsedDisplay') && (new Date().getTime() - rebalanceProbeLastRun > 30000);
    //     },
    //     priority: projectPriority.Medium,
    //     run: function () {
    //         if (!elementExists('nanoWire')) {
    //             return false;
    //         }
    //         var remaining = getNumber('probeTrustDisplay');
    //         //probeCombatDisplay
    //         var rep = 0;
    //         var haz = 0;        
    //         var combat = 0;
    //         var speed = 1;
    //         var exploration = 1;
    //         var factory = 0;
    //         var nanoWire = 0;
    //         var acquiredMatter = 0;
    //         remaining -= 2;
    //         var random = Math.random();
    //         var halfRemaining = Math.floor(remaining/2);
    //         var quarterRemaining = Math.floor(remaining/4);
    //         if (random > 0.9 && elementExists('probeCombatDisplay')){
    //             setTimeout(() => {
    //                 console.log('Combat madness');
    //             }, 100);
                
    //             while (remaining > 10 && remaining > quarterRemaining){
    //                 combat++;
    //                 remaining--;
    //             }
    //         } 
    //         else if (random > 0.8){
    //             setTimeout(() => {
    //                 console.log('Replicate like crazy');
    //             }, 100);
    //             while (remaining > 4 && remaining > quarterRemaining){
    //                 rep++;
    //                 haz++;
    //                 remaining-=2;
    //             }
    //         }
    //         else if (random > 0.7){            
    //             setTimeout(() => {
    //                 console.log('Start with equality');
    //             }, 100);
                
    //             if (remaining > 10){
    //                 factory++;
    //                 nanoWire++;
    //                 acquiredMatter++;
    //                 speed++;
    //                 exploration++;
    //                 rep++;
    //                 haz++;
    //                 combat++;
    //                 remaining-=8;
    //             }
    //         }

    //         if ((<HTMLElement>document.getElementById('acquiredMatterDisplay')).innerText != "0" && getNumber('nanoWire')==0) {
    //             nanoWire++;
    //             remaining--;
    //         }
    //         if ((<HTMLElement>document.getElementById('availableMatterDisplay')).innerText != "0" && getNumber('acquiredMatterDisplay')==0) {        
    //             acquiredMatter++;
    //             remaining--;
    //         }
    //         if (getNumber('availableMatterDisplay') == 0 && remaining > 1 ) {
    //             var availableMatterSearch = Math.floor(remaining / 5);
    //             speed+=availableMatterSearch;
    //             exploration+=availableMatterSearch;
    //             remaining -= availableMatterSearch*2;
    //         }
    //         if ((<HTMLElement>document.getElementById('nanoWire')).innerText != "0" && remaining > 0) {
    //             factory++;
    //             remaining--;
    //         }
    //         if (elementExists('probeCombatDisplay') && combat === 0) {
    //             var combatChange = Math.floor(remaining / 3);
    //             combat += combatChange;
    //             remaining -= combatChange;
    //         }
    //         if (remaining > 30){
    //             rep++;
    //             remaining--;
    //             haz++;
    //             remaining--;
    //             nanoWire++;
    //             remaining--;
    //             acquiredMatter++;
    //             remaining--;
    //             factory++;
    //             remaining--;

    //         }
    //         while (remaining > 14) {
    //             rep+=2;
    //             remaining-=2;
    //             haz+=2;
    //             remaining-=2;
    //             if (rep > 5){
    //                 speed++;
    //                 remaining--;
    //                 exploration++;
    //                 remaining--;  
    //             }          
    //         }

    //         while (remaining > 0) {
    //             // Fill up other stuff
    //             if (remaining-- > 0) {
    //                 rep++;
    //             }
    //             if (remaining-- > 0) {
    //                 haz++;
    //             }
    //         }
    //         var changeProbes = function () {
    //             var delay = 50;
    //             var changeIt = function(goal : number, actualElementId : string, lowerButtonId : string, raiseButtonId : string) {
    //                 var buttonToClick : string | null= null;
    //                 if (goal > getNumber(actualElementId)){                    
    //                     buttonToClick = raiseButtonId;
    //                 }
    //                 else if (goal < getNumber(actualElementId)){                    
    //                     buttonToClick = lowerButtonId;
    //                 }
                    
    //                 if (buttonToClick != null){
    //                     clickButton(buttonToClick);
    //                     setTimeout(() => {             
    //                         changeIt(goal, actualElementId, lowerButtonId, raiseButtonId);
    //                     }, (delay+=15));
    //                 }
    //                 return buttonToClick;
    //             }
    //             changeIt(speed, "probeSpeedDisplay", "btnLowerProbeSpeed", "btnRaiseProbeSpeed"); 
    //             changeIt(exploration, "probeNavDisplay", "btnLowerProbeNav", "btnRaiseProbeNav");
    //             changeIt(rep, "probeRepDisplay", "btnLowerProbeRep", "btnRaiseProbeRep");
    //             changeIt(haz, "probeHazDisplay", "btnLowerProbeHaz", "btnRaiseProbeHaz");
    //             changeIt(factory, "probeFacDisplay", "btnLowerProbeFac", "btnRaiseProbeFac");
    //             changeIt(acquiredMatter, "probeHarvDisplay", "btnLowerProbeHarv", "btnRaiseProbeHarv");
    //             changeIt(nanoWire, "probeWireDisplay", "btnLowerProbeWire", "btnRaiseProbeWire");
    //             changeIt(combat, "probeCombatDisplay", "btnLowerProbeCombat", "btnRaiseProbeCombat");
                
                
    //         };
    //         changeProbes();

    //         rebalanceProbeLastRun = new Date().getTime();
    //     }
    // });

    var runNextProject = function(){
        state = new CurrentState();
        var enumsToLoop = [projectPriority.Highest, projectPriority.High, projectPriority.Medium, projectPriority.Low, projectPriority.Lowest]
        for(var i = 0; i < enumsToLoop.length; i++){
            var canRunInPriorityLevel : IProject[]= [];
            for (var j = 0; j < projectList.length; j++){
                if (projectList[j].priority == enumsToLoop[i] &&
                    projectList[j].canRun()){
                        canRunInPriorityLevel.push(projectList[j]);
                    }
            }
            if (canRunInPriorityLevel.length > 0){
                var selectedProject = canRunInPriorityLevel[Math.floor(Math.random() * canRunInPriorityLevel.length)]
                selectedProject.run();
                console.log((new Date()).toLocaleString() +  " ("+ canRunInPriorityLevel.length +  ")  " + selectedProject.name);
                return;
            }
        }
        
    }

}


setTimeout( WeightedNamespace.automation, WeightedNamespace.automationTimeout);

