var twilio = require('twilio');
var config = require('./config');

// create an authenticated Twilio REST API client
var client = twilio(config.accountSid, config.authToken);

function handler() {

    function post(message, to) {
        var options = {
            to: to,
            from: config.twilioNumber,
            body: message
        };
        client.sendMessage(options, function (err, response) {
            if (err) {
                // Just log it for now
                console.error(err);
            } else {
                // Log the last few digits of a phone number
                var masked = to.substr(0,
                    to.length - 5);
                masked += '*****';
                // generate report to some store
            }
        });
    }
    //sample database ,improve to redis persistance store
    var contestants = [
        { 'name': 'MAHAMA', 'votes': 10 },
        { 'name': 'NANA', 'votes': 10 },
        { 'name': 'INDOM', 'votes': 10 }
    ]
    //sample database ,improve to redis persistance store

    var voterRegistration = []

    function matchRE(re, text) {
        var wordArray = tokenizer.tokenize(text);
        for (var i = 0; i < wordArray.length; i++) {
            if (re.test(wordArray[i])) {
                return true;
            }
        }
        return false;
    }

    function postHelp(from) {
        var msg = 'Hi ' + from + ' ,Reply [HELP, OPTIONS,RESULT] to get started';
        post(message, from);
    }

    function postOptions(from) {
        var msg =  from + ' OPTIONS are [MAHAMA,NANA,NDOUM],reply with VOTE followed by one of the options ';
    }
    function doVote(name, from) {
        var msg;
        //has already voted 
        var checkVoted = _.findKey(voterRegistration, { 'name': from });

        if (!checkVoted) {
            var contestant = _.find(contestants, { 'name': name });
            constestant.vote = contestant.votes + 1;

            msg = from + ' Vote success'
            post(message, from)
            voterRegistration.push({ 'name': from })
            return
        } else {
            msg = from + " Sorry you cant vote twice, or see admin if this is not an error";
            post(msg, from);
        }


    }

    function vote(from, text) {
        var mahamaRe = /^MAHAMA$/;
        var nanaRe = /^NANA$/;
        var induomRe = /^INDUOM$/
        var wordArray = tokenizer.tokenize(text);
        if (matchRE(mahamaRe, text)) {
            doVote(from)
        } else if (matchRE(nanaRe, text)) {
            doVote(from)
        } else if (matchRE(induomRe, text)) {
            doVote(from)
        } else {
            post('Please include a contestant name to vote for the person ', from);
        }
    }

    function webhook(req, res) {
        var from = req.body.From;
        var text = req.body.Body;

        // RegExes
        var optionsRe = /^OPTIONS$/;
        var helpRE = /^HELP$/;
        var voteRE = /^VOTE$/;
        var resultRE = /^RESULT$/;

        if (matchRE(optionsRe, text)) {
            postOptions(from)
        } else if (matchRE(helpRE, text)) {
            postHelp(from)
        } else if (matchRE(voteRE, text)) {
            vote(from, text);
        } else if (matchRE(resultRe, text)) {
            postResult(from)
        } else {
            post(from + " reply with [HELP, OPTIONS ,RESULT] for more information", from);
        }
    };
}

module.exports = handler



