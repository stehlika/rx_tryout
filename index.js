let myObservable = Rx.Observable.interval(1000).concatMap(() => {
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
        let allIds = _results.map(x => x.id);
        for (element of results.warnings) {
            if (allIds.includes(element.id)) {
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
            }
        }
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
    }
    renderWarnings(_results)
    //renderNewResults(_resultsNewer) // TODO
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
function renderNewResults(result) {
    $("#new_output").empty();
    for (res of result) {
        $("#new_output").append(`<li>
id=${res.id}` + `, severity = ${res.severity}` + ` type = ${res.prediction.type}
</li>`)
    }
}


function renderWarnings(result) {
    $("#output").empty();
    for (var i in result) {
        $("#output").append(`<li>
id=${result[i].id}` + `, severity = ${result[i].severity}` + ` type = ${result[i].prediction.type}
</li>`)
    }
    //$("#output").append("<li> hello </li>")
}
