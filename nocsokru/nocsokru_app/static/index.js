let app = {
    // state
    state: {
        // request that is going to be send to server
        request: {
            tags: {
                tech: [],
                type: [],
                city: '',
            },
            page: 1
        },
        // vacancies to render
        paidVacancies: [],
        vacancies: [],
        // number of pages. Gets received from server
        pages: 1,
    },
    // handlers
    handlers: {
        // send app.state.request to server with POST request
        sendRequest: () => {
            utils.sendRequest('/jobs/load', 'POST', JSON.stringify(app.state.request), {
                success: (data) => {
                    console.log('set to 1')
                    app.state.request.page = 1
                    app.handlers.setVacancies(data.jobs)
                    console.log(data.paid)
                    app.handlers.setPaidVacancies(data.paid)
                    app.state.pages = data.pages
                    app.handlers.addLoadButton(app.state.pages)
                }
            })
        },
        // load more vacancies
        loadMore: () => {
            utils.sendRequest('/jobs/load', 'POST', JSON.stringify(app.state.request), {
                success: (data) => {
                    app.handlers.addVacancies(data.jobs)
                    app.state.pages = data.pages
                    app.state.request.page++
                    app.handlers.addLoadButton(app.state.pages)
                    console.log(`request: ${JSON.stringify(app.state.request)}\npages: ${app.state.pages}\nvacancies_length: ${app.state.vacancies.length}`)
                }
            })
        },
        // set app.state.request. Used for setting tags
        setRequest: (value, className) => {
            if (className === 'type') {
                if (app.state.request.tags.type.includes(value)) {
                    // if value is already chosen, then delete it
                    let ind = app.state.request.tags.type.indexOf(value)
                    app.state.request.tags.type.splice(ind, 1)
                } else {
                    // if value isn't chosen, then add it
                    app.state.request.tags.type.push(value)
                }
            } else if (className === 'tech') {
                if (app.state.request.tags.tech.includes(value)) {
                    let ind = app.state.request.tags.tech.indexOf(value)
                    app.state.request.tags.tech.splice(ind, 1)
                } else {
                    app.state.request.tags.tech.push(value)
                }
            }
        },
        // add vacancies to DOM at the end of the vacancies list
        addVacancies: (jobs) => {
            app.state.vacancies = []
            for (let j=0; j<jobs.length; j++) {
                app.state.vacancies.push(
                    `<div class="vacancy">
                        <p class="name">${jobs[j].name}<\p>
                        <p class="employer">${jobs[j].employer}<\p>
                        <p class="city">${jobs[j].city}<\p>
                        <p class="tags">${jobs[j].tags.type.concat(jobs[j].tags.tech)}<\p>
                        <p class="url">${jobs[j].url}<\p>
                        <p class="date">${jobs[j].date}<\p>
                    <\div>`
                )
                document.getElementById("vacancies").innerHTML += app.state.vacancies[j]
            }
        },
        // remove current vacancies and set new ones
        setVacancies: (jobs) => {
            document.getElementById("vacancies").innerHTML = ""
            app.handlers.addVacancies(jobs)
        },
        setPaidVacancies: (jobs) => {
            document.getElementById("paid-vacancies").innerHTML = ""
            app.state.paidVacancies = []
            for (let j=0; j<jobs.length; j++) {
                console.log(jobs[j].tags)
                app.state.paidVacancies.push(
                    `<div class="paid-vacancy">
                        <p class="name">${jobs[j].name}<\p>
                        <p class="employer">${jobs[j].employer}<\p>
                        <p class="city">${jobs[j].city}<\p>
                        <p class="tags">${jobs[j].tags.type.concat(jobs[j].tags.tech)}<\p>
                        <p class="url">${jobs[j].url}<\p>
                        <p class="date">${jobs[j].date}<\p>
                    <\div>`
                )
                document.getElementById("paid-vacancies").innerHTML += app.state.paidVacancies[j]
            }
        },
        // set app.request.city by value from dropdown city selection list
        setCity: () => {
            const city = document.getElementById('dd-city-list').value
            app.state.request.city = city
        },
        // add 'load more' button conditionally
        addLoadButton: (pgs) => {
            app.state.pages = pgs
            if (app.state.request.page < pgs) {
                console.log('insert')
                // if no element with id 'load-more', then place such element after 'vacancies'
                !document.getElementById("loadbtn") && $("#loadbtn-container").append("<button id='loadbtn' onclick='app.handlers.loadMore()'>Загрузить ещё</button>")
            } else {
                console.log('remove')
                $('#loadbtn').remove()
            }
        }
    }
}
