let myObservable = Rx.Observable.interval(2000).concatMap(() => {
    return Rx.Observable.fromPromise(
        $.get('http://localhost:8080/warnings')
    )
        .catch((response) => {
            return Rx.Observable.empty();
        })
});

var _results = null;
var _resultsFiltered = [];
var _resultsNewer = [];

let daco = myObservable.subscribe(results => {
    if (_results == null) {
        _results = results.warnings
    } else {
        console.log(JSON.stringify(results));
        for (element of results.warnings) {
            if (checkIfArrContainsEle(element, _results,_resultsNewer))
            {
                // TODO impletment in better way
            } else { _results.push(element)}
        }
    }
    renderWarnings(_results);
    renderNewResults(_resultsNewer)
});

let userCLickedDeactivate = Rx.Observable.fromEvent($("#deactivation"), 'click').subscribe(() => {
    daco.dispose()
});

let userClickedActivate = Rx.Observable.fromEvent($("#activation"), 'click').subscribe(() => {
    daco = myObservable.subscribe(results => {
        _results = results;
        console.log("refreshed");
        renderWarnings(results.warnings)
    })
});


let userTypesInSearchBox = Rx.Observable.fromEvent(
    $("#search-box"),
    'keyup'
)
    .map((event) => {
        daco.dispose();
        if ($("#search-box").val() != "") {
            _resultsFiltered = [];
            for (var ele of _results) {
                if (ele.severity <= $("#search-box").val()) {
                    console.log("Not valid for condition" + ele.severity);
                } else {
                    console.log("valid for condition" + ele.severity);
                    _resultsFiltered.push(ele)
                }
            }
            renderWarnings(_resultsFiltered)
        } else {
            daco = myObservable.subscribe(results => {
                _results = results;
                console.log("refreshed");
                renderWarnings(results)
            });
        }

        return $("#search-box").val();
    });

userTypesInSearchBox.subscribe();


function checkIfArrContainsEle(element, arr, arr2) {
    for (ele of arr) {
        if (ele.id == element.id) {
            if (ele.severity != element.severity) {
                console.log("Vraciam true");
                console.log("Ele id: " + ele.id + "element id: " + element.id);
                console.log("Ele sv: " + ele.severity + "element sv: " + element.severity);
                if(!check2(element, arr2)) {
                    arr2.push(element)
                }
                return true
            } else {
                return true
            }
        }
    }
    console.log("Vraciam false pre " + arr);
    return false
}

function check2(element, arr) {
    for (ele of arr) {
        if (ele.id == element.id) {
            if (ele.severity == element.severity) {
                return true
            } else {
                return false
            }
        }
    }

}

function renderWarnings(result) {
    $("#output").empty();
    for (res of result) {
        let outputToPrint = "<li>" + "id: " + res.id + ", severity: " + res.severity + ", type: " + res.prediction.type + "</li>";
        $("#output").append(outputToPrint)
    }
}

function renderNewResults(result) {
    $("#new_output").empty();
    for (res of result) {
        let outputToPrint = "<li>" + "id: " + res.id + ", severity: " + res.severity + ", type: " + res.prediction.type + "</li>";
        $("#new_output").append(outputToPrint)
    }
}
