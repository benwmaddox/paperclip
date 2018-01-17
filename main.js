"use strict";
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
};
function clickButton(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.click();
        positionIndicator(element);
    }
}
function getNumber(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        return 0;
    }
    return Number(element.innerText.replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', ''));
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
projectList.push({
    name: "Initial clip clicks",
    canRun: function () {
        var totalClips = getNumber('clips');
        var now = new Date().getTime();
        return totalClips < 5000 && buttonEnabled('btnMakePaperclip') && (now - initialClipLastRun > 10000);
    },
    priority: projectPriority.Lowest,
    run: function () {
        initialClipLastRun = new Date().getTime();
        for (var i = 0; i < 250; i++) {
            setTimeout(function () {
                clickButton('btnMakePaperclip');
            }, 60 * i);
        }
    }
});
//
projectList.push({
    name: 'Buy wire when low',
    canRun: function () {
        var wire = getNumber('wire');
        return wire < 1500 && buttonEnabled('btnBuyWire') && !elementExists('btnToggleWireBuyer') && elementExists('btnBuyWire');
    },
    priority: projectPriority.Highest,
    run: function () {
        clickButton('btnBuyWire');
    }
});
// Marketing
projectList.push({
    name: 'Marketing upgrade',
    canRun: function () {
        var wire = getNumber('wire');
        var marketingCost = getNumber('adCost');
        var funds = getNumber('funds');
        return wire > 1500 && marketingCost < funds && buttonEnabled('btnExpandMarketing') && (getNumber('marketingLvl') < 17 || getNumber('margin') < 0.05);
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnExpandMarketing');
    }
});
//
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
// Adjust price higher
projectList.push({
    name: 'Adjust price higher',
    canRun: function () {
        var totalClips = getNumber('clips');
        var unsoldClips = getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var rateElement = elementExists('clipmakerRate');
        return elementExists('avgSales') && getNumber('avgSales') > 0 && rateElement && (totalClips > 800 && ((clipMakerRate + 1) * 10 > unsoldClips && getNumber('avgSales') - clipMakerRate > 0) || (totalClips > 1800 && unsoldClips < 1000)) && buttonEnabled('btnRaisePrice');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnRaisePrice');
    }
});
var lowerPriceTime = new Date().getTime() - 120000;
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
var marketLoadTest = new Date().getTime() - 300000;
// Adjust price higher
projectList.push({
    name: 'Increasing prices to check market load',
    canRun: function () {
        return elementExists('btnRaisePrice') && (new Date()).getTime() - marketLoadTest > 300000 && getNumber('clips') > 10000 && getNumber('unsoldClips') < 10 + getNumber('clipmakerRate') * 5;
    },
    priority: projectPriority.Low,
    run: function () {
        marketLoadTest = new Date().getTime();
        for (var i = 0; i < 10; i++) {
            setTimeout(function () {
                clickButton('btnRaisePrice');
            }, 4100);
        }
    }
});
var boostedCreativity = true;
var boostedCreativityTime = new Date().getTime() - 90000;
projectList.push({
    name: 'Force minimum creativity for harder to get projects',
    canRun: function () {
        return elementExists('creativity') && elementExists('processors') && getNumber('processors') >= 5 && boostedCreativity == true && getNumber('creativity') < getNumber('processors') * 40 && (new Date().getTime() - boostedCreativityTime > 120000);
    },
    priority: projectPriority.Highest,
    run: function () {
        boostedCreativity = false;
        boostedCreativityTime = new Date().getTime();
    }
});
projectList.push({
    name: 'Minimum creativity goal met',
    canRun: function () {
        // Force creativity use too
        return boostedCreativity == false && ((getNumber('creativity') > getNumber('processors') * 40) || !elementExists('processors'));
    },
    priority: projectPriority.Highest,
    run: function () {
        boostedCreativity = true;
        boostedCreativityTime = new Date().getTime();
    }
});
// run projects
projectList.push({
    name: 'Run projects',
    canRun: function () {
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (elementExists(projectButtons[i].id) && buttonEnabled(projectButtons[i].id) && (getNumber('processors') < 5 || boostedCreativity)) {
                return true;
            }
        }
        return false;
    },
    priority: projectPriority.Highest,
    run: function () {
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (buttonEnabled(projectButtons[i].id)) {
                var textContent = projectButtons[i].childNodes[0].textContent;
                setTimeout(function () {
                    console.log(textContent);
                }, 10);
                clickButton(projectButtons[i].id);
                return;
            }
        }
    }
});
// buy autoclipper
projectList.push({
    name: 'Buy autoclipper',
    canRun: function () {
        var totalClips = getNumber('clips');
        var wire = getNumber('wire');
        return elementExists('btnMakeClipper') && buttonEnabled('btnMakeClipper') && getNumber('clipmakerLevel2') - 10 < getNumber('marketingLvl') * 10 && wire > 1000 && getNumber('clipmakerLevel2') < 130 && getNumber('margin') > 0.02
            && (getNumber('avgRev') * 10 > getNumber('clipperCost') - 1000);
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnMakeClipper');
    }
});
// buy mega clippers
projectList.push({
    name: 'Buy mega clippers',
    canRun: function () {
        var wire = getNumber('wire');
        return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('megaClipperLevel') < getNumber('marketingLvl') * 8 && wire > 1500 && getNumber('megaClipperLevel') < 105 && getNumber('margin') > 0.02
            && (getNumber('avgRev') * 10 > getNumber('megaClipperCost') - 1000);
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnMakeMegaClipper');
    }
});
// upgrade computational resources
projectList.push({
    name: 'Upgrade computational resources',
    canRun: function () {
        return elementExists('btnAddProc') && buttonEnabled('btnAddProc');
    },
    priority: projectPriority.Medium,
    run: function () {
        var processors = getNumber('processors');
        var memory = getNumber('memory');
        if ((processors < 5 ||
            (memory < 150 && processors * 3 < memory) ||
            (memory > 150 && processors < memory) ||
            memory > 300)) {
            clickButton('btnAddProc');
        }
        else {
            clickButton('btnAddMem');
        }
    }
});
projectList.push({
    name: 'Set investments to medium risk',
    canRun: function () {
        return elementExists('investStrat') && document.getElementById('investStrat').selectedIndex != 1;
    },
    priority: projectPriority.Medium,
    run: function () {
        document.getElementById('investStrat').selectedIndex = 1;
    }
});
projectList.push({
    name: 'Improve investments',
    canRun: function () {
        return elementExists('btnImproveInvestments') && buttonEnabled('btnImproveInvestments') && getNumber('investmentLevel') < 11;
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnImproveInvestments');
    }
});
projectList.push({
    name: 'Quantum Computing Click',
    canRun: function () {
        var qChipItems = document.getElementsByClassName('qChip');
        var totalOpacity = 0;
        for (var i = 0; i < qChipItems.length; i++) {
            totalOpacity += Number(qChipItems[i].style.opacity);
        }
        return totalOpacity > 0.2 && getNumber('operations') < getNumber('maxOps');
    },
    priority: projectPriority.High,
    run: function () {
        for (var i = 0; i < 10; i++) {
            setTimeout(function () { clickButton('btnQcompute'); }, i * 33);
        }
    }
});
var lastDepositTime = (new Date()).getTime() - 100000;
projectList.push({
    name: 'Deposit',
    canRun: function () {
        var trust = getNumber('trust');
        var now = (new Date()).getTime();
        return elementExists('investmentEngine') && elementExists('btnInvest') != null && buttonEnabled('btnInvest') && (trust < 95 || (trust > 29 && trust < 32)) && (now - lastDepositTime > 30000) && getNumber('investmentLevel') > 0;
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnInvest');
        lastDepositTime = (new Date()).getTime();
    }
});
var lastSliderTime = (new Date()).getTime() - 90000;
projectList.push({
    name: 'Set slider somewhere near the middle',
    canRun: function () {
        return elementExists('slider') && (new Date().getTime() - lastSliderTime > 90000);
    },
    priority: projectPriority.High,
    run: function () {
        var slider = document.getElementById('slider');
        var random = ((Math.random() * 0.5) * Number(slider.max)) + Number(slider.max) * 0.25;
        slider.value = random.toString();
        lastSliderTime = (new Date()).getTime();
    }
});
var lastWithdrawTime = (new Date()).getTime();
var minimumWithdrawAmount = 250000;
projectList.push({
    name: 'Withdraw',
    canRun: function () {
        var trust = getNumber('trust');
        var now = (new Date()).getTime();
        return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw') && (now - lastWithdrawTime > 30000)
            && trust > 30 && ((getNumber('investmentBankroll') > minimumWithdrawAmount && getNumber('portValue') > getNumber('investmentBankroll') * 2) ||
            (getNumber('clips') > 300000000 && getNumber('investmentBankroll') > 0));
    },
    priority: projectPriority.Lowest,
    run: function () {
        lastWithdrawTime = (new Date()).getTime();
        minimumWithdrawAmount = minimumWithdrawAmount * 2;
        clickButton('btnWithdraw');
    }
});
projectList.push({
    name: 'Set strategic modeling to last model.',
    canRun: function () {
        return elementExists('stratPicker') && document.getElementById('stratPicker').selectedIndex != document.getElementById('stratPicker').length - 1;
    },
    priority: projectPriority.Medium,
    run: function () {
        document.getElementById('stratPicker').selectedIndex = document.getElementById('stratPicker').length - 1;
    }
});
projectList.push({
    name: 'Run tournament',
    canRun: function () {
        var yomi = getNumber('yomiDisplay');
        var operation = getNumber('operations');
        var trust = getNumber('trust');
        return boostedCreativity === true && (elementExists('investmentEngineUpgrade') || elementExists('tournamentManagement')) && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament') && (yomi < operation / 2) && getNumber('maxOps') === getNumber('operations');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnNewTournament');
        setTimeout(function () {
            clickButton('btnRunTournament');
        }, 500);
        document.getElementById('stratPicker').selectedIndex = document.getElementById('stratPicker').length - 1;
    }
});
// Level 2
projectList.push({
    name: 'Entertain the Swarm',
    canRun: function () {
        return elementExists('btnEntertainSwarm') && buttonEnabled('btnEntertainSwarm');
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnEntertainSwarm');
    }
});
projectList.push({
    name: 'Make Solar',
    canRun: function () {
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnMakeFarm') && consumption * 1.2 >= production && buttonEnabled('btnMakeFarm');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnMakeFarm');
    }
});
projectList.push({
    name: 'Make Solar X 100',
    canRun: function () {
        var consumption = getNumber('powerConsumptionRate');
        var production = getNumber('powerProductionRate');
        return elementExists('btnFarmx100') && consumption * 1.2 >= production && buttonEnabled('btnFarmx100');
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnFarmx100');
    }
});
projectList.push({
    name: 'Make Battery Storage',
    canRun: function () {
        return elementExists('btnMakeBattery') && buttonEnabled('btnMakeBattery') && getNumber('maxStorage') < 10000000 && getNumber('maxStorage') == getNumber('storedPower');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnMakeBattery');
    }
});
projectList.push({
    name: 'Make Battery Storage X 10',
    canRun: function () {
        return elementExists('btnBatteryx10') && buttonEnabled('btnBatteryx10') && getNumber('maxStorage') < 9900000 && getNumber('maxStorage') == getNumber('storedPower');
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnBatteryx10');
    }
});
projectList.push({
    name: 'Make Battery Storage X 100',
    canRun: function () {
        return elementExists('btnBatteryx100') && buttonEnabled('btnBatteryx100') && getNumber('maxStorage') < 9000000 && getNumber('maxStorage') == getNumber('storedPower');
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnBatteryx100');
    }
});
var productionWorking = function () {
    return getNumber('harvesterLevelDisplay') > 0 &&
        getNumber('wireDroneLevelDisplay') > 0 &&
        getNumber('factoryLevelDisplay') > 0 &&
        getNumber('farmLevel') > 0 &&
        getNumber('batteryLevel') > 0 &&
        (getNumber('powerConsumptionRate') * 1.1 <= getNumber('powerProductionRate'));
};
projectList.push({
    name: 'Make Factory',
    canRun: function () {
        return (productionWorking() || getNumber('factoryLevelDisplay') == 0) && elementExists('btnMakeFactory') && buttonEnabled('btnMakeFactory') && getNumber('factoryLevelDisplay') < 200;
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnMakeFactory');
    }
});
projectList.push({
    name: 'Make Wire Drone',
    canRun: function () {
        return (productionWorking() || getNumber('wireDroneLevelDisplay') == 0) && elementExists('btnMakeWireDrone') && buttonEnabled('btnMakeWireDrone') && getNumber('wireDroneLevelDisplay') < 26000
            && (getNumber('wireDroneLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
            && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnMakeWireDrone');
    }
});
projectList.push({
    name: 'Make Harvester',
    canRun: function () {
        return (productionWorking() || getNumber('harvesterLevelDisplay') == 0) && elementExists('btnMakeHarvester') && buttonEnabled('btnMakeHarvester') && getNumber('harvesterLevelDisplay') < 24000
            && (getNumber('harvesterLevelDisplay') < 250 || getNumber('factoryLevelDisplay') > 10)
            && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnMakeHarvester');
    }
});
projectList.push({
    name: 'Make Harvester X 100',
    canRun: function () {
        return elementExists('btnHarvesterx100') && buttonEnabled('btnHarvesterx100') && getNumber('harvesterLevelDisplay') < 23900 && getNumber('harvesterLevelDisplay') > 300
            && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnHarvesterx100');
    }
});
projectList.push({
    name: 'Make Wire Drone X 100',
    canRun: function () {
        return elementExists('btnWireDronex100') && buttonEnabled('btnWireDronex100') && getNumber('wireDroneLevelDisplay') < 25900 && getNumber('wireDroneLevelDisplay') > 300
            && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnWireDronex100');
    }
});
projectList.push({
    name: 'Make Harvester X 1000',
    canRun: function () {
        return elementExists('btnHarvesterx1000') && buttonEnabled('btnHarvesterx1000') && getNumber('harvesterLevelDisplay') < 23000 && getNumber('harvesterLevelDisplay') > 1000
            && (getNumber('harvesterLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnHarvesterx1000');
    }
});
projectList.push({
    name: 'Make Wire Drone X 1000',
    canRun: function () {
        return elementExists('btnWireDronex1000') && buttonEnabled('btnWireDronex1000') && getNumber('wireDroneLevelDisplay') < 24000 && getNumber('wireDroneLevelDisplay') > 1000
            && (getNumber('wireDroneLevelDisplay') < 2500 || getNumber('factoryLevelDisplay') > 20);
    },
    priority: projectPriority.Medium,
    run: function () {
        clickButton('btnWireDronex1000');
    }
});
projectList.push({
    name: 'Disassembling Factories, Harvester Drones, Wire Drones',
    canRun: function () {
        return elementExists('btnFactoryReboot') && buttonEnabled('btnFactoryReboot') && getNumber('availableMatterDisplay') == 0 && getNumber('acquiredMatterDisplay') == 0
            && getNumber('nanoWire') == 0 && getNumber('operations') > 120000;
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnFactoryReboot');
        clickButton('btnHarvesterReboot');
        clickButton('btnWireDroneReboot');
    }
});
// Space
projectList.push({
    name: 'Increase Probe Trust',
    canRun: function () {
        return elementExists('btnIncreaseProbeTrust') && buttonEnabled('btnIncreaseProbeTrust');
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnIncreaseProbeTrust');
    }
});
projectList.push({
    name: 'Make Probe',
    canRun: function () {
        return elementExists('btnMakeProbe') && getNumber('probesTotalDisplay') < 1000;
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnMakeProbe');
    }
});
projectList.push({
    name: 'Sync Swarm',
    canRun: function () {
        return elementExists('btnSynchSwarm') && buttonEnabled('btnSynchSwarm');
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnSynchSwarm');
    }
});
projectList.push({
    name: 'Increase Max Trust',
    canRun: function () {
        return elementExists('btnIncreaseMaxTrust') && buttonEnabled('btnIncreaseMaxTrust');
    },
    priority: projectPriority.High,
    run: function () {
        clickButton('btnIncreaseMaxTrust');
    }
});
var rebalanceProbeLastRun = new Date().getTime() - 60000;
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
        for (var i = 0; i < remaining; i++) {
            clickButton('btnLowerProbeSpeed');
            clickButton('btnLowerProbeNav');
            clickButton('btnLowerProbeRep');
            clickButton('btnLowerProbeHaz');
            clickButton('btnLowerProbeFac');
            clickButton('btnLowerProbeHarv');
            clickButton('btnLowerProbeWire');
            clickButton('btnLowerProbeCombat');
        }
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
        var halfRemaining = Math.floor(remaining / 2);
        if (random > 0.9 && elementExists('probeCombatDisplay')) {
            setTimeout(function () {
                console.log('Combat madness');
            }, 100);
            while (remaining > 14 && remaining > halfRemaining) {
                combat++;
                remaining--;
            }
        }
        else if (random > 0.8) {
            setTimeout(function () {
                console.log('Replicate like crazy');
            }, 100);
            while (remaining > 6 && remaining > halfRemaining) {
                rep++;
                haz++;
                remaining -= 2;
            }
        }
        else if (random > 0.7) {
            setTimeout(function () {
                console.log('Where no man has gone before');
            }, 100);
            while (remaining > 10 && remaining > halfRemaining) {
                speed++;
                exploration++;
                remaining -= 2;
            }
        }
        else if (random > 0.6) {
            setTimeout(function () {
                console.log('Start with equality');
            }, 100);
            while (remaining > 10 && remaining > halfRemaining) {
                factory++;
                nanoWire++;
                acquiredMatter++;
                speed++;
                exploration++;
                rep++;
                haz++;
                combat++;
                remaining -= 8;
            }
        }
        if (document.getElementById('acquiredMatterDisplay').innerText != "0" && getNumber('nanoWire') == 0) {
            nanoWire++;
            remaining--;
        }
        if (document.getElementById('availableMatterDisplay').innerText != "0" && getNumber('acquiredMatterDisplay') == 0) {
            acquiredMatter++;
            remaining--;
        }
        if (getNumber('availableMatterDisplay') == 0 && remaining > 1) {
            var availableMatterSearch = Math.floor(remaining / 5);
            speed += availableMatterSearch;
            exploration += availableMatterSearch;
            remaining -= availableMatterSearch * 2;
        }
        if (document.getElementById('nanoWire').innerText != "0" && remaining > 0) {
            factory++;
            remaining--;
        }
        if (elementExists('probeCombatDisplay') && combat === 0) {
            var combatChange = Math.floor(remaining / 3);
            combat += combatChange;
            remaining -= combatChange;
        }
        if (remaining > 30) {
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
            rep += 2;
            remaining -= 2;
            haz += 2;
            remaining -= 2;
            if (rep > 5) {
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
        setTimeout(function () {
            while (factory-- > 0) {
                clickButton('btnRaiseProbeFac');
            }
            while (rep-- > 0) {
                clickButton('btnRaiseProbeRep');
            }
            while (haz-- > 0) {
                clickButton('btnRaiseProbeHaz');
            }
            while (nanoWire-- > 0) {
                clickButton('btnRaiseProbeWire');
            }
            while (acquiredMatter-- > 0) {
                clickButton('btnRaiseProbeHarv');
            }
            while (speed-- > 0) {
                clickButton('btnRaiseProbeSpeed');
            }
            while (exploration-- > 0) {
                clickButton('btnRaiseProbeNav');
            }
            while (combat-- > 0) {
                clickButton('btnRaiseProbeCombat');
            }
        }, 100);
        rebalanceProbeLastRun = new Date().getTime();
    }
});
var runNextProject = function () {
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
var automation = function () {
    runNextProject();
    var timeout = Math.random() * 15000 - 10000;
    if (timeout < 200) {
        timeout = 200;
    }
    setTimeout(automation);
};
automation();
