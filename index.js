const stripe = Stripe('pk_test_2JjxPA5yKosM9dOXlZuHCD29')
const elements = stripe.elements()

// Custom styling can be passed to options when creating an Element.
const style = {
  base: {
    maxWidth: '600px',
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}

const amount = document.querySelector('#amount')

amount.addEventListener('blur', validateEntry)
amount.addEventListener('focus', clearValidation)

function validateEntry () {
  if (amount.value <= 0 || amount.value > 387) {
    amount.style.border = '1px solid red'
    amount.style.color = 'red'
    document.querySelector('#amountError').innerText = 'Payment amount must be between $0 and $387'
  } else {
    document.querySelector('#amountError').innerText = ''
  }
}

function clearValidation () {
  amount.style = null
}

// Create an instance of the card Element and add the instance of the card Element into the `card-element` <div>.
const card = elements.create('card', { style })
card.mount('#card-element')

card.addEventListener('change', ({ error }) => {
  const displayError = document.getElementById('card-errors')
  if (error) {
    displayError.textContent = error.message
  } else {
    displayError.textContent = ''
  }
})

// Create a token or display an error when the form is submitted.
const form = document.getElementById('payment-form')
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const {token, error} = await stripe.createToken(card, {name})

  if (error) {
    // Inform the customer that there was an error.
    const errorElement = document.getElementById('card-errors')
    errorElement.textContent = error.message
  } else {
    // Send the token to your server.
    stripeTokenHandler(token)
  }
})

const stripeTokenHandler = token => {
  // Insert the token ID into the form so it gets submitted to the server
  const form = document.getElementById('payment-form')
  const hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  form.appendChild(hiddenInput)

  // Submit the form
  form.submit()
}
