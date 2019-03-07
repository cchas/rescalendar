;(function($) {

    $.fn.rescalendar = function( options ) {

        function alert_error( error_message ){

            return [
                '<div class="error_wrapper">',

                      '<div class="thumbnail_image vertical-center">',
                      
                        '<p>',
                            '<span class="error">',
                                error_message,
                            '</span>',
                        '</p>',
                      '</div>',

                    '</div>'
            ].join('');
        
        }

        function set_template( targetObj, settings ){
            
            var template = '',
                id = targetObj.attr('id') || '';

            if( id == '' ){

                targetObj.html( alert_error( lang.init_error ) );
                return false;
            
            }

            template = settings.template_html( targetObj, settings );

            targetObj.html( template );

            return true;

        };

        function setDayCells( targetObj, refDate ){

            var format = settings.format,
                f_inicio = moment( refDate, format ).subtract(15, 'days'),
                f_fin    = moment( refDate, format ).add(15, 'days'),
                today    = moment( ).startOf('day'),
                html            = '',
                f_aux           = '',
                f_aux_format    = '',
                dia             = '',
                mes             = '',
                clase_today     = '',
                clase_middleDay = '',
                middleDay       = targetObj.find('#refDate').val(),
                blockSize       = settings.jumpSize * 2;

            for( var i = 0; i< (blockSize + 1) ; i++){

                f_aux        = moment( f_inicio ).add(i, 'days');
                f_aux_format = f_aux.format( format );

                dia = f_aux.format('DD');
                mes = f_aux.locale('es').format('MMM').replace('.','');
                
                f_aux_format == today.format( format ) ? clase_today = 'today' : clase_today = '';
                f_aux_format == middleDay ? clase_middleDay = 'middleDay' : clase_middleDay = '';

                html += [
                    '<td class="day_cell ' + clase_today + ' ' + clase_middleDay + '" data-cellDate="' + f_aux.format( settings.format ) + '">',
                        '<span class="dia">' + dia + '</span>',
                        '<span class="mes">' + mes + '</span>',
                    '</td>'
                ].join('');

            }

            targetObj.find('#rescalendar_day_cells').html( html );

            addTdClickEvent( targetObj );

            
        }

        function addTdClickEvent(targetObj){

            var day_cell = targetObj.find('td.day_cell');

            day_cell.on('click', function(e){
            
                var cellDate = e.currentTarget.attributes['data-cellDate'].value;

                targetObj.find('#refDate').val( cellDate );

                setDayCells( targetObj, moment(cellDate, settings.format) );

            });

        }

        function change_day( targetObj, action, num_days ){

            var refDate = targetObj.find('#refDate').val(),
                f_ref = '';

            if( action == 'subtract'){
                f_ref = moment( refDate, settings.format ).subtract(num_days, 'days');    
            }else{
                f_ref = moment( refDate, settings.format ).add(num_days, 'days');
            }
            
            targetObj.find('#refDate').val( f_ref.format( settings.format ) );

            setDayCells( targetObj, f_ref );

        }

        // INITIALIZATION
        var settings = $.extend({
            id           : 'rescalendar',
            format       : 'DD/MM/YYYY',
            jumpSize     : 15,
            refDate      : moment().format( this.format ),
            
            data: {},
            lang: {
                'today'   : 'Today'
            },

            template_html: function( targetObj, settings ){

                var id      = targetObj.attr('id'),
                    refDate = settings.refDate || moment().format(settings.format);

                return [

                    '<div class="rescalendar ' , id , '_wrapper">',

                        '<div class="rescalendar_controls">',

                            '<button id="move_to_last_month"> << </button>',
                            '<button id="move_to_yesterday"> < </button>',

                            '<input id="refDate" type="text" value="' + refDate + '" />',
                            
                            '<button id="move_to_tomorrow"> > </button>',
                            '<button id="move_to_next_month"> >> </button>',

                            '<br>',
                            '<button id="move_to_today"> ' + settings.lang.today + ' </button>',

                        '</div>',

                        '<table class="rescalendar_table">',
                            '<thead>',
                                '<tr id="rescalendar_day_cells"></tr>',
                            '</thead>',
                            '<tbody id="filas">',
                                
                            '</tbody>',
                        '</table>',
                        
                    '</div>',

                ].join('');

            }

        }, options);


        var lang = settings.lang;

        return this.each( function() {
            
            var targetObj = $(this);

            set_template( targetObj, settings);

            setDayCells( targetObj, settings.refDate );

            // Eventos
            var move_to_last_month = targetObj.find('#move_to_last_month'),
                move_to_yesterday  = targetObj.find('#move_to_yesterday'),
                move_to_tomorrow   = targetObj.find('#move_to_tomorrow'),
                move_to_next_month = targetObj.find('#move_to_next_month'),
                move_to_today      = targetObj.find('#move_to_today'),
                refDate            = targetObj.find('#refDate');

            move_to_last_month.on('click', function(e){
                
                change_day( targetObj, 'subtract', settings.jumpSize);

            });

            move_to_yesterday.on('click', function(e){
                
                change_day( targetObj, 'subtract', 1);

            });

            move_to_tomorrow.on('click', function(e){
                
                change_day( targetObj, 'add', 1);

            });

            move_to_next_month.on('click', function(e){
                
                change_day( targetObj, 'add', settings.jumpSize);

            });

            refDate.on('blur', function(e){
                
                var refDate = targetObj.find('#refDate').val();
                setDayCells( targetObj, refDate );

            });

            move_to_today.on('click', function(e){
                
                var today = moment().startOf('day').format( settings.format );

                targetObj.find('#refDate').val( today );

                setDayCells( targetObj, today );

            });

            return this;

        });

        


        

    } // end plugin


}(jQuery));