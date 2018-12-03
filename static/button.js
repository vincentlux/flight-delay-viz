
    // inititalize and sort a variable for the json array
    // refer to https://www.sitepoint.com/sophisticated-sorting-in-javascript/
    // https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/

    // get StateCityCode.json
var data_array = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "http://0.0.0.0:5000/static/StateCityCode.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();        

function compare(a, b) {
    // standardize character casing
    var stateA = a._id.toUpperCase();
    var stateB = b._id.toUpperCase();

    let comparison = 0;

    if (stateA > stateB) {
        comparison = 1;
    }
    else if (stateA < stateB) {
        comparison = -1;
    }
    return comparison;
}

data_array.sort(compare);

// function to generate departure and arrival dropdown state lists
function generateStateLists() {
    var stateOptions = "<option value='' disabled selected>Select a state:</option>";
    for (let i = 0; i < data_array.length; i++) {
            stateOptions += "<option>" + data_array[i]["_id"] + "</option>";
        }

    document.getElementById("departure_state").innerHTML = stateOptions;
    document.getElementById("arrival_state").innerHTML = stateOptions;
    };

// generate departure airport menu based on state selection
// refer to https://stackoverflow.com/questions/30232146/dynamically-populating-drop-down-list-from-selection-of-another-drop-down-value
function changeDepAirport(value) {
    if (value.length == 0) document.getElementById("departure_airport").innerHTML = "<option></option>";
    else {
        // call the function to create the list of airports for that state
        airportOptions = createAirportList(value);

        // update the HTML
        document.getElementById("departure_airport").innerHTML = airportOptions;
        }
    };

// generate arrival airport menu based on state selection
function changeArrivAirport(value) {
    if (value.length == 0) document.getElementById("arrival_airport").innerHTML = "<option></option>";
    else {
        // call the function to create the list of airports for that state
        airportOptions = createAirportList(value);

        // update the HTML
        document.getElementById("arrival_airport").innerHTML = airportOptions;
        }
    };

// generate the list of airports based on the selected state
function createAirportList(value) {

    // store the object containing airports for the selected state
    var state_details = this.data_array.filter(function(d) {
                return d._id == value;
            });

    // store the array of only airport codes
    var airport_codes = state_details[0].Code;

    // sort the airport codes alphabetically
    function compare(a, b) {
        let comparison = 0;
        if (a > b) {
            comparison = 1;
        }
        else if (a < b) {
            comparison = -1;
        }
        return comparison;
    };
    airport_codes.sort(compare);

    // loop over the airports within that state, appending them as menu options
    var airportOptions = "<option value='' disabled selected>Select an airport:</option>";
    for (airport in airport_codes) {
        airportOptions += "<option>" + airport_codes[airport] + "</option>";
        }
    return airportOptions;
};

// generateStateLists();


