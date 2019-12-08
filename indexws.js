let ws;

let firstRun = true;
let _resultsws = [];

window.subscribe = () => {

    ws = new WebSocket("ws://localhost:8090/warnings");

    ws.onopen = () => {
        const message = 'subscribe';
        ws.send(message)
    };

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (firstRun) {
            _results = [];
            firstRun = false;
            _resultsws = data.warnings
        } else {
            _resultsws.push(JSON.parse(message.data))
        }
        renderNewResultsws(_resultsws);
    }
};

window.subscribe();

function renderNewResultsws(result) {
    $("#output_ws").empty();
    for (res of result) {
        $("#output_ws").append(`<li>id=${res["id"]}` + `, severity = ${res["severity"]}` + `</li>`)
    }
}

window.unsubscribe = () => {
    firstRun = true;
    ws.close();
};