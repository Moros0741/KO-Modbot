let caseNos = []

exports.getStatusEmoji = function(status){
    if (status === 'dnd') {
        return '<a:red:848971266676883506> \`(DND) Do Not Disturb\`'
    } else if (status === 'online'){
        return '<a:green:848971267050176513> \`Online\`'
    } else if (status === 'idle') {
        return '<a:yellow:848971267050307624> \`Idle\`'
    } else if (status === 'offline') {
        return '<a:gray:849056394426843167> \`Offline\`'
    } else if (status === 'invisible') {
        return '<a:gray:849056394426843167> \`Invisible (Online)\`'
    }
};

exports.getState = function(bool) {
    if (bool === true) {
        return "<a:green:848971267050176513> \`Enabled\`"
    } else if (bool === false) {
        return "<a:red:848971266676883506> \`Disabled\`"
    } else if (!bool) {
        return "<a:yellow:848971267050307624> \`Malfuntioned\`"
    }
}

exports.remove = function(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
});
};

exports.getCaseNumber = function(guildProfile) {
    function getNumber() {
        randomnumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
        let passed = checkNumber(randomnumber)
        if (!passed) {
            return;
        } else {
            return randomnumber;
        }
    };
    function checkNumber(randomnumber) {
        try {
            let isNumber = guildProfile.caseNumbers.find(o => o.caseNo === randomnumber)
            if (!isNumber) {
                guildProfile.caseNumbers.push({
                    caseNo: randomnumber
                });
                guildProfile.save()
                return randomnumber
            } else {
                let newNumber = getNumber()
                return newNumber
            }
        }catch(error) {
            console.error(error)
        }
    };
    let number = getNumber()
    return number
};

exports.getCompliance = function (memberProfile) {
    let warns = memberProfile.warns.length
    let mutes = memberProfile.mutes.length
    let kicks = memberProfile.kicks.length
    let bans = memberProfile.bans.length
    let tempbans = memberProfile.tempBans.length

    let average = (warns + mutes + kicks + bans + tempbans) / 5
    // Threshold is statically set to 25 //

    if (average === 0) {
        return ":white_check_mark: Compliant"
    } else if (average < 5 && average > 0) {
        return ":white_check_mark: Extremely Low Risk"
    } else if (average > 5 && average < 10) {
        return ":grey_exclamation: Low - Moderate Risk"
    } else if (average > 10 && average < 15) {
        return ":triangular_flag_on_post: Moderate Risk"
    } else if (average > 15 && average < 20) {
        return ":warning: Moderate-High Risk"
    } else if (average > 20 && average < 25) {
        return ":no_entry: High Risk"
    } else if (average > 25) {
        return ":"
    }
};

exports.getSeconds = function (duration) {
    time = duration.splice(0, duration.length - 1)
    let index = duration.splice(duration.length - 1, duration.length)
    console.log(time, index)
    time_convert = {"s":1, "m":60, "h":3600,"d":86400}
    newtime= Number(time) * time_convert[index]
    return newtime
};

// Kind of round about to getSeconds, but needed for automod to calculate duration of punishments based on user's
// previous automod punishments. Set to work with other systems as well.
exports.getDuration = function (data) {
    let base = 1200;
    time = base * data
    if (time > 60 && time < 3600) {
        return `${Math.floor(time / 60)}m`
    } else if (time > 3600 && time < 86400){
        return `${Math.floor(time / 3600)}h`
    } else if (time > 86400) {
        return `${Math.floor(time / 86400)}d`
    }
};

exports.getTicketID = function(guildProfile) {
    function getNumber() {
        randomnumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
        let passed = checkNumber(randomnumber)
        if (!passed) {
            return;
        } else {
            return randomnumber;
        }
    };
    function checkNumber(randomnumber) {
        try {
            let isNumber = guildProfile.systems.tickets.ticketIDS.find(o => o.ticketID === randomnumber)
            if (!isNumber) {
                guildProfile.systems.tickets.ticketIDS.push(randomnumber)
                guildProfile.save()
                return randomnumber
            } else {
                let newNumber = getNumber()
                return newNumber
            }
        }catch(error) {
            console.error(error)
        }
    };
    let number = getNumber()
    return number
};