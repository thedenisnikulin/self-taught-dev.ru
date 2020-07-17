// -------------------- state
let request = {
    tags: {
        tech: [],
        type: [],
        city: '',
    },
    page: 1
}
let vacancies = []

let pagesNum = 1
let currentPageNum = 1;

// -------------------- handlers
const setCity = () => {
    const city = document.getElementById('dd-city-list').value
    request.city = city
}

const addVacancies = (jobs) => {
    vacancies = []
    for (let j=0; j<jobs.length; j++) {
        vacancies.push(
            `<div class="vacancy">
                <p class="name">${jobs[j].name}<\p>
                <p class="employer">${jobs[j].employer}<\p>
                <p class="city">${jobs[j].city}<\p>
                <p class="tags">${jobs[j].tags.type.concat(jobs[j].tags.tech)}<\p>
                <p class="url">${jobs[j].url}<\p>
                <p class="date">${jobs[j].date}<\p>
            <\div>`
        )
        document.getElementsByClassName("vacancies")[0].innerHTML += vacancies[j]
    }
}

const setVacancies = (jobs) => {
    document.getElementsByClassName("vacancies")[0].innerHTML = ""
    addVacancies(jobs)
}

const setRequest = (value, className) => {
    if (className === 'type') {
        if (request.type.includes(value)) {
            // if value is already chosen, then delete it
            let ind = request.type.indexOf(value)
            request.type.splice(ind, 1)
        } else {
            // if value isn't chosen, then add it
            request.type.push(value)
        }
    } else if (className === 'tech') {
        if (request.tech.includes(value)) {
            let ind = request.tech.indexOf(value)
            request.tech.splice(ind, 1)
        } else {
            request.tech.push(value)
        }
    }
    console.log(request)
}

const sendRequest = () => {
    $.ajax({
        url: '',
        type: 'POST',
        // some csrf token setups
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        data: JSON.stringify(request),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: (data) => {
            data = JSON.parse(data)
            console.log(data)
            setVacancies(data.jobs)
            pages = data.pages
        },
        error: () => {
            alert('Internal Server Error.')
        }
    });
}

const loadMore = () => {
    pagesNum -= 1;
    currentPageNum += 1;
    $.ajax({
        url: '',
        type: 'POST',
        // some csrf token setups
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        data: request,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: (data) => {
            data = JSON.parse(data)
            console.log(data)
            setVacancies(data.jobs)
            pages = data.pages
        },
        error: () => {
            alert('Internal Server Error.')
        }
    });
}