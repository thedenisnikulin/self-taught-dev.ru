let hiring = {
    state: {
        job: {
            name: '',
            employer: '',
            employer_logo: '',
            tags: {
                tech: [],
                type: [],
                city: '',
            },
            url: '',
            date: '',
            color: '#F5BA78'
        },
        jobLink: ''
    },
    handlers: {
        requestPayment: () => {
            // TODO add time
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
                            }
                        })
                    }
                }
            })
        },
        switchToEditor: () => {
            $('.generate-by-link-container').remove()
            $(".main-container").append(components.vacancyEditor)
        },
        switchToGenerator: () => {
            $('.main-container').append(components.generatorVacancyByLink)
        },
        switchToPayment: () => {
            $('.generate-by-link-container').remove()
            $('.editor-container').remove()
            $('.main-container').append(components.paymentComponent())
            for (const t of hiring.state.job.tags.type) {
                $('.v-tags').append(`<div class="v-type">${t}</div>`)
            } 
            for (const t of hiring.state.job.tags.tech) {
                $('.v-tags').append(`<div class="v-tech">${t}</div>`)
            }
        },
        requestJobByLink: () => {
            utils.sendRequest('/jobs/generate', 'POST', JSON.stringify({jobLink: hiring.state.jobLink}), {
                success: (response) => {
                    $('.v-tags').html('')
                    hiring.state.job = response.job
                    console.log(response.job)
                    for(const [key, value] of Object.entries(hiring.state.job)) {
                        hiring.handlers.handleChange({name: key, value: value})
                    }
                    for (const t of hiring.state.job.tags.type) {
                        $('.v-tags').append(`<div class="v-type">${t}</div>`)
                    } 
                    for (const t of hiring.state.job.tags.tech) {
                        $('.v-tags').append(`<div class="v-tech">${t}</div>`)
                    }
                    $('.city').html(hiring.state.job.tags.city)
                    hiring.state.job.color = '#F5BA78';
                }
            });
            $('.gen-content').html("<button onclick='hiring.handlers.switchToPayment()' class='gen-btn gi'>Продолжить</button>")
            return false;
        },
        addTag: (value) => {
            const techtags = ['Python', 'Java', 'JavaScript', 'C#', 'C++', 'Go', 'PHP'].map(i => i.toLowerCase())
            const typetags = ['Fullstack', 'Frontend', 'Backend', 'Mobile', 'Junior'].map(i => i.toLowerCase())
            let tagtype;
            if (techtags.includes(value)) {
                hiring.state.job.tags.tech.push(value)
                tagtype = 'tech'
            } else {
                hiring.state.job.tags.type.push(value)
                tagtype = 'type'
            };
            $('.v-tags').append(`<div class="v-${tagtype}">${value}</div>`)
        },
        removeTag: (value) => {
            const techtags = ['Python', 'Java', 'JavaScript', 'C#', 'C++', 'Go', 'PHP'].map(i => i.toLowerCase())
            const typetags = ['Fullstack', 'Frontend', 'Backend', 'Mobile', 'Junior'].map(i => i.toLowerCase())
            let tags = '';
            hiring.state.job.tags.tech = hiring.state.job.tags.tech.filter(t => t !== value)
            hiring.state.job.tags.type = hiring.state.job.tags.type.filter(t => t !== value)
            for(const t of hiring.state.job.tags.type) {
                tags += `<div class="v-type">${t}</div>`
            }
            for(const t of hiring.state.job.tags.tech) {
                tags += `<div class="v-tech">${t}</div>`
            }
            $('.v-tags').html(tags)
        }
    }
}