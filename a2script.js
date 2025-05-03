// Fetch quote via API
fetch("https://zenquotes.io/api/random")
    .then((res) => res.json())
    .then((data) => {
        document.getElementById("quote-text").innerText = `"${data[0].q}" — ${data[0].a}`;
    })
    .catch(() => {
        document.getElementById("quote-text").innerText = "Could not load quote.";
    });

// Voice commands via Annyang
function startListening() {
    if (annyang) {
        const commands = {
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
    annyang.start();
  }
}

function stopListening() {
    if (annyang) {
    annyang.abort();
    }
}
