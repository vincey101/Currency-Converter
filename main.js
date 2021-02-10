const objectFromEntries = entries => [...entries]
  .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})

const formToObject = form => objectFromEntries(new FormData(form).entries())

// Separate logic:

const rates = {
  USD: 0.98,
  NGN: 485,
  KES: 116,
  EUR: 0.88,
  GHS: 5.9,
  GBP: 0.78,
}

const convert = (amount, from, to) => rates[to] * amount / rates[from]

// DOM manipulation:

const output = document.getElementById('output')

document
  .getElementById('converter')
  .addEventListener('submit', event => {
    event.preventDefault()
 
    const { amount, from, to } = formToObject(event.target)
    const result = convert(amount, from, to)
    
    output.textContent = ` ${result.toFixed(2)} ${to}`
    
            const message = document.getElementById('message')
            message.style.display = 'none';
  })


const API_publicKey = "FLWPUBK_TEST-4b2a7dd33eca3038d58cfd6b750a8cf5-X";

function payWithRave() {
    const form = document.getElementById('converter')
    const { amount, from, to } = formToObject(form)
    const convertedAmount = convert(amount, from, to)
    const email = document.querySelector("input[name=email]").value
    const txref = Math.floor(Math.random() * 10000000) + Date.now()
    var x = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_email: email,
        amount: convertedAmount,
        customer_phone: "00000000000",
        currency: to,
        txref: txref,
        meta: [{
            metaname: "flightID",
            metavalue: "AP1234"
        }],
        onclose: function() {},
        callback: function(response) {
            var txref = response.data.txRef; // collect txRef returned and pass to a                    server page to complete status check.
            console.log("This is the response returned after a charge", response);
            const message = document.getElementById('message')
            message.textContent = response.respmsg
            message.style.color = 'white';
            message.style.display = 'block';
            message.style.padding = '10px';

            if (
                response.tx.chargeResponseCode == "00" ||
                response.tx.chargeResponseCode == "0"
            ) {

            // Set the background color to a light green
                message.style.backgroundColor = 'green';
                // redirect to a success page
            } else {
                      message.style.backgroundColor = 'red';

                // redirect to a failure page.
            }

            x.close(); // use this to close the modal immediately after payment.
        }
    });
}
