"use strict";

const URL = "covid-193.p.rapidapi.com";
const countriesNotAllowed = ["Africa", "South-America", "North-America", "All", "Oceania", "Europe", "Asia"];

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
			let information = await this.getInformation();

			information = information.filter(index => {
				return !countriesNotAllowed.includes(index.country);
			});

			this.totalDeaths = [];
			this.allCountries = [];

			information.filter(index => {
				
				if (index.deaths.total !== null && index.country !== null){
					this.totalDeaths.push(index.deaths.total);
					this.allCountries.push(index.country);
				}
			});

			console.log(JSON.parse(JSON.stringify(this.totalDeaths)));
			console.log(JSON.parse(JSON.stringify(this.allCountries)));
			document.querySelector("button").disabled = true;
			this.displayChart();
		},
		displayChart(){
			const ctx = document.querySelector("#covidChart").getContext('2d');
			new Chart(ctx, this.getDataForChart());
		},

		getDataForChart(){
				return {
				type: 'bar',
				data: {
					labels: JSON.parse(JSON.stringify(this.allCountries)),
					datasets: [{
						label: '# of deaths',
						data: JSON.parse(JSON.stringify(this.totalDeaths)),
						borderWidth: 1
					}]
				},
				backgroundColor: [
					"rgb(255, 255, 255)"
				],
				layout: {
					padding: {
						left: 20
					}
				},
				options: {
					maintainAspectRatio: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},	
				}
			}
		}
	},
});


_app.mount("#app");
