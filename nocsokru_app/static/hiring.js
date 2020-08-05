let hiring = {
    state: {
        job: {
            name: 'Должность',
            employer: 'Ваша компания',
            employer_logo: '/static/nophoto.png',
            tags: {
                tech: [],
                type: [],
                city: 'Город',
            },
            url: '',
            date: new Date().toISOString().slice(0,10),
            color: '#F5BA78'
        },
        jobLink: ''
    },
    handlers: {
        requestPayment: () => {
            // TODO add time
            const hashedJob = utils.generateHash(JSON.stringify(hiring.state.job) + new Date().toISOString()).toString()
            const billData = {
                billId: hashedJob,
                promocode: new URLSearchParams(window.location.search).get('promo')
            }
            console.log(billData)
            localStorage.setItem('nocsdegreeru.hashedjob', hashedJob)

            utils.sendRequest('/bills/create', 'POST', JSON.stringify(billData), {
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
            if (name === "employer_logo") {
                $('.employer_logo').attr('src', value)
            } else if (name === 'color') {
                let v = value.startsWith('#') ? value : `#${value}`
                $('.vacancy').attr('style', `border: 3px ${v} solid`)
                hiring.state.job.color = v;
            } else if (name === 'url') {
                $('.respond-btn').attr('onclick', `window.open('${value}', '_blank')`)
            } else {
                $(`.${name}`).html(value)
            }
            console.log(hiring.state.job)
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
                                localStorage.removeItem('nocsdegreeru.hashedjob')
                                console.log(`here ${localStorage.getItem('nocsdegreeru.hashedjob')}`)
                            },
                        })
                    }
                }
            })
        },
        requestJobByLink: () => {
            utils.sendRequest('/jobs/generate', 'POST', JSON.stringify({jobLink: hiring.state.jobLink}), {
                success: (response) => {
                    $('.v-tags').html('')
                    response.job.color = '#F5BA78'
                    hiring.state.job = response.job
                    components.renderGenerator(hiring.state.job)
                    $('.gen-content').html(`<button onclick='components.renderPaymentProcessor(hiring.state.job)' class='gen-btn gi'>Продолжить</button>`)
                    console.log(hiring.state.job)
                }
            });
            return false;
        },
    }
}