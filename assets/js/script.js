"use strict";

const URL = "covid-193.p.rapidapi.com";

const _app = Vue.createApp({
	data() {
		return {
			totalDeaths: [],
			allCountries: []
		}
	},
	methods: {
		getOptions(){
			return {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': `${this.$refs.apiKey.value}`,
					'X-RapidAPI-Host': `${URL}`
				}
			};
		},
		getInformation(){
			if (this.$refs.apiKey === null) return;
			const options = this.getOptions();
			
			return fetch(`https://${URL}/statistics`, options)
			.then(res => res.json())
			.then(res => res.response);
		},
		async groupInformation(){
			const information = await this.getInformation();

			information.filter(index => {
				if (index.deaths.total !== null && index.country !== null){
					this.totalDeaths.push(index.deaths.total);
					this.allCountries.push(index.country);
				}
			});

			console.log(JSON.parse(JSON.stringify(this.totalDeaths)));
			console.log(JSON.parse(JSON.stringify(this.allCountries)));

		}
	},
});

/*
information.forEach(index => {
				this.totalDeaths.push(index.deaths.total);
			});

information.forEach(index => {
	this.allCountries.push(index.country);
});


JSON.parse(JSON.stringify(this.totalDeaths));
JSON.parse(JSON.stringify(this.allCountries));
*/

_app.mount("#app");
