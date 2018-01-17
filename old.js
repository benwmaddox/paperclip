
var automation = function(){
    document.getElementById('btnMakePaperclip').click()
    var hasMoneyForWire = (Number( document.getElementById('funds').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','')) - (Number( document.getElementById('wireCost').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''))*1)) > 0;
    var totalClips = Number( document.getElementById('clips').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''));
    if (totalClips < 800) {
            document.getElementById('btnMakePaperclip').click();            
            document.getElementById('btnMakePaperclip').click()
            document.getElementById('btnMakePaperclip').click();            
            document.getElementById('btnMakePaperclip').click()
            document.getElementById('btnMakePaperclip').click();            
            document.getElementById('btnMakePaperclip').click()
            document.getElementById('btnMakePaperclip').click();            
            document.getElementById('btnMakePaperclip').click()
    }
    function getNumber(elementId){
        return Number( document.getElementById(elementId).innerText.replace(',','').replace(',','').replace(',',''))
    }
    function clickButton(elementId){    
            document.getElementById(elementId).click()
    }
    var unsoldClips =    Number( document.getElementById('unsoldClips').innerText.replace(',','').replace(',','').replace(',',''));
    var rateElement = document.getElementById('clipmakerRate')
    var clipMakerRate = rateElement  ?  Number(rateElement.innerText.replace(',','')) : 0;
    var autoclipper =    Number( document.getElementById('clipmakerLevel2').innerText.replace(',',''));
    var wire =  Number( document.getElementById('wire').innerText.replace(',',''));
    var averagesale = Number( document.getElementById('avgSales').innerText.replace(',',''));
    if (rateElement && totalClips > 800 && (clipMakerRate+1) * 30 < unsoldClips && unsoldClips > 500) {  
        if (averagesale - clipMakerRate < 0){        
            document.getElementById('btnLowerPrice').click()            
        }
    }
    else if (rateElement && totalClips > 800 &&  (clipMakerRate+1) * 10 > unsoldClips) {
        if (averagesale - clipMakerRate > 0 || unsoldClips < 500 ){        
            document.getElementById('btnRaisePrice').click()
        }
    }
    if (wire < 1500){
        document.getElementById('btnBuyWire').click();
    }       
    else if (hasMoneyForWire || getNumber('clipmakerLevel2') <= 20) {    
            if (getNumber('marketingLvl') < 15){         
                document.getElementById('btnExpandMarketing').click();
            }
            if (getNumber('clipmakerLevel2') < 100 && getNumber('clipmakerLevel2') - 10 < getNumber('marketingLvl') * 10) {
                document.getElementById('btnMakeClipper').click();
            }           
            if (document.getElementById('btnMakeMegaClipper') && getNumber('megaClipperLevel') < 70){
                   document.getElementById('btnMakeMegaClipper').click();
            }
    }
    var projectButtons=   document.getElementsByClassName('projectButton')
    for (var i = 0; i <projectButtons.length; i++){
        if (projectButtons[i].disabled == false) {
            projectButtons[i].click();
            break;
        }
    }
    var processors  =   Number( document.getElementById('processors').innerText.replace(',',''));
    var memory =   Number( document.getElementById('memory').innerText.replace(',',''));
    if ((processors < 25 || memory > 100) && (processors < 5 || processors * 2 < memory )) {
            document.getElementById('btnAddProc').click();             
    }
    else {
            document.getElementById('btnAddMem').click();                 
    }   
    if (document.getElementById('stratPicker') && document.getElementById('stratPicker').selectedIndex < document.getElementById('stratPicker').length -1){
            document.getElementById('stratPicker').selectedIndex = document.getElementById('stratPicker').length -1;
    }
    if (document.getElementById('investStrat')  && document.getElementById('investStrat').selectedIndex != 1){
        document.getElementById('investStrat').selectedIndex = 1
    }
    
    var trust = getNumber('trust');
    if (document.getElementById('yomiDisplay') && document.getElementById('tournamentManagement').style.display !== 'none'){
        var yomi = getNumber('yomiDisplay');          
        var operation = getNumber('operations');    
        if (yomi < operation && trust >= 23){        
            document.getElementById('btnNewTournament').click();
            document.getElementById('btnRunTournament').click();
           
        }
    }
    if (document.getElementById('btnInvest') && document.getElementById('strategyEngine').style.display != 'none'){        
         if (getNumber('investmentLevel') < 8)  { 
            clickButton('btnImproveInvestments');
        }
        if (document.getElementById('investmentEngineUpgrade').style.display !== 'none' && getNumber('investmentLevel') > 0 &&  (trust < 95 && wire > 2000 && getNumber('portValue') < 128000000 && trust > 16 ) || ( trust > 29 && trust < 32)) {
            clickButton('btnInvest');
        }
        else if (getNumber('portValue') > 128000000) {
            clickButton('btnWithdraw');
        }
    }
    var solar = document.getElementById('btnMakeFarm');
    if (solar){
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        if (consumption * 1.1 >= production ){
            solar.click();
            clickButton('btnFarmx100');
        }
    }
    if (document.getElementById('maxStorage')){
        if (getNumber('maxStorage') < 1000000 && getNumber('maxStorage') == getNumber('storedPower')){
            document.getElementById('btnMakeBattery').click();
        }
        else if (getNumber('maxStorage') < 10000000 && getNumber('maxStorage') == getNumber('storedPower') && getNumber('factoryLevelDisplay') >= 50){
            document.getElementById('btnMakeBattery').click();
        }
    }
    if (document.getElementById('btnMakeFactory') && getNumber('factoryLevelDisplay') < 175){
        clickButton('btnMakeFactory');
    }
    if (document.getElementById('nanoWire')){    
    
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        var factoryLevel = getNumber('factoryLevelDisplay');
        var droneLevel = getNumber('wireDroneLevelDisplay');
        
        if (consumption <= production && factoryLevel * factoryLevel * 5 > droneLevel -1 && droneLevel < 25000){
            clickButton('btnMakeWireDrone');
            if (droneLevel < 24000) {
                clickButton('btnWireDronex1000');
            }
        }
    }
    if (document.getElementById('btnMakeHarvester')){
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        var matter = getNumber('acquiredMatterDisplay');
        var factoryLevel = getNumber('factoryLevelDisplay');
        var harvesterLevel = getNumber('harvesterLevelDisplay');
        
        if (consumption <= production && factoryLevel * factoryLevel * 5 > harvesterLevel -1 && harvesterLevel< 25000){
            clickButton('btnMakeHarvester');
            if (harvesterLevel< 24000) {
                clickButton('btnHarvesterx1000');
        }
        }
    }
    var qChipItems =   document.getElementsByClassName('qChip')
    var totalOpacity = 0;
    for (var i = 0; i < qChipItems.length; i++){ 
            totalOpacity +=Number( qChipItems[i].style.opacity);
    }
    if (totalOpacity > 0.2){
        for (var i = 0; i < 10; i++) {
            setTimeout(function(){  clickButton('btnQcompute'); }, i * 33);

    }
    }

    // Delay between 1 second and 25 seconds. Make 1 second much more likely.
    var timeInMs = (Math.random() * 125000 ) - 100000;
    if (timeInMs < 1000){
        timeInMs = 1000;
    }
    //console.log(timeInMs);
    //setTimeout(automation,  timeInMs )

    if (Math.random() < 0.997){
        setTimeout(automation,  1000)
    }
    else {
        var ms = Math.random() * 300000; // Take 5
        setTimeout(automation, ms)
        console.log(new Date().toLocaleString() + ' | Take 5');
    }
};
automation();
