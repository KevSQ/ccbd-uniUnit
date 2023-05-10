AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:43d5b540-55d2-4fe0-b5fc-a94d7670461f'});
const createEventLambda = new AWS.Lambda();
const getEventsLambda = new AWS.Lambda();

$(function() {
    console.log("text")
    $('#eventContainer').on('click', '#saveEventBtn', function(event) {
        event.preventDefault(); // prevent form submission
      
        // Get input values
        const name = $('.eventNameContainer .eventBoxText').val();
        const location = $('.eventLocationContainer .eventBoxText').val();
        const date = $('.eventDateContainer .eventBoxText').val();
        const time = $('.eventTimeContainer .eventBoxText').val();
        const desc = $('.eventDescContainer .eventBoxText').val();
        const people = $('.eventPeopleContainer .eventBoxText').val();
      
        // Check if all fields are filled
        const fields = [name, location, date, time, desc, people];
        let isComplete = true;
        for (let i = 0; i < fields.length; i++) {
          if (fields[i] === '') {
            isComplete = false;
            console.log("not full! notifying user")
          }
        }
      
        // Store values if all fields are filled
        if (isComplete) {
          const eventData = {
            name: name,
            location: location,
            date: date,
            time: time,
            desc: desc,
            people: people
          };
            console.log(eventData); // Print to console for debugging
            const params = {
                FunctionName: 'final-createEvent',
                Payload: JSON.stringify({ item: eventData })
            };

            createEventLambda.invoke(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Success, payload: ', params);
            });

        } else {
          alert('Please fill all fields before saving.'); // Display error message
        }
      });

});
