

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
function getNumber(elementId : string){
    var element = document.getElementById(elementId);
    if (!element){
        return 0;
    }
    return Number( element.innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''))
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
projectList.push({
    name: "Initial clip clicks",
    canRun: () => {
        var totalClips = getNumber('clips');
        var now : number = new Date().getTime();        
        return totalClips < 3000 && getNumber('unsoldClips') < 500  && buttonEnabled('btnMakePaperclip') && (now - initialClipLastRun > 10000) && getNumber('clipmakerLevel2') < 5;
    },
    priority: projectPriority.Lowest,
    run: () => {
        initialClipLastRun = new Date().getTime();
        for (var i = 0; i < 250; i++){
            setTimeout(() => {                
                clickButton('btnMakePaperclip');
            }, 60*i);
        }
    }
})
//
projectList.push({
    name: 'Buy wire when low',
    canRun: () => {
        var wire = getNumber('wire');
        return wire < 1500 && buttonEnabled('btnBuyWire') && !elementExists('btnToggleWireBuyer') && elementExists('btnBuyWire');
    },
    priority: projectPriority.Highest,
    run: () => {
        clickButton('btnBuyWire');
    }
})
// Marketing
projectList.push({
    name: 'Marketing upgrade',
    canRun: () => {
        var wire = getNumber('wire');
        var marketingCost = getNumber('adCost');
        var funds = getNumber('funds');
        return wire > 1500 && marketingCost < funds && buttonEnabled('btnExpandMarketing') && (getNumber('marketingLvl') < 17 || getNumber('margin') < 0.05);
    },
    priority: projectPriority.High,
    run: () => {
        clickButton('btnExpandMarketing');
    }
})
//
projectList.push({
    name: 'Adjust price lower',
    canRun: () => {
        var totalClips = getNumber('clips');
        var unsoldClips= getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        return elementExists('avgSales') && rateElement && totalClips > 800 && (clipMakerRate+1) * 30 < unsoldClips && unsoldClips >= 1000 && averagesale - clipMakerRate < 0  && buttonEnabled('btnLowerPrice');
    },
    priority: projectPriority.Low,
    run: () => {
        clickButton('btnLowerPrice');
    }
})
// Adjust price higher
projectList.push({
    name: 'Adjust price higher',
    canRun: () => {
        var totalClips = getNumber('clips');
        var unsoldClips= getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var rateElement = elementExists('clipmakerRate');
        return elementExists('avgSales') && getNumber('avgSales') > 0 && rateElement && (totalClips > 800 && ((clipMakerRate+1) * 10 > unsoldClips && getNumber('avgSales')  - clipMakerRate > 0) || (totalClips > 1800  && unsoldClips < 1000))   && buttonEnabled('btnRaisePrice');
    },
    priority: projectPriority.Low,
    run: () => {
        clickButton('btnRaisePrice');
    }
})

projectList.push({
    name: 'Wow. We really need to increase prices',
    canRun: () => {
        return elementExists('unsoldClips') && elementExists('clipmakerRate') && getNumber('unsoldClips') < getNumber('clipmakerRate') && getNumber('wire') > 0 && getNumber('clipmakerRate') > 500;
    },
    priority: projectPriority.Low,
    run: () => {
        clickButton('btnRaisePrice');
        clickButton('btnRaisePrice');
        clickButton('btnRaisePrice');
        clickButton('btnRaisePrice');
        clickButton('btnRaisePrice');
    }
})


var lowerPriceTime : number = new Date().getTime() - 120000;
projectList.push({
    name: 'Adjust price lower in early game',
    canRun: function () {
        return getNumber('clips') < 3000 && getNumber('margin') > 0.10;
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnLowerPrice');
    }
});

projectList.push({
    name: 'Adjust price lower',
    canRun: function () {
        var totalClips = getNumber('clips');
        var unsoldClips = getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        return elementExists('avgSales') && rateElement && totalClips > 800 && (clipMakerRate + 1) * 30 < unsoldClips && unsoldClips >= 1000 && averagesale - clipMakerRate < 0 && buttonEnabled('btnLowerPrice');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnLowerPrice');
    }
});

var marketLoadTest : number = new Date().getTime() - 300000;
// Adjust price higher
projectList.push({
    name: 'Increasing prices to check market load',
    canRun: () => {        
        return elementExists('btnRaisePrice') && (new Date()).getTime() - marketLoadTest > 300000 && getNumber('clips') > 10000 && getNumber('unsoldClips') < 10 + getNumber('clipmakerRate') * 5;
    },
    priority: projectPriority.Low,
    run: () => {
        marketLoadTest = new Date().getTime();
        for (var i = 0; i < 10; i++){
            setTimeout(() => {                
                clickButton('btnRaisePrice');
            }, 4100);
        }
    }
})

var boostedCreativity : boolean = true;
var boostedCreativityTime : number = new Date().getTime() - 570000;
projectList.push({
    name: 'Force minimum creativity for harder to get projects',
    canRun: () => {        
        var lowLevelCheck = elementExists('creativity') && elementExists('processors')  && getNumber('processors') >= 5 && boostedCreativity == true && getNumber('creativity') < getNumber('processors') * 50 && (new Date().getTime() - boostedCreativityTime > 600000);
        if (lowLevelCheck){
            return true;
        }
        var rushLater = getNumber('processors') >= 100 && getNumber('creativity') < 125000 && boostedCreativity == true;
        return rushLater;
    },
    priority: projectPriority.Highest,
    run: () => {
        boostedCreativity = false;
        boostedCreativityTime = new Date().getTime();
    }
});
projectList.push({
    name: 'Minimum creativity goal met',
    canRun: () => {        
        // Force creativity use too
        
        var lowLevelMet = boostedCreativity == false && ((getNumber('creativity') > getNumber('processors') * 50) || !elementExists('processors'));
        var rushLaterMet = getNumber('processors') < 100 || getNumber('creativity') > 125000;
        return lowLevelMet && rushLaterMet;
    },
    priority: projectPriority.Highest,
    run: () => {
        boostedCreativity = true;
        boostedCreativityTime = new Date().getTime();
    }
});

var isEndGameProject = function(name: string){
    return name === "Reject " || name === "Accept ";
}
// run projects
var buttonsThatHoldUpOtherProjects : string[] = [
    "projectButton20", //Strategic Modeling
    //'projectButton51', // Photonic chip    
    "projectButton38", // Full Monopoly
    "projectButton102", // Self-correcting Supply Chain
    'projectButton27' // Coherent Extrapolated Volition
    ];
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
        if (isEndGameProject(textContent)){
            return {
                enabled: [],
                disabled: []
            }
        };
    }
    
    var holdUpEnabledProjects = enabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) !== -1);
    var normalEnabled = enabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) === -1);
    var holdUpDisabledProjects = disabledButtons.filter(x => buttonsThatHoldUpOtherProjects.indexOf(x) !== -1);
    return {
            enabled: holdUpEnabledProjects.length == 0 && holdUpDisabledProjects.length == 0 ? enabledButtons : holdUpEnabledProjects,
            disabled: disabledButtons
        }
    }
projectList.push({
    name: 'Run projects',
    canRun: () => {
        // var projectButtons  =  document.getElementsByClassName('projectButton');
        if (getNumber('processors') > 5 && boostedCreativity == false){
            return false;
        }
        var buttons = getProjectsThatCouldBeRun();
        
        return buttons.enabled.length > 0;
        
    },
    priority: projectPriority.Highest,
    run: () => {        
        // var projectButtons  =  document.getElementsByClassName('projectButton');
        var buttonIds = getProjectsThatCouldBeRun();
        
        for (var i = 0; i < buttonIds.enabled.length; i++){
            var id = buttonIds.enabled[i];
            var element = getById(id);
            if (element === null) continue;

            var textContent = element.childNodes[0].textContent || "";
            if (buttonEnabled(id) && !isEndGameProject(textContent)){
                setTimeout(function(){
                    console.log(textContent);
                }, 10)
                
                clickButton(id)
                return;
            }
        }
            
    }
})
// buy autoclipper
projectList.push({
    name: 'Buy autoclipper',
    canRun: () => {
        var totalClips = getNumber('clips');
        var wire = getNumber('wire');    
        return elementExists('btnMakeClipper') && buttonEnabled('btnMakeClipper') && getNumber('clipmakerLevel2') - 10  < getNumber('marketingLvl') * 10 && wire > 1000  && getNumber('clipmakerLevel2')  < 130 && getNumber('margin') > 0.02
        && (getNumber('avgRev') * 10 > getNumber('clipperCost') - 1000)
        ;
    },
    priority: projectPriority.Low,
    run: () => {        
        clickButton('btnMakeClipper')
        
            
    }
})
// buy mega clippers
projectList.push({
    name: 'Buy mega clippers',
    canRun: () => {
        var wire = getNumber('wire');
        return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('megaClipperLevel')  < getNumber('marketingLvl') * 8 && wire > 1500 && getNumber('megaClipperLevel')  < 105 && getNumber('margin') > 0.02
        && (getNumber('avgRev') * 10 > getNumber('megaClipperCost') - 1000);
    },
    priority: projectPriority.Medium,
    run: () => {        
        clickButton('btnMakeMegaClipper')
            
    }
})
// upgrade computational resources
projectList.push({
    name: 'Upgrade computational resources',
    canRun: () => {
        return elementExists('btnAddProc') && buttonEnabled('btnAddProc');
    },
    priority: projectPriority.Medium,
    run: () => {        
        var upgradeFunction = function(){
            var processors  = getNumber('processors');
            var memory = getNumber('memory') ;
            if ((processors < 5 || 
                (memory < 90 && processors * 4 < memory) ||
                (memory > 100 && memory < 120 && processors * 0.75 < memory) ||
                (memory >= 150 && processors  < memory) ||
                memory > 300)) {
                clickButton('btnAddProc');
            }
            else {
                clickButton('btnAddMem');
            }
            if (buttonEnabled('btnAddProc') || buttonEnabled('btnAddMem'))   {
                setTimeout(() => {
                    upgradeFunction();
                }, (100));
            }
        };
        upgradeFunction();
    }
})
projectList.push({
    name: 'Set investments to medium risk',
    canRun: () => {
        return elementExists('investStrat') && (<HTMLSelectElement>document.getElementById('investStrat')).selectedIndex != 1;
    },
    priority: projectPriority.Medium,
    run: () => {        
        (<HTMLSelectElement>document.getElementById('investStrat')).selectedIndex = 1
    }
})
projectList.push({
    name: 'Improve investments',
    canRun: () => {
        return elementExists('btnImproveInvestments') && buttonEnabled('btnImproveInvestments') && getNumber('investmentLevel') < 11;
    },
    priority: projectPriority.Lowest,
    run: () => {        
        clickButton('btnImproveInvestments')
    }
})
projectList.push({
    name: 'Quantum Computing Click',
    canRun: () => {       

        var qChipItems =   document.getElementsByClassName('qChip')
        var totalOpacity = 0;
        for (var i = 0; i < qChipItems.length; i++){ 
            totalOpacity += Number ((<HTMLElement>qChipItems[i]).style.opacity);
        }
        return totalOpacity > 0.2 && getNumber('operations') < getNumber('maxOps');
    },
    priority: projectPriority.High,
    run: () => {        
        for (var i = 0; i < 10; i++) {
            setTimeout(function(){  clickButton('btnQcompute'); }, i * 33);
    }
    }
})

var lastDepositTime : number = (new Date()).getTime() - 100000;
projectList.push({
    name: 'Deposit',
    canRun: () => {
        var trust = getNumber('trust');
        var now : number = (new Date()).getTime();
        return elementExists('investmentEngine') && elementExists('btnInvest') != null && buttonEnabled('btnInvest') && (trust < 95 || ( trust > 29 && trust < 32)) && (now - lastDepositTime > 30000) && getNumber('investmentLevel') > 0;
    },
    priority: projectPriority.Low,
    run: () => {        
        clickButton('btnInvest')
        lastDepositTime =  (new Date()).getTime();
    }
})

var lastSliderTime : number = (new Date()).getTime() - 90000;
projectList.push({
    name: 'Set slider somewhere near the middle',
    canRun: () => {
        return elementExists('slider') && (new Date().getTime() - lastSliderTime > 90000) ;
    },
    priority: projectPriority.High,
    run: () => {    
        var slider = (<HTMLInputElement>document.getElementById('slider'));
        // A little variety permitted. Random within the range of half the slider. 
        var random = ((Math.random() * 0.5) * Number(slider.max));
        if (getNumber('memory') < 100){
            // Push for some thinking in this period
            random +=  Number(slider.max)*0.25;
        }
        else if (getNumber('memory') < 300){
            // Push for more thinking in this period
            random +=  Number(slider.max)*0.5;
        }      

        slider.value = random.toString();
        
        lastSliderTime =  (new Date()).getTime();
    }
})

var lastWithdrawTime : number = (new Date()).getTime();
var minimumWithdrawAmount : number = 250000;
projectList.push({
    name: 'Withdraw',
    canRun: () => {
        var trust = getNumber('trust');
        var now : number = (new Date()).getTime();
        return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw')  && (now - lastWithdrawTime > 30000)
        && trust > 30 && ((getNumber('investmentBankroll') > minimumWithdrawAmount && getNumber('portValue') > getNumber('investmentBankroll') * 2) ||
        ( getNumber('clips') > 300000000 &&getNumber('investmentBankroll')>0));
    },
    priority: projectPriority.Lowest,
    run: () => {        
        
        lastWithdrawTime =  (new Date()).getTime();
        minimumWithdrawAmount = minimumWithdrawAmount * 2;
        clickButton('btnWithdraw')
    }
})
projectList.push({
    name: 'Set strategic modeling to last model.',
    canRun: () => {
        return elementExists('stratPicker') && (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex !=  (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    },
    priority: projectPriority.Medium,
    run: () => {        
        (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex = (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    }
})
projectList.push({
    name: 'Run tournament',
    canRun: () => {
        var yomi = getNumber('yomiDisplay');          
        var operation = getNumber('operations');    
        var trust = getNumber('trust');
        return boostedCreativity === true && (elementExists('investmentEngineUpgrade') || elementExists('tournamentManagement')) && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament')  && getNumber('maxOps') === getNumber('operations');
    },
    priority: projectPriority.Low,
    run: () => {      
        clickButton('btnNewTournament');
        setTimeout(() => {
            clickButton('btnRunTournament');
        }, 500);
        (<HTMLSelectElement>document.getElementById('stratPicker')).selectedIndex = (<HTMLSelectElement>document.getElementById('stratPicker')).length -1;
    }
})


// Level 2

projectList.push({
    name: 'Entertain the Swarm',
    canRun: () => {        
        return elementExists('btnEntertainSwarm') &&  buttonEnabled('btnEntertainSwarm') ;
    },
    priority: projectPriority.High,
    run: () => {    
        clickButton('btnEntertainSwarm');
    }
})
projectList.push({
    name: 'Make Solar',
    canRun: () => {        
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnMakeFarm') && consumption * 1.2 > production && buttonEnabled('btnMakeFarm')  && getNumber('farmLevel') < 1700;
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeFarm');
    }
})
projectList.push({
    name: 'Make Solar (already behind)',
    canRun: function () {
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnMakeFarm') && consumption >= production && buttonEnabled('btnMakeFarm');
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnMakeFarm');
    }
});
projectList.push({
    name: 'Make Solar X 100',
    canRun: () => {        
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnFarmx100') && consumption * 1.2 >= production && buttonEnabled('btnFarmx100') && getNumber('farmLevel') < 1600;
    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnFarmx100');
    }
})
projectList.push({
    name: 'Make Battery Storage',
    canRun: () => {        
        return elementExists('btnMakeBattery') && buttonEnabled('btnMakeBattery') && getNumber('maxStorage') < 10000000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeBattery');
    }
})
projectList.push({
    name: 'Make Battery Storage X 10',
    canRun: () => {        
        return elementExists('btnBatteryx10') && buttonEnabled('btnBatteryx10') && getNumber('maxStorage') < 9900000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnBatteryx10');
    }
})
projectList.push({
    name: 'Make Battery Storage X 100',
    canRun: () => {        
        return elementExists('btnBatteryx100') && buttonEnabled('btnBatteryx100') && getNumber('maxStorage') < 9000000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnBatteryx100');
    }
})
var productionWorking = function() {
     return getNumber('harvesterLevelDisplay')>0 &&
     getNumber('wireDroneLevelDisplay')>0 &&
     getNumber('factoryLevelDisplay')>0 &&
     getNumber('farmLevel')>0 &&
     getNumber('batteryLevel')>0 &&
     (getNumber('powerConsumptionRate') <= getNumber('powerProductionRate'))    ;
}
projectList.push({
    name: 'Make Factory',
    canRun: () => {        
        return (productionWorking() || getNumber('factoryLevelDisplay')==0) && elementExists('btnMakeFactory') && buttonEnabled('btnMakeFactory') && getNumber('factoryLevelDisplay') < 185;        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnMakeFactory');
    }
})

projectList.push({
    name: 'Make Wire Drone',
    canRun: () => {        
        return  (productionWorking() || getNumber('wireDroneLevelDisplay')==0) && elementExists('btnMakeWireDrone') && buttonEnabled('btnMakeWireDrone') && getNumber('wireDroneLevelDisplay') < 26500
        && (getNumber('wireDroneLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
        && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
        ;        
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeWireDrone');
    }
})

projectList.push({
    name: 'Make Harvester',
    canRun: () => {        
        return (productionWorking() || getNumber('harvesterLevelDisplay')==0) && elementExists('btnMakeHarvester') && buttonEnabled('btnMakeHarvester') && getNumber('harvesterLevelDisplay') < 23500
        && (getNumber('harvesterLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
        && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
        ;        
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeHarvester');
    }
})
projectList.push({
    name: 'Make Harvester X 100',
    canRun: () => {        
        return elementExists('btnHarvesterx100') && buttonEnabled('btnHarvesterx100') && getNumber('harvesterLevelDisplay') < 23400 && getNumber('harvesterLevelDisplay') > 300 && getNumber('wireDroneLevelDisplay') > 300
        && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);

    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnHarvesterx100');
    }
})
projectList.push({
    name: 'Make Wire Drone X 100',
    canRun: () => {        
        return elementExists('btnWireDronex100') && buttonEnabled('btnWireDronex100') && getNumber('wireDroneLevelDisplay') < 25900 && getNumber('harvesterLevelDisplay') > 300 && getNumber('wireDroneLevelDisplay') > 300
        && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
        ;       

    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnWireDronex100');
    }
})

projectList.push({
    name: 'Make Harvester X 1000',
    canRun: () => {         
        return elementExists('btnHarvesterx1000') && buttonEnabled('btnHarvesterx1000') && getNumber('harvesterLevelDisplay') < 22000 && getNumber('harvesterLevelDisplay') > 1000
        && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnHarvesterx1000');
    }
})
projectList.push({
    name: 'Make Wire Drone X 1000',
    canRun: () => {        
        return elementExists('btnWireDronex1000') && buttonEnabled('btnWireDronex1000') && getNumber('wireDroneLevelDisplay') < 24000 && getNumber('wireDroneLevelDisplay') > 1000
        && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnWireDronex1000');
    }
})


projectList.push({
    name: 'Disassembling Factories, Harvester Drones, Wire Drones',
    canRun: () => {        
        return elementExists('btnFactoryReboot') && buttonEnabled('btnFactoryReboot') && getNumber('availableMatterDisplay') == 0 && getNumber('acquiredMatterDisplay') == 0 
        && getNumber('nanoWire') == 0 && getNumber('operations') > 120000;        
    },
    priority: projectPriority.High,
    run: () => {    
        clickButton('btnFactoryReboot');
        clickButton('btnHarvesterReboot');
        clickButton('btnWireDroneReboot');
    }
})




// Space

projectList.push({
    name: 'Increase Probe Trust',
    canRun: () => {
        return elementExists('btnIncreaseProbeTrust') && buttonEnabled('btnIncreaseProbeTrust');
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnIncreaseProbeTrust');
    }
})
projectList.push({
    name: 'Make Probe',
    canRun: () => {
        return elementExists('btnMakeProbe') && getNumber('probesTotalDisplay') < 1000;
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeProbe');
    }
})

projectList.push({
    name: 'Sync Swarm',
    canRun: () => {
        return elementExists('btnSynchSwarm') && buttonEnabled('btnSynchSwarm');
    },
    priority: projectPriority.High,
    run: () => {    
        clickButton('btnSynchSwarm');
    }
})

projectList.push({
    name: 'Increase Max Trust',
    canRun: () => {
        return elementExists('btnIncreaseMaxTrust') && buttonEnabled('btnIncreaseMaxTrust');
    },
    priority: projectPriority.High,
    run: () => {    
        clickButton('btnIncreaseMaxTrust');
    }
})



var rebalanceProbeLastRun : number = new Date().getTime() - 60000;
projectList.push({
    name: 'Rebalance Probes',
    canRun: function () {
        return elementExists('probeTrustUsedDisplay') && (new Date().getTime() - rebalanceProbeLastRun > 15000);
    },
    priority: projectPriority.Medium,
    run: function () {
        if (!elementExists('nanoWire')) {
            return false;
        }
        var remaining = getNumber('probeTrustDisplay');
        //probeCombatDisplay
        // for (var i = 0; i < remaining; i++) {
        //     clickButton('btnLowerProbeSpeed');
        //     clickButton('btnLowerProbeNav');
        //     clickButton('btnLowerProbeRep');
        //     clickButton('btnLowerProbeHaz');
        //     clickButton('btnLowerProbeFac');
        //     clickButton('btnLowerProbeHarv');
        //     clickButton('btnLowerProbeWire');
        //     clickButton('btnLowerProbeCombat');
        // }

        var rep = 0;
        var haz = 0;        
        var combat = 0;
        var speed = 1;
        var exploration = 1;
        var factory = 0;
        var nanoWire = 0;
        var acquiredMatter = 0;
        remaining -= 2;
        var random = Math.random();
        var halfRemaining = Math.floor(remaining/2);
        if (random > 0.9 && elementExists('probeCombatDisplay')){
            setTimeout(() => {
                console.log('Combat madness');
            }, 100);
            
            while (remaining > 14 && remaining > halfRemaining){
                combat++;
                remaining--;
            }
        } 
        else if (random > 0.8){
            setTimeout(() => {
                console.log('Replicate like crazy');
            }, 100);
            while (remaining > 6 && remaining > halfRemaining){
                rep++;
                haz++;
                remaining-=2;
            }
        }
        else if (random > 0.7){            
            setTimeout(() => {
                console.log('Start with equality');
            }, 100);
            
            if (remaining > 10){
                factory++;
                nanoWire++;
                acquiredMatter++;
                speed++;
                exploration++;
                rep++;
                haz++;
                combat++;
                remaining-=8;
            }
        }

        if ((<HTMLElement>document.getElementById('acquiredMatterDisplay')).innerText != "0" && getNumber('nanoWire')==0) {
            nanoWire++;
            remaining--;
        }
        if ((<HTMLElement>document.getElementById('availableMatterDisplay')).innerText != "0" && getNumber('acquiredMatterDisplay')==0) {        
            acquiredMatter++;
            remaining--;
        }
        if (getNumber('availableMatterDisplay') == 0 && remaining > 1 ) {
            var availableMatterSearch = Math.floor(remaining / 5);
            speed+=availableMatterSearch;
            exploration+=availableMatterSearch;
            remaining -= availableMatterSearch*2;
        }
        if ((<HTMLElement>document.getElementById('nanoWire')).innerText != "0" && remaining > 0) {
            factory++;
            remaining--;
        }
        if (elementExists('probeCombatDisplay') && combat === 0) {
            var combatChange = Math.floor(remaining / 3);
            combat += combatChange;
            remaining -= combatChange;
        }
        if (remaining > 30){
            rep++;
            remaining--;
            haz++;
            remaining--;
            nanoWire++;
            remaining--;
            acquiredMatter++;
            remaining--;
            factory++;
            remaining--;

        }
        while (remaining > 14) {
            rep+=2;
            remaining-=2;
            haz+=2;
            remaining-=2;
            if (rep > 5){
                speed++;
                remaining--;
                exploration++;
                remaining--;  
            }          
        }

        while (remaining > 0) {
            // Fill up other stuff
            if (remaining-- > 0) {
                rep++;
            }
            if (remaining-- > 0) {
                haz++;
            }
        }
        // setTimeout(function () {
        //     while (factory-- > 0) {
        //         clickButton('btnRaiseProbeFac');
        //     }
        //     while (rep-- > 0) {
        //         clickButton('btnRaiseProbeRep');
        //     }
        //     while (haz-- > 0) {
        //         clickButton('btnRaiseProbeHaz');
        //     }
        //     while (nanoWire-- > 0) {
        //         clickButton('btnRaiseProbeWire');
        //     }
        //     while (acquiredMatter-- > 0) {
        //         clickButton('btnRaiseProbeHarv');
        //     }
        //     while (speed-- > 0) {
        //         clickButton('btnRaiseProbeSpeed');
        //     }
        //     while (exploration-- > 0) {
        //         clickButton('btnRaiseProbeNav');
        //     }
        //     while (combat-- > 0) {
        //         clickButton('btnRaiseProbeCombat');
        //     }
        // }, 100);

        var changeProbes = function () {
            var delay = 50;
            var changeIt = function(goal : number, actualElementId : string, lowerButtonId : string, raiseButtonId : string) {
                var buttonToClick : string | null= null;
                if (goal > getNumber(actualElementId)){                    
                    buttonToClick = raiseButtonId;
                }
                else if (goal < getNumber(actualElementId)){                    
                    buttonToClick = lowerButtonId;
                }
                
                if (buttonToClick != null){
                    clickButton(buttonToClick);
                    setTimeout(() => {             
                        changeIt(goal, actualElementId, lowerButtonId, raiseButtonId);
                    }, (delay+=50));
                }
                return buttonToClick;
            }
            setTimeout(() => { changeIt(speed, "probeSpeedDisplay", "btnLowerProbeSpeed", "btnRaiseProbeSpeed"); }, delay += 25);            
            setTimeout(() => { changeIt(exploration, "probeNavDisplay", "btnLowerProbeNav", "btnRaiseProbeNav");}, delay += 25);
            setTimeout(() => { changeIt(rep, "probeRepDisplay", "btnLowerProbeRep", "btnRaiseProbeRep");}, delay += 25);
            setTimeout(() => { changeIt(haz, "probeHazDisplay", "btnLowerProbeHaz", "btnRaiseProbeHaz");}, delay += 25);
            setTimeout(() => { changeIt(factory, "probeFacDisplay", "btnLowerProbeFac", "btnRaiseProbeFac");  }, delay += 25);
            setTimeout(() => { changeIt(acquiredMatter, "probeHarvDisplay", "btnLowerProbeHarv", "btnRaiseProbeHarv");}, delay += 25);
            setTimeout(() => { changeIt(nanoWire, "probeWireDisplay", "btnLowerProbeWire", "btnRaiseProbeWire");}, delay += 25);
            setTimeout(() => { changeIt(combat, "probeCombatDisplay", "btnLowerProbeCombat", "btnRaiseProbeCombat");}, delay += 25);
            
            
        };
        // setTimeout(changeProbes, 100);
        changeProbes();

        rebalanceProbeLastRun = new Date().getTime();
    }
});

var runNextProject = function(){
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

var automation = function () {
    runNextProject();
    // var timeout = Math.random()*15000 - 10000;
    // if (timeout < 200){
    //     timeout = 200;
    // }
    var timeout = 1000;
    setTimeout(automation, timeout);
};
automation();
