function clickButton(elementId: string){    
    var element = document.getElementById(elementId);
    if (element){
        element.click();
    }            
}
function getNumber(elementId : string){
    var element = document.getElementById(elementId);
    if (!element){
        return 0;
    }
    return Number( element.innerText.replace(',','').replace(',','').replace(',',''))
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
        return totalClips < 1500  && buttonEnabled('btnMakePaperclip') && (now - initialClipLastRun > 10000);
    },
    priority: projectPriority.Lowest,
    run: () => {
        initialClipLastRun = new Date().getTime();
        for (var i = 0; i < 50; i++){
            setTimeout(() => {                
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
            }, 300*i);
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
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        return elementExists('avgSales') && rateElement && (totalClips > 800 && ((clipMakerRate+1) * 10 > unsoldClips && averagesale - clipMakerRate > 0) || (totalClips > 1800  && unsoldClips < 1000))   && buttonEnabled('btnRaisePrice');
    },
    priority: projectPriority.Low,
    run: () => {
        clickButton('btnRaisePrice');
    }
})
var marketLoadTest : number = new Date().getTime() - 120000;
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
// run projects
projectList.push({
    name: 'Run projects',
    canRun: () => {
        var projectButtons  =  document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++){
            // Force creativity use too
            if (elementExists(projectButtons[i].id) && buttonEnabled(projectButtons[i].id) && (getNumber('memory') < 10 || getNumber('creativity') > getNumber('trust') * 10) ){
                return true;
            }
        }
        return false;
    },
    priority: projectPriority.Highest,
    run: () => {        
        var projectButtons  =  document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++){
            if (buttonEnabled(projectButtons[i].id)){
                clickButton(projectButtons[i].id)
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
        var processors  = getNumber('processors');
        var memory =getNumber('memory') ;
        if ((processors < 5 || processors * 3 < memory || memory > 300)) {
            clickButton('btnAddProc');
        }
        else {
            clickButton('btnAddMem');
        }   
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
var lastWithdrawTime : number = (new Date()).getTime();
var minimumWithdrawAmount : number = 250000;
projectList.push({
    name: 'Withdraw',
    canRun: () => {
        var trust = getNumber('trust');
        var now : number = (new Date()).getTime();
        return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw')  && (now - lastWithdrawTime > 30000)
        && trust > 30 && getNumber('investmentBankroll') > minimumWithdrawAmount && getNumber('portValue') > getNumber('investmentBankroll') * 2;
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
        return elementExists('investmentEngineUpgrade') && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament') && (yomi < operation / 2) && trust >= 22 && getNumber('maxOps') === getNumber('operations');
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
    name: 'Make Solar',
    canRun: () => {        
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnMakeFarm') && consumption * 1.2 >= production && buttonEnabled('btnMakeFarm') ;
    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnMakeFarm');
    }
})
projectList.push({
    name: 'Make Solar X 100',
    canRun: () => {        
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnFarmx100') && consumption * 1.2 >= production && buttonEnabled('btnFarmx100') ;
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnFarmx100');
    }
})
projectList.push({
    name: 'Make Battery Storage',
    canRun: () => {        
        return elementExists('btnMakeBattery') && buttonEnabled('btnMakeBattery') && getNumber('maxStorage') < 10000000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnMakeBattery');
    }
})
projectList.push({
    name: 'Make Battery Storage X 10',
    canRun: () => {        
        return elementExists('btnBatteryx10') && buttonEnabled('btnBatteryx10') && getNumber('maxStorage') < 9900000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnBatteryx10');
    }
})
projectList.push({
    name: 'Make Battery Storage X 100',
    canRun: () => {        
        return elementExists('btnBatteryx100') && buttonEnabled('btnBatteryx100') && getNumber('maxStorage') < 9000000 && getNumber('maxStorage') == getNumber('storedPower');        
    },
    priority: projectPriority.High,
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
     (getNumber('powerConsumptionRate') * 1.1 <= getNumber('powerProductionRate'))    ;
}
projectList.push({
    name: 'Make Factory',
    canRun: () => {        
        return (productionWorking() || getNumber('factoryLevelDisplay')==0) && elementExists('btnMakeFactory') && buttonEnabled('btnMakeFactory') && getNumber('factoryLevelDisplay') < 200;        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnMakeFactory');
    }
})

projectList.push({
    name: 'Make Harvester',
    canRun: () => {        
        return (productionWorking() || getNumber('harvesterLevelDisplay')==0) && elementExists('btnMakeHarvester') && buttonEnabled('btnMakeHarvester') && getNumber('harvesterLevelDisplay') < 25000
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
    name: 'Make Wire Drone',
    canRun: () => {        
        return  (productionWorking() || getNumber('wireDroneLevelDisplay')==0) && elementExists('btnMakeWireDrone') && buttonEnabled('btnMakeWireDrone') && getNumber('wireDroneLevelDisplay') < 25000
        && (getNumber('wireDroneLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
        && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20)
        ;        
    },
    priority: projectPriority.Low,
    run: () => {    
        clickButton('btnMakeWireDrone');
    }
})

projectList.push({
    name: 'Make Harvester X 1000',
    canRun: () => {        
        return elementExists('btnHarvesterx1000') && buttonEnabled('btnHarvesterx1000') && getNumber('harvesterLevelDisplay') < 24000;        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnHarvesterx1000');
    }
})
projectList.push({
    name: 'Make Wire Drone X 1000',
    canRun: () => {        
        return elementExists('btnWireDronex1000') && buttonEnabled('btnWireDronex1000') && getNumber('wireDroneLevelDisplay') < 24000;        
    },
    priority: projectPriority.Medium,
    run: () => {    
        clickButton('btnWireDronex1000');
    }
})




// Space

projectList.push({
    name: 'Make Probe',
    canRun: () => {
        return elementExists('btnMakeProbe') && getNumber('probesLaunchedDisplay') < 100;
    },
    priority: projectPriority.Lowest,
    run: () => {    
        clickButton('btnMakeProbe');
    }
})

projectList.push({
    name: 'Rebalance Probes',
    canRun: function() {
        return elementExists('probeTrustUsedDisplay') && getNumber('probeTrustUsedDisplay') == getNumber('probeTrustDisplay')
    },
    priority: projectPriority.Lowest,
    run: function() {    
        if (!elementExists('nanoWire')){
            return false;
        }
        
        var remaining = getNumber('probeTrustDisplay');
        //probeCombatDisplay
        for (var i = 0; i < remaining; i++){
            clickButton('btnLowerProbeSpeed');        
            clickButton('btnLowerProbeNav');  
            clickButton('btnLowerProbeRep');  
            clickButton('btnLowerProbeHaz');  
            clickButton('btnLowerProbeFac');  
            clickButton('btnLowerProbeHarv');            
            clickButton('btnLowerProbeWire');         
            clickButton('btnLowerProbeCombat');
        }
        var nanoWire = 0;
        if (getNumber('nanoWire') == 0 || getNumber('acquiredMatterDisplay') > getNumber('nanoWire')){
            nanoWire++;
            remaining--;
        }
        var acquiredMatter = 0;
        if (getNumber('acquiredMatterDisplay') == 0 || getNumber('availableMatterDisplay') > getNumber('acquiredMatterDisplay')){
            acquiredMatter++;
            remaining--;
        }    
        var speed= 0;
        var exploration= 0;
        if (getNumber('availableMatterDisplay') == 0 && remaining > 1){
            speed++;        
            exploration++;
            remaining -= 2;
        }
        
        var combat = 0;
        if (elementExists('probeCombatDisplay')){
            var combatChange = remaining / 4;
            combat = combatChange;
            remaining -= combatChange;
        }
        while (remaining > 0){
            // Fill up other stuff
            remaining--;
        }
        
        while (nanoWire-- > 0){          
            clickButton('btnRaiseProbeWire');
        }
        while (acquiredMatter-- > 0){          
            clickButton('btnRaiseProbeHarv');
        }
        while (speed-- > 0){          
            clickButton('btnRaiseProbeSpeed');
        }        
        while (exploration-- > 0){          
            clickButton('btnRaiseProbeNav');
        }
        while (combat-- > 0){          
            clickButton('btnRaiseProbeCombat');
        }
    }
})


var runNextProject = function(){
    var enumsToLoop = [projectPriority.Highest, projectPriority.High, projectPriority.Medium, projectPriority.Low, projectPriority.Lowest]
    for(var i = 0; i < enumsToLoop.length; i++){
        for (var j = 0; j < projectList.length; j++){
            if (projectList[j].priority == enumsToLoop[i] &&
                projectList[j].canRun()){
                    projectList[j].run();
                    console.log((new Date()).toLocaleString() + "  |  " +projectList[j].name )
                    return;
                }
        }
    }
    
}
var automation = function(){
    runNextProject();
    setTimeout(automation,  1000)
}
automation();



