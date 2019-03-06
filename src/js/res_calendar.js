;(function($) {

    $.fn.res_calendar = function( options ) {

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

        /*
        function update_data_filename(targetObj, filename){
            targetObj.find('input[type=file]').attr('data-filename', filename);        
        }

        function show_clear_button( targetObj ){
            targetObj.find('a.clear_image').show();
        }

        function hide_clear_button( targetObj ){
            targetObj.find('a.clear_image').hide();
        }

        function clear_image( targetObj ){

            targetObj.find('div.thumbnail_image img').attr('src', '');
            
            update_data_filename( targetObj, '');
            hide_clear_button( targetObj);
            clear_message( targetObj );

        }
        */

        function set_template( targetObj, settings ){
            
            var template = '',
                id = targetObj.attr('id') || '';

            if( 
                settings.url_upload == '' || 
                id == '' 
            ){

                targetObj.html( alert_error( lang.init_error ) );
                return false;
            
            }

            if( settings.src.length > 4 && settings.src.indexOf('//') > -1 ){
                settings.src = settings.src;
            }

            template = settings.template_html( targetObj, settings );

            targetObj.html( template );

            if( settings.src == '' || settings.src.length < 4 ){
                
                // hide_clear_button( targetObj );
                
            }

            return true;

        };

        /*
        function show_spinner( targetObj ){


            clear_thumbnail( targetObj );

            window.setTimeout(function(){

                targetObj.find('img').attr('src', settings.url_spinner)
                        .css('z-index', 3000)
                        .show();

            }, 500);

        }

        function show_error_icon( targetObj ){

            targetObj
                .addClass('error')
                .show();

        }

        function update_thumbnail( targetObj, file ){

            show_spinner( targetObj );

            window.setTimeout(function(){

                targetObj.find( 'img' ).attr('src', file);

                update_message( targetObj, 'success', lang.upload_success );
                
                show_clear_button( targetObj );

            }, 2000);

        } // end update_thumbnail


        function clear_thumbnail( targetObj ){

            targetObj.find('div.thumbnail_image img').attr( 'src', '');
            
            targetObj.closest('div.thumbnail_image').removeClass('error');

            clear_message( targetObj );

        }


        function update_message( targetObj, status_class, message ){

            targetObj.find('span.status')
                     .removeClass( 'info success danger warning error' )
                     .addClass( status_class )
                     .html( message || '...' );
            
        }

        function clear_message( targetObj ){

            targetObj.find('span.status')
                    .html('')
                    .removeClass('info success danger warning error');

        }


        function run_file_upload( targetObj, file, settings ){

            var fd         = new FormData(),
                id         = targetObj.attr('id'),
                blobFile   = targetObj.find('input[type="file"]').get(0).files[0],
                filename   = blobFile.name, 
                field_name = settings.field_name;

            clear_thumbnail( targetObj );
            update_message( targetObj, 'info', lang.upload_processing );

            // add data to be submitted
            fd.append(field_name, blobFile, filename );
            $.each( settings.data, function(index, value){
                fd.append( index, value );
            });

            process_run_file_upload( targetObj, file, fd );

        } // end run_file_upload

        function process_run_file_upload( targetObj, file, fd ){

            var resp = $.ajax({
                url: settings.url_upload,
                type: 'POST',
                data: fd,
                cache: false,
                contentType: false,
                processData: false
            });

            resp.done(function(obj_json) {

                if( typeof obj_json == 'string' ){
                  obj_json = $.parseJSON( obj_json );
                }

                if (obj_json !== null) {

                    if( obj_json.status == 'ok' || obj_json.status == 'success' ){

                        filename = obj_json.filename;    
                        
                        update_data_filename(targetObj, filename);
                        update_thumbnail( targetObj, file );
                        
                    }else{

                        show_error_icon( targetObj );
                        hide_clear_button( targetObj );

                        update_message( targetObj, 'error', lang.upload_error + ': ' + obj_json.error );
                        console.log( lang.upload_file_error + obj_json.error );

                    }

                }

            });


            resp.fail(function() {

                console.log( lang.network_error );
                return false;
            
            });

            return resp;

        }
        */


        // INITIALIZATION
        var settings = $.extend({
            id           : '',
            url_spinner  : 'img/spinner.gif',
            url_upload   : 'upload.php',
            src: '',
            field_name : 'upl',
            data: {},
            lang: {
                'click_to_upload'   : '<i class="fa fa-upload"></i> Click to upload a file',
                'init_error'        : 'Error when initializing plugin',
                'upload_file_error' : '<i class="fa fa-times-circle"></i> Error when uploading file: ',
                'network_error'     : '<i class="fa fa-times-circle"></i> Error when connecting to server',
                'upload_success'    : '<i class="fa fa-check-circle"></i> File uploaded successfully',
                'upload_processing' : 'Processing file...',
                'upload_error'      : '<i class="fa fa-times-circle"></i> Error when uploading'
            },
            border_width: 10,
            border_color: '#000000',
            button_color: '#ff0000',
            background_color: 'transparent',

            template_html: function( targetObj, settings ){

                var id           = targetObj.attr('id'),
                    refDate = settings.refDate || '06/03/2019';

                return [

                    '<div class="' , id , '_wrapper">',

                        '<input id="startDate" type="text" value="' + refDate + '" />',

                    '</div>',

                ].join('');

                /*
                var id           = targetObj.attr('id'),
                    src          = settings.src,
                    style        = '',
                    style_button = '';

                style = ' style="';
                style += 'border-width: ' + settings.border_width + 'px;';
                style += 'border-color: ' + settings.border_color.trim() + ';';
                style += 'background-color: ' + settings.background_color.trim() + ';';
                style += '" ';

                style_button = ' style="';
                style_button += 'border-color: ' + settings.button_color.trim() + ';';
                style_button += 'background-color: ' + settings.button_color.trim() + ';';
                style_button += '" ';

                return [

                    '<div class="' , id , '_wrapper">',

                      '<div class="thumbnail_image vertical-center" ', style, '>',
                      
                        '<input type="file" accept="image/*" id="' , id , '" data-filename="" />',
                        '<img src="' , src , '" id="thumbnail_' , id , '" />',
                        
                        '<div class="thumbnail_buttons">',
                            '<a ', style_button, ' href="#" class="clear_image"><i class="fa fa-trash"></i></a>',
                        '</div>',

                        '<span id="' , id , '_message" class="status info">', settings.lang.click_to_upload, '</span>',

                      '</div>',

                    '</div>',

                ].join('');
                */

            }

        }, options);


        var lang = settings.lang;

        return this.each( function() {
            
            var targetObj = $(this);

            if( !set_template( targetObj, settings) ){
                return false;
            }

            /*
            var objInputFile     = targetObj.find('input[type="file"]'),
                link_clear_image = targetObj.find('a.clear_image');

            objInputFile.on('change', function(e){ 

                e.preventDefault();

                var file = URL.createObjectURL( objInputFile.get(0).files[0] );

                run_file_upload( targetObj, file, settings );

            });

            link_clear_image.on('click', function(e){ 
                
                e.preventDefault();

                clear_image( targetObj );

            });
            */

            return this;

        });


        

    } // end plugin


}(jQuery));