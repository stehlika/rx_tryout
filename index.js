let myObservable = Rx.Observable.interval(5000).concatMap(() => {
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
            if (checkIfArrContainsEle(element, _results)) {


                if (checkIfArrContainsEle(element, _resultsNewer)) {
                    // Vyhod stary kokot

                    console.log("Malo by vyhodit stareho kokota");
                } else {
                    _resultsNewer.push(element);
                }
            } else {
                _results.push(element);
            }
        }
    }
    renderWarnings(_results);
    renderNewResults(_resultsNewer) // TODO

    /*
    console.log("iteracia s idckom : "+element.id)
    let gottenOBJ =_results.find(obj => {
        return obj.id == element.id
    })

     */
    // console.log("objekt getnuty po iteracii "+gottenOBJ)
    /*if (allIds.includes(element.id)) {
        //console.log("This is already contained : "+element.id)
        for (obj of _results) {
            if (obj.id == element.id) {
                if (obj.severity != element.severity) {
                    // Pridat do noveho listu
                    _resultsNewer.push(element)
                }
            }
        }
    } else {
        //console.log("This could be added : "+element.id)
        _results.push(element)
    }*/
    /*for (ele of results.warnings) {
        for (element of _results) {
            if(element === ele) {
                console.log("Nic sa neudej")
            } else {
                console.log("malo by sa pridat ")
                _results.push(ele)
            }
        }
        /*if (_results.includes(ele)) {
            console.log("Uz to tam je")
        } else {
            _results.push(ele)
        }*/
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
            for (var ele of _results.warnings) {
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
                renderWarnings(results.warnings)
            });
        }

        return $("#search-box").val();
    });

userTypesInSearchBox.subscribe();

/*Rx.Observable.create((observer) => {
    observer.map((event) => {
        event
    .debounce(250)
            .concatMap(() => {
                return Rx.Observable.fromPromise(
                    $.get('http://localhost:8080/warnings')
                )
                    .catch((response) => {
                        return Rx.Observable.empty();
                    });
            });
    })
});*/




/*let searchResult = observable
    .debounce(250)
    .concatMap(() => {
        return Rx.Observable.interval(1000).fromPromise(
            $.get('http://localhost:8080/warnings')
        )
            .catch((response) => {
                return Rx.Observable.empty();
            })
    });
*/

/*Rx.Observable
    .combineLatest(searchResult)
    .subscribe((results) => {
        renderUsers(
            results[0].warnings
        );
    });
*/
function checkIfArrContainsEle(element, arr, arr2) {
    for (ele of arr) {
        if (ele.id == element.id) {
            if (ele.severity != element.severity) {
                console.log("Vraciam true");
                console.log("Ele id: " + ele.id + "element id: " + element.id);
                console.log("Ele sv: " + ele.severity + "element sv: " + element.severity);
                return false
            } else {
                return true
            }
        }
    }
    console.log("Vraciam false pre " + arr);
    return false
}

function deleteOldEle(ele, arr) {
    return arr.filter(function (element) {
        console.log("Vymazavam stareho kokota jeho id: " + ele.id);
        return element.id != ele.id;
    });
    /*
    for (i = 0; i < arr.length; i++) {
        if(ele.id == arr[i].id) {
            console.log("Vymazavam stareho kokota jeho id: " + ele.id + " a i: "+ i);
            return arr.(i);
        }
    }

     */
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
