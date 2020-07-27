const components = {
    cityDropdownMenu: () => {
        const buttonOrInput = `<button onclick="hiring.handlers.handleChange(this)" id="dd-button" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Выберите город
        <span class="caret"></span></button>`
        return `<div class="city-tags dropdown">
                ${buttonOrInput}
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
        </div>`},
        hiringTagsDropdown: ``,
        generatorVacancyByLink: `
        <div class='generate-by-link-container'>
            <div class='vacancy'>
                <div style="border: 3px #EA80BF solid" class="vacancy">
                    <div class="v-start-container">
                        <img class="employer_logo" src="/static/nophoto.png"></img>
                        <div class='v-mid-container'>
                            <p class="name">Название должности</p>
                            <div><span class="employer">Название вашей компании</span><span>, </span><span class='date'>2020-07-26</span></div>
                            <div class="v-tags"></div>
                        </div>
                    </div>
                    <div class="v-end-container">
                        <p class="city">Город</p>
                        <button class="respond-btn" onclick="window.open('https://www.google.com', '_blank')">Ссылка на сайт</button>
                    </div>
                </div>

            </div>
            <div class="gen-content">
                <p class='gen-text'>Введите ссылку на вашу вакансию на hh.ru</p>
                <form class='gen-form' onsubmit="return hiring.handlers.requestJobByLink()">
                    <input class="hhru-link" name="hhru-link" onchange="hiring.state.jobLink = this.value">
                    <input type="submit" class="gen-btn gi" value="Сгенерировать вакансию">
                </form>
                <p class='gen-text gi'>или</p>
                <button class="fill-in-btn" onclick="hiring.handlers.switchToEditor()">Заполнить самостоятельно</button>
            </div>
        </div>
        `,
        vacancyEditor: `
        <div class="editor-container">
            <p>Редактор вакансии</p>
            <div style="border: 3px #EA80BF solid" class="vacancy">
                <div class="v-start-container">
                    <img class="employer_logo" src="/static/nophoto.png"></img>
                    <div class='v-mid-container'>
                        <p class="name">Название должности</p>
                        <div><span class="employer">Название вашей компании</span><span>, </span><span class='date'>2020-07-26</span></div>
                        <div class="v-tags"></div>
                    </div>
                </div>
                <div class="v-end-container">
                    <p class="city">Город</p>
                    <button class="respond-btn" onclick="window.open('https://www.google.com', '_blank')">Ссылка на сайт</button>
                </div>
            </div>
            <div class="editor">
                <form class="editor-form" onsubmit="return hiring.handlers.handleSubmit()">
                    <div class='e-main'>
                        <input placeholder='name' name="name" onchange="hiring.handlers.handleChange(this)">
                        <input placeholder='employer' name="employer" onchange="hiring.handlers.handleChange(this)">
                        <input placeholder='employer_logo' name="employer_logo" onchange="hiring.handlers.handleChange(this)">
                        <input class='city-to-replace' name="city" onchange="hiring.handlers.handleChange(this)">
                        <input placeholder='color' name="color" onchange="hiring.handlers.handleChange(this)">
                        <input placeholder='url' name="url" onchange="hiring.handlers.handleChange(this)">
                    </div>
                    <input type="text" class='tags-editor'>
                    <input type="submit" class="gen-btn gi" value="Сгенерировать вакансию">
                </form>
                <p class='gen-text gi'>или</p>
                <button class="fill-in-btn" onclick="hiring.handlers.switchToGenerator()">Заполнить по ссылке</button>
            </div>
        </div>
        `,

}