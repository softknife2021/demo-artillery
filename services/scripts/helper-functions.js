function logHttpStatus (requestParams, response, context, ee, next) {
    let bodyPretty = JSON.stringify(JSON.parse(response.body), null, 2);
    console.log(`URL: ${response.url}: \n Status code: ${response.statusCode} \n Response body:${bodyPretty}`);
    return next();
}

function createTimestamp (context, ee, next) {
    context.vars.timestamp = new Date().toISOString();
    return next();
}

function gettestUserId(context, ee, next) {
    var tokens = context.vars.token.split(".");
    var jwt = JSON.parse(atob(tokens[1]));
    context.vars.testUserId = jwt.test_user_id;
    return next();
}

function getFirstDayOfCurrentMonthInUTC(context, ee, next) {
    var date = new Date();
    const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    context.vars.firstDayOfCurrentMonthInUTC = firstDayOfCurrentMonth.toISOString();
    return next();
}

function getTodayInUTC(context, ee, next) {
    context.vars.todayInUTC = new Date().toISOString();
    return next();
}

function getCurrentYear(context, ee, next) {
    var date = new Date();
    context.vars.currentYear = date.getFullYear();
    return next();
}

function getCurrentMonth(context, ee, next) {
    var date = new Date();
    context.vars.currentMonth = date.getMonth() + 1;
    return next();
}

function getRandomUUID(context, ee, next) {
    const { v4: uuidv4 } = require('uuid');
    context.vars.uuid = uuidv4().toString();
    return next();
}

function convertPhoneNumberToString(context, ee, next) {
    context.vars.driver_username = context.vars.driver_username.toString();
    return next();
}

function createStartTimestamp(context, ee, next) {
    context.vars.startTimestamp = new Date().toISOString();
    return next();
}

function createJsonFile(context, ee, next) {
    const fs = require("fs");

    const emptyJson = {
        "manifestVersion": "will be provided use some string for now",
        "env": context.vars.environment,
        "startedAt": context.vars.startTimestamp,
        "finishedAt": "time",
        "averageTransactionTime": null,
        "transactions": []
    }

    const data = JSON.stringify(emptyJson, null, 2);
    fs.writeFile(context.vars.startTimestamp + ".json", data, (error) => {
        if (error) {
            console.error(error);
            throw error;
        }
        // console.log("JSON file created correctly");
    });

    return next();
}

function saveTransactionDetails(context, ee, next) {
    const fs = require("fs");

    const JSON_FILE = context.vars.startTimestamp + ".json";
    try {
        const jsonData = fs.readFileSync(JSON_FILE);
        const obj = JSON.parse(jsonData);
        obj['transactions'].push(
            {
                "startedAt": context.vars.timestamp,
                "transactionId": context.vars.transaction_id,
                "vehicleId": context.vars.vehicle_id,
                "username": context.vars.driver_username
            }
        );
        newData = JSON.stringify(obj, null, 2);

        fs.writeFile(JSON_FILE, newData, (error) => {
            if (error) {
                console.error(error);
                throw error;
            }
            console.log("JSON file update correctly");
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
    return next();
}

function addEndTimestamp(context, ee, next) {
    const fs = require("fs");

    const JSON_FILE = context.vars.startTimestamp + ".json";
    let endTimestamp;
    try {
        const jsonData = fs.readFileSync(JSON_FILE);
        const obj = JSON.parse(jsonData);
        //console.log(obj);
        endTimestamp = new Date().toISOString();
        //console.log(endTimestamp);
        obj['finishedAt'] = endTimestamp;
        newData = JSON.stringify(obj, null, 2);
        //console.log(newData);

        fs.writeFileSync(JSON_FILE, newData, (error) => {
            if (error) {
                console.error(error);
                throw error;
            }
            console.log("JSON file update correctly");
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
    return next();
}


module.exports = {
    logHttpStatus: logHttpStatus,
}