$(document).ready(function () {
	salesChart()
	expenseChart();
	profitChart();
	lineChart();
	columnChart();
});

function lineChart() {
	var options = {
		chart: {
			type: 'line',
			toolbar: {
				show: true,
				tools: {
					download: true,
					zoom: false,
					zoomin: false,
					zoomout: false,
					pan: false,
					reset: false
				}
			}
		},
		series: [{
			name: 'sales',
			data: [30,40,35,50,49,60,70,91,125]
		}],
		xaxis: {
			categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
		}
	}

	var lineChart = new ApexCharts(document.querySelector("#line-chart"), options);

	lineChart.render();
}

function columnChart() {
	var options = {
		series: [{
			name: 'Net Profit',
			data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
		}, {
			name: 'Revenue',
			data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
		}, {
			name: 'Free Cash Flow',
			data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
		}],
		chart: {
			type: 'bar',
			height: 350
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
				endingShape: 'rounded'
			},
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent']
		},
		xaxis: {
			categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
		},
		yaxis: {
			title: {
				text: '$ (thousands)'
			}
		},
		fill: {
			opacity: 1
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return "$ " + val + " thousands"
				}
			}
		}
	};

	var colChart = new ApexCharts(document.querySelector("#col-chart"), options);
	colChart.render();
}

function salesChart() {
	var sales = {
		theme: {
			palette: 'palette1'
		},
		chart: {
			type: 'area',
			height: 200,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			curve: 'straight'
		},
		fill: {
			opacity: 1,
		},
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		yaxis: {
			min: 0
		},
		series: [{
			name: 'Sales',
			data:getRandomData()
		}],
		title: {
			text: `$${applyThousandSeparator(Math.floor(599999 * Math.random()))}`,
			offsetX: 30,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Sales',
			offsetX: 30,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}

	var salesChart = new ApexCharts(document.querySelector("#sales"), sales);
	salesChart.render();
}

function expenseChart() {
	var expense = {
		theme: {
			palette: 'palette4'
		},
		chart: {
			type: 'area',
			height: 200,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			curve: 'straight'
		},
		fill: {
			opacity: 1,
		},
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		yaxis: {
			min: 0
		},
		series: [{
			name: 'Expenses',
			data: getRandomData()
		}],
		title: {
			text: `$${applyThousandSeparator(Math.floor(599999 * Math.random()))}`,
			offsetX: 30,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Expenses',
			offsetX: 30,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}

	var expenseChart = new ApexCharts(document.querySelector("#expense"), expense);
	expenseChart.render();
}

function profitChart() {
	var profit = {
		theme: {
			palette: 'palette7'
		},
		chart: {
			pa: '',
			type: 'area',
			height: 200,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			curve: 'straight'
		},
		fill: {
			opacity: 1,
		},
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		yaxis: {
			min: 0
		},
		series: [{
			name: 'Profits',
			data: getRandomData()
		}],
		title: {
			text: `$${applyThousandSeparator(Math.floor(599999 * Math.random()))}`,
			offsetX: 30,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Profits',
			offsetX: 30,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}

	var profitChart = new ApexCharts(document.querySelector("#profit"), profit);
	profitChart.render();
}

function getRandomData() {
	let data = [];
	for (let i = 0; i < 50; i++) {
		data.push(599 * Math.random());
	}

	return data;
}

function applyThousandSeparator(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}