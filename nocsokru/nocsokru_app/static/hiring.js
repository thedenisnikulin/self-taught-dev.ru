let hiring = {
    state: {
        job: {
            name: '',
            employer: '',
            employer_logo: '',
            city: '',
            tags: [],
            url: '',
            date: ''
        }
    },
    handlers: {
        handleSubmit: () => {
            let hashedJob = utils.generateHash(JSON.stringify(hiring.state.job)).toString()
            localStorage.setItem('nocsdegreeru.hashedjob', hashedJob)

            $.ajax({
                url: '/jobs/create',
                type: 'POST',
                // some csrf token setups
                beforeSend: function (xhr) {
                    const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                data: hashedJob,
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: (data) => {
                    hiring.handlers.openBill(data.payUrl)
                },
                error: () => {
                    alert('Internal Server Error.')
                }
            });
            return false
        },
        handleChange: (el) => {
            console.log('hey')
            const { value, name } = el;
            console.log(value)
            hiring.state.job = { ...hiring.state.job, [name]: value };
            console.log(hiring.state.job)
        },
        bill: () => {
            QiwiCheckout.createInvoice({
                publicKey: '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iP5QmoFPpB6EUgki7HjovKj2GiLhKTWemCYGcbrP8stEybEs5gdNJ7oGx4cL4p8eiqN5U3iZ14k1ofNmEs88wdNNrwvBaFBVW8veDsYBFFT',
                amount: 1,
                account: localStorage.getItem('nocsdegreeru.hashedjob')
            })
                .then(data => {
                    console.log('success:')
                    console.log(data)
                })
                .catch(error => {
                    console.log('error:')
                    console.log(error)
                })
        },
        openBill: (payUrl) => {
           params = {
                payUrl: payUrl
            }
            QiwiCheckout.openInvoice(params)
                .then(data => {
                    console.log('successfully paid:')
                    console.log(data)
                    hiring.handlers.isPaid(localStorage.getItem('nocsdegreeru.hashedjob'))
                })
                .catch(error => {
                    console.log('error:')
                    console.log(error)
                })
        },
        isPaid: (billId) => {
            $.ajax({
                url: '/jobs/verify',
                type: 'POST',
                // some csrf token setups
                beforeSend: function (xhr) {
                    const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                data: localStorage.getItem('nocsdegreeru.hashedjob'),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: (data) => {
                    console.log('is paid')
                    console.log(data)
                },
                error: () => {
                    alert('Internal Server Error.')
                }
            })
        }
    }
}