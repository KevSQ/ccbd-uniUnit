AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:43d5b540-55d2-4fe0-b5fc-a94d7670461f'});
const createEventLambda = new AWS.Lambda();
const getEventsLambda = new AWS.Lambda();
var eventData = [];

$(function () {
    console.log("javasript running")
    const params = {
        FunctionName: 'final-renderEvent'
    };

    getEventsLambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
        const events = JSON.parse(data.Payload);
        console.log('Success, events: ', events);

        // Store events in a variable for later use
        const allEvents = events;
        console.log('All events: ', allEvents);
        }
    });  
    
    
});
