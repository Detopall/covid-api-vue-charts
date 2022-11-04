"use strict";

const URL = "covid-193.p.rapidapi.com";


const _app = Vue.createApp({
	data() {
		return {
			countryDeaths: [],
			countries: [],
			continentDeaths: [],
			continents: ["Africa", "South-America", "North-America", "All", "Oceania", "Europe", "Asia"]
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
		async fetchDataForBarChart(){
			let information = await this.getInformation();

			information = information.filter(index => {
				return !this.continents.includes(index.country);
			});

			this.countryDeaths = [];
			this.countries = [];

			information.filter(index => {
				
				if (index.deaths.total !== null && index.country !== null){
					this.countryDeaths.push(index.deaths.total);
					this.countries.push(index.country);
				}
			});

			document.querySelector("button").disabled = true;
			this.displayBarChart();
		},
		displayBarChart(){
			const ctx = document.querySelector("#covidChart").getContext('2d');
			new Chart(ctx, this.dataForBarChart());
		},

		dataForBarChart(){
				return {
				type: 'bar',
				data: {
					labels: JSON.parse(JSON.stringify(this.countries)),
					datasets: [{
						label: '# of deaths',
						data: JSON.parse(JSON.stringify(this.countryDeaths)),
						borderWidth: 1
					}]
				},
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
		},

		async fetchDataForPieChart(){
			let information = await this.getInformation();
			
			information = information.filter(index => {
				if (index.country === "All") return;
				return this.continents.includes(index.country);
			});

			this.continentDeaths = [];
			this.continents = [];

			information.filter(index => {
				if (index.deaths.total !== null && index.country !== null){
					this.continentDeaths.push(index.deaths.total);
					this.continents.push(index.country);
				}
			});

			console.log(JSON.parse(JSON.stringify(this.continentDeaths)));
			console.log(JSON.parse(JSON.stringify(this.continents)));
			this.displayPieChart();
		},

		displayPieChart(){
			const ctx = document.querySelector("#continentPieChart").getContext('2d');
			new Chart(ctx, this.dataForPieChart());
		},
		
		dataForPieChart(){
			return {
				type: 'pie',
				data: {
					labels: JSON.parse(JSON.stringify(this.continents)),
					datasets: [{
						label: '# of deaths',
						data: JSON.parse(JSON.stringify(this.continentDeaths)),
						borderWidth: 1
					}]
				},
				layout: {
					padding: {
						left: 20
					}
				},
			}
		}
	},
});


_app.mount("#app");
