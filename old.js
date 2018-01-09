var oldAutomation = function(){
    var hasMoneyForWire = (Number( document.getElementById('funds').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',','')) - (Number( document.getElementById('wireCost').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''))*1)) > 0;
    var totalClips = Number( document.getElementById('clips').innerText.replace(',','').replace(',','').replace(',','').replace(',','').replace(',',''));
    
    var unsoldClips =    Number( document.getElementById('unsoldClips').innerText.replace(',','').replace(',','').replace(',',''));
    var rateElement = document.getElementById('clipmakerRate')
    var clipMakerRate = rateElement  ?  Number(rateElement.innerText.replace(',','')) : 0;
    var autoclipper =    Number( document.getElementById('clipmakerLevel2').innerText.replace(',',''));
    var wire =  Number( document.getElementById('wire').innerText.replace(',',''));
    var averagesale = Number( document.getElementById('avgSales').innerText.replace(',',''));

    var processors  =   Number( document.getElementById('processors').innerText.replace(',',''));
    var memory =   Number( document.getElementById('memory').innerText.replace(',',''));
    if (processors < 25 && (processors < 5 || processors * 2 < memory )) {
            document.getElementById('btnAddProc').click();             
    }
    else {
            document.getElementById('btnAddMem').click();                 
    }  
    var solar = document.getElementById('btnMakeFarm');
    if (solar){
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        if (consumption * 1.5 >= production ){
            solar.click();
        }
    }
    if (document.getElementById('maxStorage')){
        if (getNumber('maxStorage') < 10000000){
            document.getElementById('btnMakeBattery').click();
        }
    }
    if (document.getElementById('btnMakeFactory')){
        clickButton('btnMakeFactory');
    }
    if (document.getElementById('nanoWire')){
    
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        var factoryLevel = getNumber('factoryLevelDisplay');
        var droneLevel = getNumber('wireDroneLevelDisplay');
        
        if (consumption <= production && factoryLevel * 50 > droneLevel){
            clickButton('btnMakeWireDrone');
        }
    }
    if (document.getElementById('btnMakeHarvester')){
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        var matter = getNumber('acquiredMatterDisplay');
        var factoryLevel = getNumber('factoryLevelDisplay');
        var harvesterLevel = getNumber('harvesterLevelDisplay');
        
        if (consumption <= production && factoryLevel * 50 > harvesterLevel){
            clickButton('btnMakeHarvester');
        }
    }
    // Delay between 1 second and 25 seconds. Make 1 second much more likely.
    var timeInMs = (Math.random() * 45000 ) - 20000;
    if (timeInMs < 1000){
        timeInMs = 1000;
    }
    console.log(timeInMs);
    setTimeout(automation,  timeInMs )
};
