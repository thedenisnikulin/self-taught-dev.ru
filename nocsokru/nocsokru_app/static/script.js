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
        vacancies: [],
        // number of pages. Gets received from server
        pages: 1,
    },
    // handlers
    handlers: {
        // send app.state.request to server with POST request
        sendRequest: () => {
            $.ajax({
                url: '/jobs/load',
                type: 'POST',
                // some csrf token setups
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", app.state.csrftoken);
                },
                data: JSON.stringify(app.state.request),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: (data) => {
                    console.log('set to 1')
                    app.state.request.page = 1
                    app.handlers.setVacancies(data.jobs)
                    app.state.pages = data.pages
                    app.handlers.addLoadButton(app.state.pages)
                    console.log(`request: ${JSON.stringify(app.state.request)}\npages: ${app.state.pages}\nvacancies_length: ${app.state.vacancies.length}`)
                },
                error: () => {
                    alert('Internal Server Error.')
                }
            });
        },
        // load more vacancies
        loadMore: () => {
            $.ajax({
                url: '/jobs/load',
                type: 'POST',
                // some csrf token setups
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", app.state.csrftoken);
                },
                data: JSON.stringify(app.state.request),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: (data) => {
                    console.log('set to 1')
                    app.state.request.page = 1
                    app.handlers.setVacancies(data.jobs)
                    app.state.pages = data.pages
                    app.handlers.addLoadButton(app.state.pages)
                    console.log(`request: ${JSON.stringify(app.state.request)}\npages: ${app.state.pages}\nvacancies_length: ${app.state.vacancies.length}`)
                },
                error: () => {
                    alert('Internal Server Error.')
                }
            });
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
                !document.getElementById("loadbtn") && $("#loadbtn-container").append("<button id='loadbtn' onclick='loadMore()'>Загрузить ещё</button>")
            } else {
                console.log('remove')
                $('#loadbtn').remove()
            }
        }
    }
}
