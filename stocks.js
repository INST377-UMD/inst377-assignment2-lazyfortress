let chart;

async function lookupStock() {
    const ticker = document.getElementById('tickerInput').value.toUpperCase();
    const days = parseInt(document.getElementById('range').value);
    const apiKey = 'dKzoeph12rbpV0JtZgcsLYSt7sXj23sD';
    // time since Unix epoch in seconds
    const today = Math.floor(Date.now() / 1000);
    const from = today - (days * 86400);

    try {
        const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${epochToDate(from)}/${epochToDate(today)}?adjusted=true&sort=asc&limit=${days}&apiKey=${apiKey}`);
        const data = await response.json();
        // need to fix epochToDate - FIXED
        const labels = data.results.map(item => formatForChart(item.t));
        const prices = data.results.map(item => item.c);

        renderChart(ticker, labels, prices);
    } catch (error) {
        alert("Failed to get chart data");
    }
}
// NEED TO FIX; returns unusable date format - FIXED
function epochToDate(epoch) {
    return new Date(epoch * 1000).toISOString().split('T')[0];
}

// Just added this function
function formatForChart(epochMs) {
    const d = new Date(epochMs);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderChart(ticker, labels, prices) {
    if (chart) chart.destroy();
    const ctx = document.getElementById('stockChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Closing Prices`,
                data: prices,
                fill: false,
                borderColor: 'blue',
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
    document.getElementById('stockChart').style.backgroundColor = 'white';
}

async function loadRedditStocks() {
    const url = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';
    const table = document.querySelector('#stockTable tbody'); // tbody in stocks.html
    const bullImg = 'https://cdn-icons-png.flaticon.com/512/3846/3846961.png';
    const bearImg = 'https://cdn-icons-png.flaticon.com/512/4588/4588909.png';

    try {
        const res = await fetch(url);
        const data = await res.json();
        table.innerHTML = ''; // dynamic insertion

        data.slice(0, 5).forEach(item => {
        const row = document.createElement('tr');
        const link = `https://finance.yahoo.com/quote/${item.ticker}`;
        row.innerHTML = `
            <td><a href="${link}" target="_blank">${item.ticker}</a></td>
            <td>${item.no_of_comments}</td>
            <td><img src="${item.sentiment === 'Bullish' ? bullImg : bearImg}" alt="${item.sentiment}" width="50"/></td>`;
        table.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load Reddit stocks');
    }
}

function commandSetup() {
    if (annyang) {
        const commands = {
            "look up *ticker": (ticker) => {
                // get rid of spaces when I say something like "PANW"
                const cleanTicker = ticker.replace(/\s+/g, '').toUpperCase();
                document.getElementById('tickerInput').value = cleanTicker;
                document.getElementById('range').value = "30";
                setTimeout(() => {
                    lookupStock();
                }, 100);
                // document.getElementById('tickerInput').value = ticker.toUpperCase();
                // document.getElementById('range').value = "30";
                // lookupStock();
            },
            "hello": () => alert("Hello World"),
            "change the color to *color": (color) => {
                document.body.style.backgroundColor = color;
            },
            "navigate to *page": (page) => {
                const lower = page.toLowerCase();
                if (["stocks", "dogs"].includes(lower)) {
                    // String literal; 
                    window.location.href = `${lower}.html`;
                }
                if (["home"].includes(lower)){
                    window.location.href = `a2${lower}.html`;
                }
            }
        };
        annyang.addCommands(commands);
    }
}

function startListening() {
    if (annyang) {
        commandSetup();
        annyang.start();
    }
}

function stopListening() {
    if (annyang) {
        annyang.abort();
    }
}

// Initial load
loadRedditStocks();
commandSetup();
