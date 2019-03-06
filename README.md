# RESCalendar - Simple jQuery based horizontal calendar plugin

This is a very simple plugin that shows JSON data in an horizontal calendar.

# Dependencies:
- JQuery
- Moment





# Quick and dirty initialization:
	
1. Link to the rescalendar.css in the head of your html, and to the rescalendar.js file AFTER linking to jquery.

2. Put in your html a div with class "rescalendar" and an id attribute, like:
		
```
<div class="rescalendar" id="my_image"></div>
```

3. Initialize the plugin after JQuery, like this:

```
$('.rescalendar').rescalendar();
```


# How it works:

- When you initialize the plugin, inside the div.rescalendar you will have:
	
	- some wrappers to help with styling
	- an input type file, with a data-filename attribute. When you upload a file, this attribute will be updated.
	- a "clear_image" button, to remove the image (it does not call the server)
	- a span with a "status" class, that will recive an error or success message after uploading or initialization

- When clicking on the div, a change event will be fired in the input file, and a file will be able to be selected.

- After selecting a file, the "run_file_upload" method will be called and the form, with some added data if you want, will be sent to the server via POST.

- If the uploading is successful, the span.status will be updated accordingly, and a preview will be shown (using HTML5 URL.createObjectURL );

- If the uploading fails, a message will be shown.




# Options / Properties:
	
- url_spinner: path to the spinner image. Default: "img/spinner.gif"
- url_upload: path to the server upload script. Default: "upload.php"
- src: path to an image shown by default. For example, if you want to update an avatar, the stored avatar will be shown. Default: ""
- field_name: name of the field that the server will recieve. In PHP, you will have it in the $_FILES variable. Default: "upl".
- data: an object containing some data you may want to pass by POST to the server. Default: {}
- lang: an object containing the plugin messages. You can update them with translations, for example. Default: 

```
{
    'init_error'        : 'Error when initializing plugin',
    'upload_file_error' : '<i class="fa fa-times-circle"></i> Error when uploading file: ',
    'network_error'     : '<i class="fa fa-times-circle"></i> Error when connecting to server',
    'upload_success'    : '<i class="fa fa-check-circle"></i> File uploaded successfully',
    'upload_processing' : 'Processing file...',
    'upload_error'      : '<i class="fa fa-times-circle"></i> Error when uploading'
}
```

- border_width (px):  default 10
- border_color (hex): default '#000000'
- button_color (hex): default '#ff0000'





# Other notes:

- The server side code is only for testing purposes. You should develop your own.
- This server side code must return a json with status = "ok" or "ko". If the status is "ko", an error message must be added, like:
	
```
	{
		status: 'ko',
		error: 'File too big'
	}
```

so this information can be shown.
- By default, the "upload.php" script uploads images to the "uploads" folder. If you use that folder, make sure you have writting permissions.
