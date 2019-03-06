
const Fx  = require( './functions' );

var Aux = {

	/*
	base_url: 'http://localhost/sanjuan2/',
	base_api: 'http://localhost/sanjuan2/api/',

	salir: function(){

		cy.test_api('quitar_en_pruebas', {nif_asesor: '22222222J'} );
	    cy.test_api('poner_en_pruebas', {nif_asesor: '33333333P'} );

		Aux.quitar_swals();

		var url  =  this.base_api + 'asesores.php',
			data = {
				accion: 'logout',
				hash: localStorage.getItem('sanjuan')
			};

		cy.request({
	        url: url,
	        method: 'POST',
	        form: true,
	        body: data
	    });
	  	
		localStorage.removeItem('sanjuan');
	  	
	},


	abrir_elementos_tabla: function(){

		if( Cypress.$('.dataTables_length').length == 1 ){
			
			cy.get('.dataTables_length select:first')
				.select( '-1', {force: true} )
				.trigger( 'change', {force: true} );
		
		}

		if( !Cypress.$('tr.child').is(':visible')  ){
			
			cy.get( 'td.sorting_1' ).each(($el, index, $list) => {

				$el.click( {force: true} );

			});

		}

	},


	mostrar_u_ocultar_dropdown: function( contenedor, opcion ){

		var contenedor 	   = contenedor || '',
			opcion         = opcion     || '',
			selector_boton = contenedor + ' button.dropdown-toggle',
			selector_menu  = contenedor + ' ul.dropdown-menu';

		cy.log(selector_boton);

		if( opcion == '' ){
			
			cy.get( selector_boton ).click( {force: true} );
		
		}else{

			if( opcion == 'mostrar' ){
				
				if( !Cypress.$( selector_menu ).is(':visible') ){
					cy.get( selector_boton ).click( {force: true} );
				}
						
			}else if(opcion == 'ocultar' ){
				
				if( Cypress.$( selector_menu ).is(':visible') ){
					cy.get( selector_boton ).click( {force: true} );
				}

			}

		}

	},


	mostrar_dropdown: function( contenedor ){

		Aux.mostrar_u_ocultar_dropdown( contenedor, 'mostrar' );

	},

	ocultar_dropdown: function(contenedor){

		Aux.mostrar_u_ocultar_dropdown( contenedor, 'ocultar' );

	},



	
	desplegar_acciones_tabla: function( contenedor ){

		var contenedor = contenedor || '';

		function btn_acciones_visible( contenedor ){
			return Cypress.$( contenedor + ' tr:eq(2) button.dropdown-toggle:first').is(':visible');
		}

		if( btn_acciones_visible( contenedor ) == true ){

			// Si el botón de acciones está visible en la tabla

			if( !Cypress.$( contenedor + ' ul.dropdown-menu').is(':visible') ){
				cy.get( contenedor + ' button.dropdown-toggle:first' ).click({force: true});
			}

		}else{

			// Si el botón de acciones está oculto porque la tabla es demasiado grande

			var selector     = contenedor + ' td.acciones:first',
				btn_acciones = Cypress.$( selector + ' button.dropdown-toggle');

			if( !Cypress.$( contenedor + 'td.acciones:first button.dropdown-toggle').is(':visible') ){
				cy.get('td.celda_check:first').click({force: true});
			}

			if( !Cypress.$( selector + ' ul.dropdown-menu').is(':visible') ){
				btn_acciones.removeAttr('disabled').click({force: true});
			}

		}

	},

	test_confirm_tabla: function( selector ){

		var match = false,
			primer_elemento = selector + ':first';
		
		Aux.abrir_elementos_tabla();

		cy.get( 'td.sorting_1' ).each(($el, index, $list) => {

			if( 
				match == false &&
				Cypress.$( primer_elemento).length == 1 
			){
				
				
				Aux.expect_confirm( primer_elemento );

				match = true;

			}

		});

	}, // fin test_confirm_tabla

	test_pestana_carga_tabla: function( obj_opciones ){

		var titulo  	   = obj_opciones.titulo		 || '',
			endpoint       = obj_opciones.endpoint 		 || '',
			alias_endpoint = obj_opciones.alias_endpoint || '',
			contenedor     = obj_opciones.contenedor 	 || '',
			trigger        = obj_opciones.trigger 		 || '';

		if( trigger == '' || contenedor == '' || endpoint == '' || alias_endpoint == '' ){

			console.log('No exite alguna variable: test_pestana_carga_tabla ' + JSON.stringify(obj_opciones) );
			return false;
		
		}

		it('Carga ' + titulo, function() {
			
			Aux.quitar_swals();

			Aux.declarar_endpoint( endpoint );
			cy.get( trigger ).click({force: true});

			cy.wait( alias_endpoint ).then( function(xhr){

				var arr_resp_json = xhr.response.body;

				if( typeof arr_resp_json == 'object' ){

					if( arr_resp_json.length == 0 ){
						Aux.expect_existe_alert(contenedor);
					}else{
						expect( Cypress.$( contenedor + ' table tr' ).length ).to.be.greaterThan(0);		
					}

				}


			});
			
		});

	},

	expect_confirm: function( selector ){

		cy.get( selector ).click({force: true});

		cy.wait( 100 ).then( function(xhr){ // SweetAlert

	    	expect( Cypress.$( 'button.confirm' ).length ).to.equal(1);

	    	if( Cypress.$( 'button.cancel' ).length > 0 ){
	    		
	    		cy.get( 'button.cancel' ).each(($el, index, $list) => {

					$el.click({force: true});

				});
	    	}

	    	if( 
	    		Cypress.$( 'button.confirm' ).length > 0 && 
	    		Cypress.$( 'button.confirm' ).text().toUpperCase() == 'OK' 
	    	){
	    		
	    		cy.get( 'button.confirm' ).each(($el, index, $list) => {

					$el.click({force: true});

				});

	    	}


		});

	},

	check_elementos: function( arr_selectores ){

		var length = 0;

		arr_selectores.forEach( function(selector){

			cy.get(selector).should(() => {

				length = Cypress.$( selector ).length;

				if( length == 0 && selector != '' ){
					console.log( 'Elemento no se encuentra: ' + selector);
				}

			  	expect( length ).to.be.greaterThan(0);
			
			});

		});

	},

	check_form: function( arr_elem, clase ){

		if( typeof arr_elem == 'string' ){
			arr_elem = [ arr_elem ];
		}

		arr_elem.forEach(function( value ){
			expect( Cypress.$( value ).hasClass( clase ) ).to.be.true;
		});

	},

	check_primer_checkbox: function( contenedor ){

		var contenedor = contenedor || '#tabla_lista_facturas',
			selector = contenedor + ' td input[type="checkbox"]:first';

		if( !Cypress.$(selector).is(':checked') ){
			cy.get(selector).click({force: true});
		}

	},

	detectar_modal: function( selector ){

		var selector = selector || '';

		cy.wait( 500 ).then( function(){

	    	expect( Cypress.$( selector + ' div.modal-body' ).length ).to.be.greaterThan(0);
			// expect( Cypress.$( 'div.modal-body' ).is(':visible') ).to.be.true;

		});

	},

	quitar_swals: function(){

		if( Cypress.$( '.sweet-alert' ).length > 0 ){

			cy.get( '.sweet-alert' ).each(($el, index, $list) => {

				$el.remove();
			
			});

			cy.get( '.sweet-overlay' ).each(($el, index, $list) => {

				$el.remove();
			
			});

		}

	},

	cerrar_modal: function( ){

		Aux.quitar_swals();

		if( Cypress.$( 'button.close').length > 0 ){

			cy.get( 'button.close' ).click( {force: true} );
			
			cy.wait( 500 ).then( function(xhr){
				
				expect( Cypress.$( 'div.modal-body' ).length ).to.equal(0);
	
			});

		}
    	

	},

	expect_existe_alert: function(selector){

		var selector = selector || '';

		expect( Cypress.$( selector + ' div.alert' ).length ).to.be.greaterThan(0);

	},

	declarar_endpoint: function( opcion, verbo ){

		if( !opcion || opcion == '' ){
			
			cy.log('No existe el endpoint!!!');
			return false;

		}

		cy.server();

		if( opcion == 'email_tabla' ){
			
			cy.route( 'POST', this.base_url + 'email/email_tabla.php').as('postEmail');
		
		} else if( opcion == 'sepa' ) {

			cy.route( 'POST', this.base_api + 'generar_sepa.php').as('postSepa');

		} else {

			var verbo  = verbo || 'post',
				script = opcion + '.php',
				alias  = 'post' + Fx.capitalize( opcion );

			cy.route( verbo.toUpperCase(), this.base_api + script ).as( alias );

		}


	},

	verificar_ws_click_selector: function( endpoint, alias_endpoint, selector ){

		Aux.declarar_endpoint( endpoint );

		cy.get( selector ).click( {force: true} );

		cy.wait( alias_endpoint ).then( function(xhr){

			var str_resp = parseInt( xhr.response.body );

			expect( str_resp ).to.be.below( 2  );
			expect( str_resp ).to.be.above( -1 );

		});

	},

	*/


};

module.exports = Aux;