const Fx  = require( '../../support/functions' );
const Aux = require( '../../support/aux' );
const moment = require( '../../../src/js/moment' );

describe( 'REScalendar test', function() {
  	
  	execute_calendar_init_test({
		format: 'DD/MM/YYYY',
		wrapper_div: '#my_calendar1'
	});
	
	execute_calendar_init_test({
		format: 'YYYY-MM-DD',
		wrapper_div: '#my_calendar_en'
	});
	
	execute_calendar_init_test({
		format: 'YYYY-MM-DD',
		wrapper_div: '#my_calendar_simple'
	});

	execute_calendar_init_test({
		format: 'YYYY-MM-DD',
		wrapper_div: '#my_calendar_calSize',
		jumpSize: 5
	});


	function execute_calendar_init_test(obj_options){

		var format      = obj_options.format,
			wrapper_div = obj_options.wrapper_div + ' ',
			jumpSize    = obj_options.jumpSize || 15;

		context('Initialization tests', function(){
		    
		    before( function(){
	  			cy.visit('http://localhost/rescalendar/demo/index.html')
	  		});

		    beforeEach(function(){

		    });

			it('Has wrapper div', function() {

		    	cy.get('div.my_calendar1_wrapper').should('be.visible');

		    });

			it('Has date input defaulting today', function() {

				cy.get(wrapper_div + 'input.refDate')
				    .should('be.visible')
				    .and('have.value', moment().format(format) );
				
			});

			it('Has move buttons', function() {

		    	cy.get(wrapper_div + '.move_to_last_month').should('be.visible');
		    	cy.get(wrapper_div + '.move_to_yesterday').should('be.visible');
		    	cy.get(wrapper_div + '.move_to_tomorrow').should('be.visible');
		    	cy.get(wrapper_div + '.move_to_next_month').should('be.visible');

		    	cy.get(wrapper_div + '.move_to_today').should('be.visible');
		    	
		    });

			it('Has day row cells', function() {

				// 32 porque son 15 por cada lado, + 1 para que quede simétrico, + 1 first column
				var num_cells = 32;

				if( obj_options.wrapper_div == '#my_calendar_calSize' ){
					num_cells = 12;
				}

				cy.get(wrapper_div + '.rescalendar_day_cells').should('be.visible');

				expect( Cypress.$(wrapper_div + '.rescalendar_day_cells td').length ).to.equal( num_cells ); 

				cy.get(wrapper_div + '.rescalendar_day_cells .today').should('be.visible');
				cy.get(wrapper_div + '.rescalendar_day_cells .middleDay').should('be.visible');

				expect( Cypress.$(wrapper_div + 'span.dia').length ).to.be.greaterThan(0); 
				expect( Cypress.$(wrapper_div + 'span.dia_semana').length ).to.be.greaterThan(0); 
				expect( Cypress.$(wrapper_div + 'span.mes').length ).to.be.greaterThan(0); 

			});

			it('Has firstColumn cells', function() {

				expect( Cypress.$(wrapper_div + '.firstColumn').length ).to.be.greaterThan(0); 

			});


			after( function(){


	  		});

		});


	  	context('Date change tests', function(){
		    
			it('Moves one day right when clicking on move_to_tomorrow', function(){

				test_move_days('.move_to_tomorrow', 1, 'add');

			});

			it('Moves one day left when clicking on move_to_yesterday', function(){

				test_move_days('.move_to_yesterday', 1, 'subtract');

			});

			it('Moves 15 days right when clicking on move_to_next_month', function(){

				test_move_days('.move_to_next_month', jumpSize, 'add');

			});

			it('Moves 15 days left when clicking on move_to_next_month', function(){

				test_move_days('.move_to_last_month', jumpSize, 'subtract');

			});

			it('Moves when clicking on a day', function(){

				var refDate = Cypress.$(wrapper_div + 'input.refDate').val(),
					new_day = moment(refDate, format).add(3, 'days').format(format);

				cy.get(wrapper_div + 'td.day_cell[data-celldate="' + new_day + '"]').click();

				cy.wait( 500 ).then( function(){
					refDate = Cypress.$(wrapper_div + 'input.refDate').val();
					expect( refDate ).to.equal( new_day );
				});

			});

			it('Moves when changing refDate input', function(){

				var refDate 	 = Cypress.$(wrapper_div + 'input.refDate').val(),
					middleDayVal = '',
					new_day 	 = moment(refDate, format).add(5, 'days').format( format );
				
				cy.get(wrapper_div + 'input.refDate')
					.clear()
					.type(new_day)
					.blur({force: true});

				cy.wait( 500 ).then( function(){
					
					refDate = Cypress.$(wrapper_div + 'input.refDate').val();
					expect( refDate ).to.equal( new_day );

					middleDayVal = Cypress.$(wrapper_div + 'td.middleDay').attr( 'data-celldate' );				
					expect( middleDayVal ).to.equal( refDate );

				});		

			});

		});


		context('Data management tests', function(){
		    


	    	it('Has data rows', function() {

	    		expect( Cypress.$(wrapper_div + 'tr.dataRow').length ).to.be.greaterThan(0);
				expect( Cypress.$(wrapper_div + 'tr.dataRow td.firstColumn').text().length ).to.be.greaterThan(0);
		    	
		    });

		    it('Has hasEvent classes', function() {

				if( obj_options.wrapper_div != '#my_calendar_simple' ){

					// Must be set in initialization
					var dateInRange = moment('01/03/2019','DD/MM/YYYY').format(format),
						nameInRange = 'item1',
						customClass = 'greenClass';


					if( obj_options.wrapper_div == '#my_calendar_calSize' ){
						// para que no quede fuera del rango	
						dateInRange = '2019-03-14';
						nameInRange = 'item2';
						customClass = 'blueClass';

					}

					var objCell = Cypress.$(wrapper_div + 'tr.dataRow td[data-date="' + dateInRange + '"][data-name="' + nameInRange + '"]' );
					
					expect( objCell.hasClass( 'hasEvent'  ) ).to.be.true;
					expect( objCell.hasClass( customClass ) ).to.be.true;
					
				}



		    });

		    it('Has a title attributes', function(){

		    	if( obj_options.wrapper_div != '#my_calendar_simple' ){

					expect( Cypress.$(wrapper_div + 'tr.dataRow td a[title]' ).length ).to.be.greaterThan(0);
				}

		    });		
		    
		});

		// Auxiliary functions
		function test_move_days( selector, num_days, action ){

			var refDate = Cypress.$(wrapper_div + 'input.refDate').val(),
				new_day = '';

			if( action == 'add' ){
				new_day = moment( refDate, format ).add(num_days, 'days').format( format );
			}else{
				new_day = moment( refDate, format ).subtract(num_days, 'days').format( format );
			}
			
			expect( refDate.length ).to.equal( 10 );

			cy.get( wrapper_div + selector ).click();

			cy.wait( 500 ).then( function(){
				refDate = Cypress.$(wrapper_div + 'input.refDate').val();
				expect( refDate ).to.equal( new_day );
			});

	    } // end test_move_days
	}

  	


});


