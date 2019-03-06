const Fx  = require( '../../support/functions' );
const Aux = require( '../../support/aux' );

describe( 'REScalendar test', function() {
  
  	context('Initialization tests', function(){
	    
	    before( function(){
	    	// cy.visit('https://example.cypress.io/cypress-api')
  			cy.visit('http://localhost/rescalendar/demo/index.html')
  		});

	    beforeEach(function(){

	    });


		it('Has wrapper div', function() {

	    	cy.get('div.my_calendar1_wrapper').should('be.visible');

	    });

		it('Has date input defaulting today', function() {

			cy.get('#refDate')
			        .should('be.visible')
			        .and('have.value', Fx.hoy() );
			
		});

		it('Has move buttons', function() {

	    	cy.get('#move_to_last_month').should('be.visible');
	    	cy.get('#move_to_yesterday').should('be.visible');
	    	cy.get('#move_to_tomorrow').should('be.visible');
	    	cy.get('#move_to_next_month').should('be.visible');

	    });


		it('Has day row cells', function() {

			cy.get('#rescalendar_day_cells').should('be.visible');

			expect( Cypress.$('#rescalendar_day_cells td').length ).to.equal(30);

			cy.get('#rescalendar_day_cells .today').should('be.visible');


		});


		after( function(){
  			


  		});

	});

});


