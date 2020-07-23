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
            // TODO add time
            utils.sendRequest('/jobs/create', 'POST', JSON.stringify(hiring.state.job), {
                            success: (response) => {
                                console.log('created')
                            }
                        })
            let hashedJob = utils.generateHash(JSON.stringify(hiring.state.job)).toString()
            localStorage.setItem('nocsdegreeru.hashedjob', hashedJob)
            utils.sendRequest('/bills/create', 'POST', hashedJob, {
                success: (response) => {
                    console.log('got url')
                    hiring.handlers.openBill(response.payUrl)
                }
            })
            return false
        },
        handleChange: (el) => {
            const { value, name } = el;
            hiring.state.job = { ...hiring.state.job, [name]: value };
        },
        openBill: (payUrl) => {
           params = {
                payUrl: payUrl
            }
            QiwiCheckout.openInvoice(params)
                .then(response => {
                    console.log('successfully paid:')
                    console.log(response)
                    hiring.handlers.verifyBill(localStorage.getItem('nocsdegreeru.hashedjob'))
                })
                .catch(error => {
                    console.log(error)
                    if (error.reason === "POPUP_CLOSED") {
                        hiring.handlers.verifyBill(localStorage.getItem('nocsdegreeru.hashedjob'))
                    }
                })
        },
        verifyBill: (billId) => {
            utils.sendRequest('/bills/verify', 'POST', localStorage.getItem('nocsdegreeru.hashedjob'), {
                success: (response) => {
                    console.log('is paid ? ' + response.isPaid)
                    if (response.isPaid === true) {
                        console.log('gonna save your job!')
                        // do database stuff
                        utils.sendRequest('/jobs/create', 'POST', JSON.stringify(hiring.state.job), {
                            success: (response) => {
                                console.log('created')
                            }
                        })
                    }
                }
            })
        }
    }
}