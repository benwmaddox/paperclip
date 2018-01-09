"use strict";
function clickButton(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.click();
    }
}
function getNumber(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        return 0;
    }
    return Number(element.innerText.replace(',', '').replace(',', '').replace(',', ''));
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
        return totalClips < 1500 && buttonEnabled('btnMakePaperclip') && (now - initialClipLastRun > 10000);
    },
    priority: projectPriority.Lowest,
    run: function () {
        initialClipLastRun = new Date().getTime();
        for (var i = 0; i < 50; i++) {
            setTimeout(function () {
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
                clickButton('btnMakePaperclip');
            }, 300 * i);
        }
    }
});
// 
projectList.push({
    name: 'Buy wire when low',
    canRun: function () {
        var wire = getNumber('wire');
        return wire < 1500 && buttonEnabled('btnBuyWire') && !elementExists('btnToggleWireBuyer');
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
        return wire > 1500 && marketingCost < funds && buttonEnabled('btnExpandMarketing');
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
        return rateElement && totalClips > 800 && (clipMakerRate + 1) * 30 < unsoldClips && unsoldClips > 1000 && averagesale - clipMakerRate < 0 && buttonEnabled('btnLowerPrice');
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
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        return rateElement && (totalClips > 800 && ((clipMakerRate + 1) * 10 > unsoldClips && averagesale - clipMakerRate > 0) || (totalClips > 1800 && unsoldClips < 1000)) && buttonEnabled('btnRaisePrice');
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnRaisePrice');
    }
});
var marketLoadTest = new Date().getTime() - 120000;
// Adjust price higher
projectList.push({
    name: 'Increasing prices to check market load',
    canRun: function () {
        return elementExists('btnRaisePrice') && (new Date()).getTime() - marketLoadTest > 180000 && getNumber('clips') > 10000;
    },
    priority: projectPriority.Low,
    run: function () {
        marketLoadTest = new Date().getTime();
        for (var i = 0; i < 10; i++) {
            setTimeout(function () {
                clickButton('btnRaisePrice');
            }, 2100);
        }
    }
});
// run projects
projectList.push({
    name: 'Run projects',
    canRun: function () {
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (buttonEnabled(projectButtons[i].id)) {
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
        var unsoldClips = getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (buttonEnabled(projectButtons[i].id)) {
                return true;
            }
        }
        return elementExists('btnMakeClipper') && buttonEnabled('btnMakeClipper') && getNumber('clipmakerLevel2') < getNumber('marketingLvl') * 15 && wire > 1000 && getNumber('clipmakerLevel2') < 150;
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
        var totalClips = getNumber('clips');
        var unsoldClips = getNumber('unsoldClips');
        var clipMakerRate = getNumber('clipmakerRate');
        var averagesale = getNumber('avgSales');
        var rateElement = elementExists('clipmakerRate');
        var projectButtons = document.getElementsByClassName('projectButton');
        for (var i = 0; i < projectButtons.length; i++) {
            if (buttonEnabled(projectButtons[i].id)) {
                return true;
            }
        }
        return elementExists('btnMakeMegaClipper') && buttonEnabled('btnMakeMegaClipper') && getNumber('megaClipperLevel') < getNumber('marketingLvl') * 10 && wire > 1500 && getNumber('megaClipperLevel') < 100;
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
        if (processors < 25 && (processors < 5 || processors * 3 < memory)) {
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
        return elementExists('btnImproveInvestments') && buttonEnabled('btnImproveInvestments');
    },
    priority: projectPriority.Lowest,
    run: function () {
        clickButton('btnImproveInvestments');
    }
});
var lastDepositTime = (new Date()).getTime() - 100000;
projectList.push({
    name: 'Deposit',
    canRun: function () {
        var trust = getNumber('trust');
        var now = (new Date()).getTime();
        return elementExists('investmentEngine') && elementExists('btnInvest') != null && buttonEnabled('btnInvest') && (trust < 95 || (trust > 29 && trust < 32)) && (now - lastDepositTime > 60000);
    },
    priority: projectPriority.Low,
    run: function () {
        clickButton('btnInvest');
        lastDepositTime = (new Date()).getTime();
    }
});
var lastWithdrawTime = (new Date()).getTime();
projectList.push({
    name: 'Withdraw',
    canRun: function () {
        var trust = getNumber('trust');
        var now = (new Date()).getTime();
        return elementExists('btnWithdraw') != null && buttonEnabled('btnWithdraw') && (now - lastWithdrawTime > 70000)
            && trust > 30 && getNumber('investmentBankroll') > 1000000 && getNumber('portValue') > getNumber('investmentBankroll');
    },
    priority: projectPriority.Lowest,
    run: function () {
        lastWithdrawTime = (new Date()).getTime();
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
        return elementExists('investmentEngineUpgrade') && elementExists('btnNewTournament') && buttonEnabled('btnNewTournament') && yomi < operation && trust >= 25;
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
var runNextProject = function () {
    var enumsToLoop = [projectPriority.Highest, projectPriority.High, projectPriority.Medium, projectPriority.Low, projectPriority.Lowest];
    for (var i = 0; i < enumsToLoop.length; i++) {
        for (var j = 0; j < projectList.length; j++) {
            if (projectList[j].priority == enumsToLoop[i] &&
                projectList[j].canRun()) {
                projectList[j].run();
                console.log((new Date()).toLocaleString() + "  |  " + projectList[j].name);
                return;
            }
        }
    }
};
var automation = function () {
    runNextProject();
    setTimeout(automation, 1000);
};
automation();
