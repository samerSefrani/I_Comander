var contain2 = document.getElementById('container');

function updateVar() {
    contain2 = document.getElementById('container');
}


loadFlights();

function getRecentFlights() {
        return fetch('api/get_recent_flights').then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        return response.json();
        });
}


function displayRecentFlights(flights) {
    var item = `
        <h2 style="margin-top: 40px">Recent Flights</h3>
        <table id="flight_table" class="pure_g">
        <tr>
            <th class="f_header">Flight ID</th>
            <th class="f_header">User</th>
            <th class="f_header">Start Time</th>
            <th class="f_header">End Time</th>`;

    Array.prototype.forEach.call(flights.flights, flight => {
        // need a better way to crop out the time zone
        try {
            /*
        var startTime = flight.start_time.slice(4, 24);
        var endTime = flight.end_time.slice(4, 24);
    */
            var startTime = new Date(flight.start_time).toUTCString();
            var endTime = new Date(flight.end_time).toUTCString();
        }
        catch (e) {
            var endTime = "";
        }
        var item2 = ` 
            <tr>
                <td class="f_data">${flight.id}</td>
                <td class="f_data">${flight.user}</td>
                <td class="f_data">${startTime}</td>
                <td class="f_data">${endTime}</td> 
            <tr>`;

        item = item.concat(item2);

    });
    item = item.concat("</table>");

    contain2.insertAdjacentHTML('beforeend', item);
}

function loadFlights() {
    getRecentFlights().then(dataFromNetwork => {
        displayRecentFlights(dataFromNetwork);
    });
}


