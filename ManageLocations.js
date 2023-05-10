AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:43d5b540-55d2-4fe0-b5fc-a94d7670461f'});
const createLocationLambda = new AWS.Lambda();
const renderLocationLambda = new AWS.Lambda();

$(function() {
    let long, lat, name, desc, mapClickListener;
    let allLocations;
    let isPinPlaced = false;
    let canStore = false;
    let locContainerCount = 0; 
    var marker = new mapboxgl.Marker();
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2c3EiLCJhIjoiY2xoZjFvdHg5MXFzMDNmczBlbjc1MThobCJ9.45X88DFLurqWGjJNPA70rA';

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-73.96183463220808, 40.80815698272406], // starting position [lng, lat]
        zoom: 16, // starting zoom
    });

    const geocoder = new MapboxGeocoder({
        // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: map, // Set the mapbox-gl instance
        marker: false // Do not use the default marker style
    });
      
    // Add the geocoder to the map
    map.addControl(geocoder);
    
    /*
    map.on('load', () => {

        const params = {
            FunctionName: 'final-renderLocation',
            Payload: JSON.stringify("")
        };
        renderLocationLambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else console.log('Returned data ', data);
            allLocations = data;
        });
        //new mapboxgl.Popup().setText().addTo(map);
        //new mapboxgl.Marker().setLngLat([-96, 37.8]).addTo(map).setPopup(popup);

    });
    */
   
    $('#markerLock').click(() => {
        // Add a new click listener that saves the clicked coordinates
        marker.remove();
        mapClickListener = map.once('click', createMarker);
        isPinPlaced = true;
    });

    $('#newLocBtn').click((event) => {
        let locContainer = $('<div>').addClass("locContainer").attr("id", "locContainer-" + ++locContainerCount); // set unique ID for each locContainer
        var form = $('<form>').addClass("locationForm");
        var nameContainer = $('<div>').addClass("locNameContainer");
        var markerNameLabel = $('<div>').addClass("locBoxLabel").text("Name:");
        var markerName = $('<input>').addClass("locBoxText");
        var descContainer = $('<div>').addClass("locDescContainer");
        var markerDescLabel = $('<div>').addClass("locBoxLabel").text("Description:");
        var markerDesc = $('<textarea>').addClass("locBoxText").attr({ rows: 4, cols: 50 });
        var saveLocBtn = $('<button>').addClass("saveLocBtn").text("Save Location").attr("type", "button");
        var attachLocBtn = $('<button>').addClass("attachLocBtn").text("Attach Pin").attr("type", "button");
        nameContainer.append([markerNameLabel, markerName]);
        descContainer.append([markerDescLabel, markerDesc, saveLocBtn, attachLocBtn]);
        form.append([nameContainer, descContainer]);
        locContainer.append(form);
        $('#markerMenu').append(locContainer);
    });

    $('#markerMenu').on('click', '.saveLocBtn', function() {
        if (canStore) {
            const locContainer = $(this).closest('.locContainer');
            const name = locContainer.find('.locBoxText').eq(0).val();
            const desc = locContainer.find('.locBoxText').eq(1).val();
            const params = {
                FunctionName: 'final-createLocation',
                Payload: JSON.stringify( { item: {
                    type: "Location",
                    u_ID: makeid(10),
                    name: name,
                    description: desc,
                    coordinates: {
                        longitude: long,
                        latitude: lat
                    }
                }})
            };

            createLocationLambda.invoke(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Success, payload: ', params);
            });
        }
      });

    $('#markerMenu').on('click', '.attachLocBtn', function() {
        if (isPinPlaced) {
            canStore = true;
            console.log("canStore: " + canStore)
        }
    });  
    
    function renderMarker (event) {
        var coordinates = event.lngLat;
        console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
        marker.setLngLat(coordinates).addTo(map);
    };
    
    function createMarker(e) {
        console.log(e);
        long = e.lngLat.lng;
        lat = e.lngLat.lat;
        renderMarker(e);
    }

    // From https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
});
