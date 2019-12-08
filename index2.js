let state_severityLevel = 0;
const state = {
    warning: {},
    previousWarning: {}
};

const template = (warning, previousWarning) => `
        <p>
            <span><strong>current:</strong> ${JSON.stringify(warning)}</span><br>
            <span><strong>previous:</strong> ${JSON.stringify(previousWarning)}</span><br>
        </p>`;

const rerender = () => {
    const warningsContainer = document.getElementById("warnings");

    // clean what is inside
    while (warningsContainer.firstChild) warningsContainer.removeChild(warningsContainer.firstChild);


    // build html content
    let content = "";

    for (let warningId in state.warning) {
        let warning = state.warning[warningId];
        let previousWarning = state.previousWarning[warningId];


        if (warning.severity >= state_severityLevel)
            content += template(warning, previousWarning)
    }

    // render it
    warningsContainer.insertAdjacentHTML('afterbegin', content)
};


const updateState = warning => {
    // console.log("updating " + warning.id, JSON.parse(JSON.stringify(warning)))

    // if it is in the state update the value
    if (state.warning[warning.id]) {

        state.previousWarning[warning.id] = state.warning[warning.id];
        state.warning[warning.id] = warning
    }

    // else add a new item to state
    else {
        state.warning[warning.id] = warning
    }


    // console.log("state updated", JSON.parse(JSON.stringify(state)))

    rerender()
};

let ws;

window.changeSeverity = () => {
    state_severityLevel = document.querySelector('#severity').value;

    rerender()
};

window.subscribe = () => {

    // reset state
    state.warning = {};
    state.previousWarning = {};


    ws = new WebSocket("ws://localhost:8090/warnings");

    ws.onopen = () => {
        const message = 'subscribe';
        ws.send(message)
    };
    ws.onmessage = message => {
        const data = JSON.parse(message.data);

        if (data.warnings)
            data.warnings.forEach(warning => {
                updateState(warning)
            });
        else
            updateState(data)
    };

    document.querySelector('#sub-status').innerHTML = 'subscribed'
};

window.unsubscribe = () => {
    if (ws) {
        ws.close()
    }

    document.querySelector('#sub-status').innerHTML = 'unsubscribed'
};

window.subscribe();