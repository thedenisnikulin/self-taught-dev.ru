const components = {
    cityDropdownMenu: () => {
        return `<div class="city-tags dropdown">
                <button id="dd-button" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    Выберите город
                <span class="caret"></span></button>
                <ul class="dropdown-menu">
                    <li class="dropdown-header">Россия</li>
                    <li><a href="#">Москва</a></li>
                    <li><a href="#">Санкт-Петербург</a></li>
                    <li><a href="#">Владивосток</a></li>
                    <li><a href="#">Волгоград</a></li>
                    <li><a href="#">Воронеж</a></li>
                    <li><a href="#">Екатеринбург</a></li>
                    <li><a href="#">Казань</a></li>
                    <li><a href="#">Калуга</a></li>
                    <li><a href="#">Краснодар</a></li>
                    <li><a href="#">Красноярск</a></li>
                    <li><a href="#">Кемерово</a></li>
                    <li><a href="#">Нижний Новгород</a></li>
                    <li><a href="#">Новосибирск</a></li>
                    <li><a href="#">Ростов-на-Дону</a></li>
                    <li><a href="#">Самара</a></li>
                    <li><a href="#">Саратов</a></li>
                    <li><a href="#">Сочи</a></li>
                    <li><a href="#">Уфа</a></li>
                    <li><a href="#">Ярославль</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Украина</li>
                    <li><a href="#">Киев</a></li>
                    <li><a href="#">Днепр</a></li>
                    <li><a href="#">Львов</a></li>
                    <li><a href="#">Одесса</a></li>
                    <li><a href="#">Харьков</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Беларусь</li>
                    <li><a href="#">Минск</a></li>
                    <li><a href="#">Брест</a></li>
                    <li><a href="#">Витебск</a></li>
                    <li><a href="#">Гомель</a></li>
                    <li><a href="#">Гродно</a></li>
                    <li><a href="#">Могилев</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Казахстан</li>
                    <li><a href="#">Нур-султан</a></li>
                </ul>
            </div>
        `},
        renderVacancy: (vacancy) => `
            <div style="border: 3px ${vacancy.color} solid" class="vacancy">
                <div class="v-start-container">
                    <img class="employer_logo" src=${vacancy.employer_logo}></img>
                    <div class='v-mid-container'>
                        <p class="name">${vacancy.name}</p>
                        <div><span class="employer">${vacancy.employer}</span><span>, </span><span class='date'>${vacancy.date}</span></div>
                        <div class="v-tags">
                            ${vacancy.tags.type.map(t => `<div class="v-type">${t}</div>`).join('')}
                            ${vacancy.tags.tech.map(t => `<div class="v-tech">${t}</div>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="v-end-container">
                    <p class="city">${vacancy.tags.city}</p>
                    <button class="respond-btn" onclick="window.open('${vacancy.url}', '_blank')">Ссылка на сайт</button>
                </div>
            </div>
        `,
        renderGenerator: (vacancy) =>
        $('.main-container').html(
            `<div class='generate-by-link-container'>
                ${components.renderVacancy(vacancy)}
                <div class="gen-content">
                    <p class='gen-text'>Введите ссылку на вашу вакансию на hh.ru</p>
                    <form class='gen-form'onsubmit="return hiring.handlers.requestJobByLink()">
                        <input class="hhru-link" placeholder="https://hh.ru/vacancy/12345678"  name="hhru-link" onchange="hiring.state.jobLink = this.value">
                        <input type="submit" class="gen-btn gi" value="Сгенерировать вакансию">
                    </form>
                    <p class='gen-text gi'>или</p>
                    <button class="fill-in-btn" onclick="components.renderEditor(hiring.state.job)">Заполнить самостоятельно</button>
                </div>
            </div>
        `),
        renderEditor: (vacancy) => /*html */
        $('.main-container').html(`
            <div class="editor-container">
                <p class="e-title">Редактор вакансии</p>
                ${components.renderVacancy(vacancy)}
                <div class="editor">
                    <form class="editor-form" onsubmit="return hiring.handlers.handleSubmit()">
                        <div class='e-main'>
                            <div class="e-form-container">
                                <div class="e-form">
                                    <label>Название должности</label>
                                    <input class="f-inp" name="name" onchange="hiring.handlers.handleChange(this)">
                                    <label>Название компании</label>
                                    <input class="f-inp" name="employer" onchange="hiring.handlers.handleChange(this)">
                                    <label>Ссылка на логотип компании</label>
                                    <input class="f-inp" name="employer_logo" onchange="hiring.handlers.handleChange(this)">
                                </div>
                                <div class="e-form">
                                    <label>Город</label>
                                    <input class='city-to-replace f-inp' name="city" onchange="hiring.handlers.handleChange(this)">
                                    <label>Цвет границ</label>
                                    <input class="f-inp" placeholder='#F5BA78' name="color" onchange="hiring.handlers.handleChange(this)">
                                    <label>Ссылка для отклика</label>
                                    <input class="f-inp" name="url" onchange="hiring.handlers.handleChange(this)">
                                </div>
                            </div>
                        </div>
                        <label>Метки</label>
                        <input type="text" class='tags-editor'>
                        <input onclick="components.renderPaymentProcessor(hiring.state.job)" type="submit" class="gen-btn gi" value="Продолжить">
                    </form>
                    <p class='gen-text gi'>или</p>
                    <button class="fill-in-btn" onclick="components.renderGenerator(hiring.state.job)">Заполнить по ссылке</button>
                </div>
            </div>
        `),
        renderPaymentProcessor: (vacancy) => 
        $('.main-container').html(`
            <div class='payment-container'>
                <p class="e-title">Вакансия готова к размещению!</p>
                ${components.renderVacancy(vacancy)}
                <div class="pay-btn-container">
                    <button class="pay-btn" onclick="hiring.handlers.requestPayment()">Оплатить</button>
                    <p>Стоимость услуги: 300 рублей</p>
                </div>
            </div>
        `),
}