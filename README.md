# self-taught-dev.ru

![](https://user-images.githubusercontent.com/46903210/99264423-7c5e5e80-2831-11eb-835e-5bac1835bdf6.jpg)


<h5 align="center">Figma preview. May differ from original layout.</h5>

The first Russian service that makes finding an IT job without a CS degree easier.

---

According to the business goals, the app is divided into 2 parts: the vacancy aggregator and the vacancy publishment.

### Vacancy aggregator
The main page where all the vacancies are displayed. Vacancies are parsed using [hh.ru API](https://github.com/hhru/api).

- Client chooses tags (technologies, type, city) that represent the job characteristics. The request with this data is sent to the server.
- The server sends a request to the hh.ru API using the client-provided tags as payload and receives the vacancies.
- The server filters the received list of vacancies with a dead-simple filter that just excludes any vacancies that contain such keywords as "bachelor, degree, student, etc.."
- The server sends the vacancies to the client.

### Vacancy publisment
Any people can publish a vacancy in the vacancy aggregator. The payment processing is implemented using [QIWI API](https://developer.qiwi.com/ru/p2p-payments)

- The client fills the vacancy data in a vacancy constructor. The data is being hashed, and stored in the local storage of the browser as `stdru.hashedvacancy` along with the normal data as `stdru.vacancy`.
- The hashed data is being sent to the server. It is used as a bill ID for the QIWI payment. The server sends request to the QIWI API with the bill ID and other useful information such as amount of the invoice, and receives `payUrl`. 
- The server sends `payUrl` back to the client, because QIWI client-side JS library will use it to build a payment pop-up.
- When the client has finished the payment procedure, the browser sends a request payloaded with `stdru.hashedvacancy` to the server, verifies if the invoice is paid, and save the vacancy in the database. If the client accidentally closed the website, the request will be send the next time the client opens the website.

Also, I implemented a promocode discount system. The promocodes are stored in the database with the amount of discount they provide.
The promocodes can be added to the database with the built-in Administration page that is provided by Django framework by default (see: `http://www.self-taught-dev.ru/admin`).
The promocodes can be used by pasting `?promo=PROMOCODE` to the end of the URL of the vacancy publisment page. For example, `http://www.self-taught-dev.ru/bills/create?promo=HELLO` that's how we can use "HELLO" promocode.

### Environment variables
`DJANGO_SECRETKEY` = Django secret key

`DATABASE_URL`= postgres://user:secret@localhost:5432/mydatabasename

`QIWI_DEFAULT_AMOUNT` = invoice amount https://developer.qiwi.com/ru/p2p-payments/#http

`QIWI_SECRET` = from https://qiwi.com/p2p-admin/transfers/api

`QIWI_THEME_CODE` = https://developer.qiwi.com/ru/p2p-payments/#custom

### Run locally
1.Clone the repo
```
git clone https://github.com/thedenisnikulin/self-taught-dev.ru
cd self-taught-dev.ru
```
2. Install requirements
```
pip install -r requirements.txt
```
3. Create `.env` and configure environment variables in the root directory of the project
```
touch .env
# configuration stuff goes here ...
```
4. Run
```
python manage.py runserver
```
