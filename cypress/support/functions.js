const Moment = require( '../../src/js/moment' );

var Fx = {

	hoy: function(){

		// Devuelve el día de hoy, formato d/m/Y
		// var today = new Date();
		// return this.zeroFill( today.getDate(), 2) + '/' + this.zeroFill( (today.getMonth() + 1) , 2 ) + '/' + today.getFullYear();

		var formato = 'DD/MM/YYYY';

		return Moment().format( formato );

	},

};

module.exports = Fx;