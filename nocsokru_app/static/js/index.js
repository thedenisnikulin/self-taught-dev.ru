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
            !$('#v-loading').length && $('.tags').after('<p id="v-loading" style="text-align: center;color: white;">Загрузка...</p>')
            utils.sendRequest('/vacancies/load', 'POST', JSON.stringify(app.state.request), {
                success: (data) => {
                    app.state.request.page = 1
                    app.handlers.setVacancies(data.vacancies)
                    app.handlers.setPaidVacancies(data.paid)
                    app.state.pages = data.pages
                    app.handlers.addLoadButton(app.state.pages)
                    $('#v-loading').remove()
                    console.log(`sendRequest:\nvacancies: ${app.state.vacancies.length}\npages: ${app.state.pages}\non page: ${app.state.request.page}`)
                }
            })
        },
        // load more vacancies
        loadMore: (btn) => {
            btn.innerHTML = "Загрузка..."
            btn.disabled = true;
            utils.sendRequest('/vacancies/load', 'POST', JSON.stringify(app.state.request), {
                success: (data) => {
                    app.handlers.addVacancies(data.vacancies)
                    app.state.pages = data.pages
                    app.state.request.page++
                    app.handlers.addLoadButton(app.state.pages)
                    btn.disabled = false;
                    btn.innerHTML = "Загрузить ещё"
                    console.log(`sendRequest:\nvacancies: ${app.state.vacancies.length}\npages: ${app.state.pages}\non page: ${app.state.request.page}`)
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
        addVacancies: (vacancies) => {
            app.state.vacancies = []
            document.getElementById("vacancies").innerHTML += vacancies.map(
                v => {
                    app.state.vacancies.push(v);
                    return components.renderVacancy(v)
                }
            ).join('')
        },
        // remove current vacancies and set new ones
        setVacancies: (vacancies) => {
            document.getElementById("vacancies").innerHTML = ""
            app.handlers.addVacancies(vacancies)
        },
        setPaidVacancies: (vacancies) => {
            document.getElementById("paid-vacancies").innerHTML = ""
            app.state.paidVacancies = []
            document.getElementById("paid-vacancies").innerHTML = vacancies.map(
                v => {
                    app.state.paidVacancies.push(v);
                    return components.renderVacancy(v)
                }
            ).join('')
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
                // if no element with id 'load-more', then place such element after 'vacancies'
                !document.getElementById("loadbtn") && $("#loadbtn-container").append("<button id='loadbtn' onclick='app.handlers.loadMore(this)'>Загрузить ещё</button>")
            } else {
                $('#loadbtn').remove()
            }
        },
        isTagActive: (value) => {
            if (app.state.request.tags.tech.includes(value) || app.state.request.tags.type.includes(value)) {
                return true
            }
            return false
        },
        setupEmail: () => {
            document.getElementById('email').setAttribute('href', 'mailto:thedenisnikulin@gmail.com')
            $('a[href^=mailto]').each(function() {
                var href = $(this).attr('href');
                $(this).click(function() {
                var t;
                var self = $(this);

                $(window).blur(function() {
                    // The browser apparently responded, so stop the timeout.
                    clearTimeout(t);
                });

                t = setTimeout(function() {
                    // The browser did not respond after 500ms, so open an alternative URL.
                    document.location.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=thedenisnikulin@gmail.com';
                }, 500);
                });
            });
        }
    }
}
