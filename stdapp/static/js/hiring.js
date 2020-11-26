let hiring = {
	state: {
		vacancy: {
			name: 'Должность',
			employer: 'Ваша компания',
			employer_logo: '/static/img/nophoto.png',
			tags: {
				tech: [],
				type: [],
				city: 'Город',
			},
			url: '',
			date: new Date().toISOString().slice(0,10),
			color: '#F5BA78'
		},
		vacancyLink: ''
	},
	handlers: {
		requestPayment: () => {
			const hashedVacancy = 
				utils.generateHash(JSON.stringify(hiring.state.vacancy) 
				+ new Date().toISOString()).toString();
			const billData = {
				billId: hashedVacancy,
				promocode: new URLSearchParams(window.location.search).get('promo')
			};
			localStorage.setItem('stdru.vacancy', JSON.stringify(hiring.state.vacancy));
			localStorage.setItem('stdru.hashedvacancy', hashedVacancy);

			utils.sendRequest('/bills/create', 'POST', JSON.stringify(billData), {
				success: (response) => {
					hiring.handlers.openBill(response.payUrl)
				}
			})
			return false
		},
		handleChange: (el) => {
			const { value, name } = el;
			hiring.state.vacancy = { ...hiring.state.vacancy, [name]: value };
			if (name === "employer_logo") {
				$('.employer_logo').attr('src', value)
			} else if (name === 'color') {
				let v = value.startsWith('#') ? value : `#${value}`
				$('.vacancy').attr('style', `border: 3px ${v} solid`)
				hiring.state.vacancy.color = v;
			} else if (name === 'url') {
				$('.respond-btn').attr('onclick', `window.open('${value}', '_blank')`)
			} else {
				$(`.${name}`).html(value)
			}
		},
		openBill: (payUrl) => {
			params = {
				payUrl: payUrl
			}
			QiwiCheckout.openInvoice(params)
				.then(() => {
					hiring.handlers.verifyBill(
						localStorage.getItem('stdru.hashedvacancy')
					);
				})
				.catch(error => {
					if (error.reason === "POPUP_CLOSED") {
						hiring.handlers.verifyBill(
							localStorage.getItem('stdru.hashedvacancy')
						);
					}
				});
		},
		verifyBill: () => {
			utils.sendRequest(
				'/bills/verify', 
				'POST', 
				localStorage.getItem('stdru.hashedvacancy'), {
				success: (response) => {
					if (response.isPaid === true) {
						// Save to database
						utils.sendRequest(
							'/vacancies/create', 
							'POST', 
							localStorage.getItem('stdru.vacancy'), {
							success: () => {
								localStorage.removeItem('stdru.hashedvacancy')
								localStorage.removeItem('stdru.vacancy');
							},
						})
					}
				}
			})
		},
		requestVacancyByLink: () => {
			utils.sendRequest(
				'/vacancies/getbylink', 
				'POST', 
				JSON.stringify({vacancyLink: hiring.state.vacancyLink}), {
				success: (response) => {
					$('.v-tags').html('')
					response.vacancy.color = '#F5BA78'
					hiring.state.vacancy = response.vacancy
					components.renderGenerator(hiring.state.vacancy)
					$('.gen-content').html(`
					<button 
						onclick='components.renderPaymentProcessor(hiring.state.vacancy)' 
						class='gen-btn gi'>
						Продолжить
					</button>`)
				}
			});
			return false;
		},
	}
}
