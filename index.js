$(function() {
    map.on('mousemove', (e) => {
        document.getElementById('info').innerHTML = 
            JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat.wrap());
        });

    var marker = new mapboxgl.Marker();

    $('#newLocBtn').click(() => {
        var locContainer = $('<div>').addClass("locContainer");
        var form = $('<form>').addClass("locationForm");
        var nameContainer = $('<div>').addClass("locNameContainer");
        var markerNameLabel = $('<div>').addClass("locBoxLabel").text("Name:");
        var markerName = $('<input>').addClass("locBoxText");
        var descContainer = $('<div>').addClass("locDescContainer");
        var markerDescLabel = $('<div>').addClass("locBoxLabel").text("Description:");
        var markerDesc = $('<input>').addClass("locBoxText");
        nameContainer.append([markerNameLabel, markerName]);
        descContainer.append([markerDescLabel, markerDesc]);
        form.append([nameContainer, descContainer]);
        locContainer.append(form);
        $('#markerMenu').append(locContainer);
      })      

    function add_marker (event) {
        var coordinates = event.lngLat;
        console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
        marker.setLngLat(coordinates).addTo(map);
    }

    map.on('click', (e) => {
        console.log(e);
        add_marker(e);
    });

});