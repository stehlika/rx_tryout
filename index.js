let userTypesInSearchBox = Rx.Observable.fromEvent(
    $("#search-box"),
    'keyup'
)
    .map((event) => {
        return $("#search-box").val();
    });


let searchResult = userTypesInSearchBox
    .debounce(250)
    .concatMap(() => {
        return Rx.Observable.fromPromise(
            $.get('http://localhost:8080/warnings')
        )
            .catch((response) => {
                return Rx.Observable.empty();
            });
    });

Rx.Observable
    .combineLatest(searchResult)
    .subscribe((results) => {
        renderUsers(
            results[0].warnings
        );
    });

function renderUsers(
    result
) {
    for(var i in result){
        $("#output").append(`<li>
id=${result[i].id}`+`, severity = ${result[i].severity}
</li>`)
    }
    //$("#output").append("<li> hello </li>")
}