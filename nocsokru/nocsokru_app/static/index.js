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
        setRequest: (el) => {
            let value = el.value
            let className = el.className
            if (!app.handlers.isTagActive(value)) {
                el.style.backgroundColor = "#83EF86"
            } else {
                el.style.backgroundColor = className === 'tech' ? '#E27781' : '#6573A0'
            }
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
                let vac = '' 
                vac += `
                <div class="vacancy">
                    <div class="v-start-container">
                        <img class="employer-logo" src="${jobs[j].employer_logo}"></img>
                        <div class='v-mid-container'>
                            <p class="name">${jobs[j].name}</p>
                            <p class="employer-date">${jobs[j].employer}, ${jobs[j].date}</p>
                            <div class="v-tags">
                `;
                for (const t of jobs[j].tags.type) {
                    vac += `<div class="v-type">${t}</div>`
                };
                for (const t of jobs[j].tags.tech) {
                    vac += `<div class="v-tech">${t}</div>`
                };
                vac += `</div>
                        </div>
                    </div>
                    <div class="v-end-container">
                        <p class="city">${jobs[j].city}</p>
                        <button class="respond-btn" onclick="window.open('${jobs[j].url}','_blank')">Откликнуться</button>
                    </div>
                </div>`
                app.state.vacancies.push(vac)
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
                let vac = '' 
                vac += `
                <div style="border: 3px #${jobs[j].color} solid" class="vacancy">
                    <div class="v-start-container">
                        <img class="employer-logo" src="${jobs[j].employer_logo}"></img>
                        <div class='v-mid-container'>
                            <p class="name">${jobs[j].name}</p>
                            <p class="employer-date">${jobs[j].employer}, ${jobs[j].date}</p>
                            <div class="v-tags">
                `;
                for (const t of jobs[j].tags.type) {
                    vac += `<div class="v-type">${t}</div>`
                };
                for (const t of jobs[j].tags.tech) {
                    vac += `<div class="v-tech">${t}</div>`
                };
                vac += `</div>
                        </div>
                    </div>
                    <div class="v-end-container">
                        <p class="city">${jobs[j].city}</p>
                        <button class="respond-btn" onclick="window.open('${jobs[j].url}','_blank')">Откликнуться</button>
                    </div>
                </div>`
                app.state.vacancies.push(vac)
                document.getElementById("paid-vacancies").innerHTML += app.state.vacancies[j]
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
        },
        isTagActive: (value) => {
            if (app.state.request.tags.tech.includes(value) || app.state.request.tags.type.includes(value)) {
                return true
            }
            return false
        }
    }
}
