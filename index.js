let myObservable = Rx.Observable.interval(1000).concatMap(()=>{
    return Rx.Observable.fromPromise(
        $.get('http://localhost:8080/warnings')
    )
        .catch((response) => {
            return Rx.Observable.empty();
        })
});

myObservable.subscribe(results =>{
    console.log("refreshed");
    renderUsers(results.warnings)
});

/*let userTypesInSearchBox = Rx.Observable.fromEvent(
    $("#search-box"),
    'keyup'
)
    .map((event) => {
        return $("#search-box").val();
    });
*/

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
function renderUsers(
    result
) {
    $("#output").empty();
    for(var i in result) {
        $("#output").append(`<li>
id=${result[i].id}` + `, severity = ${result[i].severity}` + ` type = ${result[i].prediction.type}
</li>`)
    }
    //$("#output").append("<li> hello </li>")
}
