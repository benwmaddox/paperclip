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
        return Number( numberString.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace('$',''))
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
    actions.push({id: "btnRunTournament", value: "click", increase: ["yomiDisplay"], decrease: []})    
    actions.push({id: "stratPicker", value: () => (<HTMLSelectElement>document.getElementById('stratPicker')).length -1, increase: ["yomiDisplay"], decrease: ["operations"]})
    actions.push({id: "btnMakeMegaClipper", value: "click", increase: ["unsoldClips", "clips"], decrease: ["funds"] });
    actions.push({id: "btnImproveInvestments", value: "click", increase: ["secValue"], decrease: ["yomiDisplay"] });
    actions.push({id: "btnInvest", value: "click", increase: ["secValue"], decrease: ["funds"] });    
    actions.push({id: "btnWithdraw", value: "click", increase: ["funds"], decrease: ["secValue"] });        
    actions.push({id: "investStrat", value: () => {
        if (getNumber('investmentLevel') <= 2){
            return 0;
        }
        else if (getNumber('investmentLevel') <= 5){
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
    goals.push({target: "yomiDisplay", weight: () => elementExists('yomiDisplay') && getNumber('operations') >= getNumber("maxOps") ? 10 : 0 })
    goals.push({target: "secValue", weight: () => elementExists('investmentEngine') ? 1 : 0 })    
    goals.push({target: "qChip", weight: () => {        
        return sum<Element>(document.getElementsByClassName('qChip'), (element) =>  Number ((<HTMLElement>element).style.opacity)) > 0.1 && getNumber('operations') < getNumber('maxOps') ? 100 : 0;
    }})

    function sum<T extends Element>(list : HTMLCollectionOf<T>, selectionMethod: (e : T) => number){
        var total = 0;
        
        for (var i = 0; i < list.length; i++){ 
            total += selectionMethod(list.item(i));
        }
        return total;
    }


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

    export var automationTimeout = 300;// Math.random() > 0.99 ? 15000 : 1000;
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

// lookup projects and take needed items, compare to what is already there and add appropriately
function addGoalsForNeededProjects(){    
    var projectButtons = document.getElementsByClassName('projectButton');
    for (var i =0; i < projectButtons.length; i++){
        var costText : string = (<Text> projectButtons[i].childNodes[1]).data;
        costText = costText.replace(')','').replace('(','');
        var costs = costText.split(', ');
        for (var j=0; j < costs.length; j++){
            var costSplit = costs[j].split(" ");            
            var number = cleanNumber(costSplit[0]);
            var type = costSplit.length > 0 ? costSplit[1] : "";
            
            
            if (costSplit[0].indexOf("$") > -1 && number > getNumber('funds')){                
                applyGoal("funds", 1);
                applyGoal("secValue", 10);
            }
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
                else if (document.getElementById(actions[i].id) != null ){
                    var element = document.getElementById(actions[i].id);
                    if (element != null 
                        && element.tagName == "SELECT" 
                        && getNumberFromValue(actions[i]) === (<HTMLSelectElement>element).selectedIndex ){
                        continue;
                    }
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
        if (target == null){            
            console.log('Target not found');
            return;
        }
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

