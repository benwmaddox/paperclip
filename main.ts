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
        return wire < 1500 && buttonEnabled('btnBuyWire') && !elementExists('btnToggleWireBuyer');
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
        return wire > 1500 && marketingCost < funds && buttonEnabled('btnExpandMarketing') && (getNumber('marketingLvl') < 15 || getNumber('margin') < 0.04);
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
        return rateElement && totalClips > 800 && (clipMakerRate+1) * 30 < unsoldClips && unsoldClips > 1000 && averagesale - clipMakerRate < 0  && buttonEnabled('btnLowerPrice');
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
        return rateElement && (totalClips > 800 && ((clipMakerRate+1) * 10 > unsoldClips && averagesale - clipMakerRate > 0) || (totalClips > 1800  && unsoldClips < 1000))   && buttonEnabled('btnRaisePrice');
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
            if (buttonEnabled(projectButtons[i].id)){
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
        var unsoldClips= getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        var projectButtons  =  document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++){
            if (buttonEnabled(projectButtons[i].id)){
                return true;
            }
        }
        return elementExists('btnMakeClipper') && buttonEnabled('btnMakeClipper') && getNumber('clipmakerLevel2') - 10  < getNumber('marketingLvl') * 10 && wire > 1000  && getNumber('clipmakerLevel2')  < 150 && getNumber('margin') > 0.02;
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
        var totalClips = getNumber('clips');
        var unsoldClips= getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        var projectButtons  =  document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++){
            if (buttonEnabled(projectButtons[i].id)){
                return true;
            }
        }
        return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('megaClipperLevel')  < getNumber('marketingLvl') * 8 && wire > 1500 && getNumber('megaClipperLevel')  < 150 && getNumber('margin') > 0.02;
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
        if (processors < 25 && (processors < 5 || processors * 3 < memory )) {
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
        return elementExists('btnImproveInvestments') && buttonEnabled('btnImproveInvestments') && getNumber('investmentLevel') < 8;
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
        return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw')  && (now - lastWithdrawTime > 60000)
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
        return elementExists('investmentEngineUpgrade') && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament') && yomi < operation && trust >= 23;
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

class Cost {
    ops : number = 0;
    trust : number = 0;
    yomi : number = 0;
    creat : number = 0;
}
var findCostsForProjects  = function(): Cost[]{
    var projectButtons = document.getElementsByClassName("projectButton");
    var results : Cost[] = [];
    for (var i =0; i < projectButtons.length;i++){
        var innerText : string = (<HTMLButtonElement>projectButtons[i]).innerText;
        var costText = innerText.substring(innerText.indexOf("(")+1, innerText.indexOf(")"))
        var split = costText.split(", ");
        var cost = new Cost();
        results.push(cost);
        for (var j =0; j < split.length; j++){
            var item = split[j].trim();
            var valueAndType = item.split(" ");
            var value  : number = Number(valueAndType[0].replace(",","").replace(",","").replace(",","").replace(",",""));
            if (valueAndType[1] === "ops"){
                cost.ops = value;
            }
            if (valueAndType[1] === "Trust"){
                cost.trust = value;
            }
            if (valueAndType[1] === "yomi"){
                cost.yomi = value;
            }
            if (valueAndType[1] === "creat"){
                cost.creat = value;
            }
        }
    }
    return results;
} 

var sumCosts = function(costs : Cost[]){
    var sum : Cost = new Cost();
    for(var i = 0;i < costs.length; i++){
        sum.creat += costs[i].creat || 0;
        sum.ops += costs[i].ops || 0;
        sum.trust += costs[i].trust || 0;
        sum.yomi += costs[i].yomi || 0;
    }
    return sum;
}

// Find next of each number that is beyond what user currently has. Use that as a goal