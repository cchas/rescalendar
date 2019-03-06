// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })



/*
function guardar_datos_locales( hash, datos_locales ){

	var url = 'http://localhost/sanjuan2/api/asesores.php',
		accion = 'guardar_datos_locales';

	return cy.request({
        method: 'POST',
        form: true,
        url: url,
        body: {
        	accion: accion,
          	hash: hash,
          	datos_locales: datos_locales
        }

	});

}

function req(url, data){

	return cy.request({
        url: url,
        method: 'POST',
        form: true,
        body: data,

    });

}

function procesar_consultar_empresas(obj_asesor, resp_consultar, seccion){

	var obj_json = JSON.parse( resp_consultar );
	
	obj_asesor.obj_empresas = obj_json;

	if(  obj_json[7] ){
		obj_asesor.empresa = obj_json[7]; // Empresa ekon
	}else{
		obj_asesor.empresa = obj_json[0]; // Acceso como empresa
	}
	
	obj_asesor.seccion = seccion;

	delete obj_asesor.datos_locales;

	guardar_datos_locales( obj_asesor.hash, JSON.stringify( obj_asesor ) );

}

function procesar_guardar_datos_locales(obj_asesor, seccion){

	var id_asesoria = 3,
		url_empresas = 'http://localhost/sanjuan2/api/empresas.php';

	var data = {
    	accion: 'consultar_empresas',
      	hash: obj_asesor.hash,
      	id_asesoria: id_asesoria
    };

    req( url_empresas, data).then( (response) => {

    	procesar_consultar_empresas(obj_asesor, response.body, seccion);

	});

}

Cypress.Commands.add('test_api', (accion, obj_param) => {

	var url   	  = 'http://localhost/sanjuan2/test/api/test_api.php',
		obj_param = obj_param || {};

    var data = {
    	accion: accion,
    	obj_param: obj_param
    };

    return req(url, data).then( (response) => {
   		
    	var obj_resp = JSON.parse( response.body );
		
		console.log(obj_resp, 'obj_resp');
    	
    });


});


Cypress.Commands.add('loginByJSON', (usuario, password, seccion) => {

	var url 		 = 'http://localhost/sanjuan2/api/asesores.php',
		hash         = '',
		data         = {},
		obj_json     = {},
		obj_asesor   = {};


    data = {
    	accion: 'login',
      	usuario: usuario,
      	password: password
    };

    return req(url, data).then( (response) => {
   		
    	obj_asesor = JSON.parse( response.body );
		
    	localStorage.setItem('sanjuan', obj_asesor.hash ); 

    	guardar_datos_locales(obj_asesor.hash, response.body ).then( (response) => { 

    		procesar_guardar_datos_locales(obj_asesor, seccion);

    	});
    
    });


});



Cypress.Commands.add('login_ws_asesor', (seccion) => {

	cy.loginByJSON('cesar@respirainternet.com','Harpo1978j$', seccion);
  	
});

Cypress.Commands.add('login_ws_empresa', (seccion) => {

	cy.loginByJSON('demoekon','demoekon', seccion);
  	
});

Cypress.Commands.add('login_ws_gratuito', (seccion) => {

	cy.loginByJSON('22222222J','22222222J', seccion);
  	
});

Cypress.Commands.add('login_ws_en_pruebas', (seccion) => {

	cy.loginByJSON('33333333P','33333333P', seccion);
  	
});

Cypress.Commands.add('login_ws_asesor_no_soporte', (seccion) => {

	cy.loginByJSON('maricarmen','3455gbtu', seccion);
  	
});


Cypress.Commands.add('abrir_seccion', (seccion, tipo_acceso) => {

	function visitar_seccion( seccion ){
		cy.visit('http://localhost/sanjuan2/#' + seccion ).wait(2000);
	}

	if( tipo_acceso == 'asesor' ){

		cy.login_ws_asesor( seccion ).then( function(){

			visitar_seccion( seccion );

		});

	}


	if( tipo_acceso == 'empresa' ){

		cy.login_ws_empresa( seccion ).then( function(){

			visitar_seccion( seccion );

		});
	}

	if( tipo_acceso == 'gratuito' ){

		cy.login_ws_gratuito( seccion ).then( function(){

			visitar_seccion( seccion );
			
		});

	}

	if( tipo_acceso == 'en_pruebas' ){

		cy.login_ws_en_pruebas( seccion ).then( function(){

			visitar_seccion( seccion );

		});

	}

	if( tipo_acceso == 'asesor_no_soporte' ){

		cy.login_ws_asesor_no_soporte( seccion ).then( function(){

			visitar_seccion( seccion );
			
		});

	}
	
});



Cypress.Commands.add('sele_empresa_ekon', () => {
	
	cy.get('#lista_empresas')
		.select( '26', {force: true} )
		.trigger( 'change', {force: true} );
	
});


Cypress.Commands.add('acceder_asesor', () => {

	var usuario = 'cesar@respirainternet.com',
		password = 'Harpo1978j$';

	cy.acceder(usuario, password);

});

Cypress.Commands.add('acceder_empresa', () => {

	var usuario  = 'demoekon',
		password = 'demoekon';

	cy.acceder(usuario, password);
	
});

Cypress.Commands.add('acceder_gratuito', () => {

	var usuario  = '22222222J',
		password = '22222222J';

	cy.acceder(usuario, password);
	
});

Cypress.Commands.add('acceder', ( usuario, password ) => {

	var usuario  = usuario || '',
		password = password || '';

	cy.get('#usuario').clear().type( usuario );
	cy.get('#password').clear().type( password );

	cy.get('a[title="Acceder"]').click();

});


Cypress.Commands.add('login', ( tipo_acceso ) => {

	var tipo_acceso = tipo_acceso || 'asesor';

	if( localStorage.getItem('sanjuan') != '$2a$' ){
		
		cy.visit('http://localhost/sanjuan2/#login');

		cy.wait(500).then( function(xhr){
		    
		    return cy.contains('password');
			
		});

	}

});

Cypress.Commands.add('logout', () => {

	cy.server();
  	cy.route('POST', 'http://localhost/sanjuan2/api/asesores.php').as('postAsesores');

  	if( Cypress.$('a#logout').length > 0 ){

  		cy.get('a#logout').click();

	    cy.wait( 500 ).then( function(xhr){ // SweetAlert

	    	cy.get('button.confirm').click();

			cy.wait('@postAsesores').then( function(xhr2){

			    cy.url().should('include', '/#login');

		    });

	    });

  	}
	

    localStorage.removeItem('sanjuan');
    cy.visit('http://localhost/sanjuan2/#login');

});

Cypress.Commands.add('trigger_click', (selector) => {

	return cy.get( selector ).click( {force:true} );

});

Cypress.Commands.add('type_text', (texto, selector) => {
	cy.get( selector ).clear().type( texto );
});


// prevent LocalStorage clear
Cypress.LocalStorage.clear = {};
*/


