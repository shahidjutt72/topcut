
// --- autofill functions ---

		var booking_data_store = $("#booking_data");


// format client lookup results
function formatItem(row) {
	return "<em>" + row[0] + "</em><span class=\"client_email_list\">" + " " + row[1] + "</span>";
}

// client autofill
function fill_client_details(){
	var oSuggest = $("#client_name_input")[0].autocompleter;
    var big_alert;
	$.each(oSuggest, function(suggest_key, suggest_value){
        big_alert = big_alert + "key: " + suggest_key + " value: " + suggest_value;
    });
    //alert(big_alert);

	oSuggest.findValue();

	return false;
}

// --- end of autofill functions ---

$(document).ready(function() {

// get existing week start using php, this keeps the date from other views, such as the php list view
$.ajax({
    url: '../includes/get_session_var.php',
    data: {"session_var_name":"week_start"},
    timeout: 10000,
    dataType: "json",
    success: function(returned_data){ // success function
        // start of week in milliseconds (UTC timestamp - showing start of week in salon local time) eg 1291017600 =  GMT: Mon, 29 Nov 2010 08:00:00 GMT / salon timezone: Mon Nov 29 00:00:00 2010
        var millis_date = parseInt(returned_data) * 1000;
        load_calendar(millis_date, cal_start_hour, cal_end_hour);
    },
    error: function(returned_data){ // didn't hear back from request, so feed today's date instead
	   // create a new date using the current local milis time (served to us by php)
	   var now_date = new Date(current_local);

		// get millisecond date for right now	   
	   var millis_date = now_date.getTime(); 
		// find out what day of the week so we can get monday's date
	   var current_day_week = now_date.getDay(); // returns day of the week 0 is sun 1 is mon 6 is sat
		if(current_day_week == 0)
		{ // if sunday
			days_to_subtract = 6;
		}else
		{
			days_to_subtract = current_day_week -1;
		}
		// get monday's date by subtracting the number of miliseconds in a day multiplied by how far into the week we are
	   var millis_date = millis_date - ((days_to_subtract) * 24 * 60 * 60 * 1000);

       load_calendar(millis_date, cal_start_hour, cal_end_hour);


		if(textStatus == 'timeout' || textStatus == 'error'){
			connection_doctor();
		}
    }
});

	   var $calendar = $('#calendar');


function load_calendar(millis_date, cal_start_hour, cal_end_hour)
{

	   date_to_load = new Date(millis_date);

	   
	// monStart: MonStartTime, monEnd: MonEndTime, tueStart: TueStartTime, tueEnd: TueEndTime, wedStart: WedStartTime, wedEnd: WedEndTime, thuStart: ThuStartTime, friStart: FriStartTime, friEnd: FriEndTime, satStart: SatStartTime, satEnd: SatEndTime, sunStart: SunStartTime, sunEnd: SunEndTime
	   $calendar.weekCalendar({
          date: date_to_load,  // the date to load
	      timeslotsPerHour : 4,  // 15 min time slots
	      allowCalEventOverlap : true,  // so you can double book
	      overlapEventsSeparate: true, // show one on left of column and one on right
	      firstDayOfWeek : 1, // first day monday (1)
	      businessHours :{start: cal_start_hour, end: cal_end_hour, limitDisplay: true }, // todo pull business hours from db hardcode - This needs to be changed in more than one place
	      daysToShow : 7,
	      defaultEventLength: 1, // 1 appiontment = 15 minutes which is the default on click
	      height : function($calendar) {
			 //console.log($(window).height());
			 $(window).css("background-color", "#ff0000");
	         return $(window).height() - 1;  // Adjust height to prevent outer scrollbar
	      },
	      
	      // make past events grey
	      eventRender : function(calEvent, $event) {

			var status = parseInt(calEvent.status);
	         switch(status)
	         {
	         	case 2: // unconfirmed
					$event.css("backgroundColor", "#dddddd");
					$event.css("border", "1px solid #666666");
					break;
				
	         	case 3: // confirmed
					 if (calEvent.end.getTime() < new Date().getTime()) {
						$event.css("backgroundColor", "#dddddd");
						$event.css("border", "1px solid #666666");
					 }

	         		break;
	         	
	         	case 4: // completed
					$event.css("backgroundColor", "#dddddd");
					$event.css("border", "1px solid #666666");
	         		break;
	         	
	         	case 5: // no show
					$event.css("backgroundColor", "#ffb0b0");
					$event.css("border", "1px solid #FF0000");
	         		break;
	         	default:
	         		break;
	         
	         }

	      },
	      draggable : function(calEvent, $event) {
	         //return calEvent.readOnly != true;
             return false;
	      },
	      resizable : function(calEvent, $event) {
	         //return calEvent.readOnly != true;
             return false;
	      },
	      eventNew : function(calEvent, $event) {  // form layout for new event
	      
			if(!(read_only))
			{
				 var $dialogContent = $("#new_appointment_container");
				 resetForm($dialogContent);
				 
				 $.data(booking_data_store, "stylist_id", stylist_id);				 
				
				// fill in the client name field
				var clientNameField = $dialogContent.find("#client_name_holder").html("<div id=\"client_name_container\"><h2>Select a client for this booking</h2><input type=\"text\" name=\"title\" id=\"client_name_input\"  placeholder=\"&nbsp;Search by first name, last name, email or phone\" value=\"\" /></div>");
		
			   // clear service dropdown for new appt
			   $("#service_id_selector").val("select");
			   // make simple duration by default
			   show_simple_duration();


				$("#client_name_input").autocomplete({
					minLength: 0,
					source: "../includes/client_name_helper.php",
					select: function(event, ui){
						calEvent.client_email = ui.item.email;
						calEvent.client_first_name = ui.item.first_name;
						calEvent.client_last_name = ui.item.last_name;
						calEvent.client_id = ui.item.client_id;
						calEvent.client_phone_1 = ui.item.phone_1;
						calEvent.client_phone_2 = ui.item.phone_2;
						calEvent.client_work_ph = ui.item.work_ph;
						calEvent.client_work_ext = ui.item.work_ext;
						calEvent.reminder_type = ui.item.reminder_type;						
						$("#new_appointment_container").dialog("destroy");
						$("#new_appointment_container").hide();
						new_appointment_for_existing(calEvent, $event);
					}				
				}).data("uiAutocomplete")._renderItem = function(ul, item) {
				    var re = new RegExp(this.term, "i") ;
					var t = item.label.replace(re,"<em>" + this.term + "</em>");
    				return $("<li></li>").data("item.autocomplete", item).append("<a>" + t + " <span class=\"light\">" + item.secondary_label + "</span>").appendTo(ul);
    			};
		
				 $dialogContent.dialog({
					width: 400,         
					modal: true,
					title: "",
					close: function() {
					   $dialogContent.dialog("destroy");
					   $dialogContent.hide();
					   $calendar.weekCalendar("removeUnsavedEvents");
					},
					buttons: {
					   "Add New Client": function(){
						// TODO remove this id increment and update calEvent.id with correct id from db
						   $dialogContent.hide();
						   $dialogContent.dialog("destroy");                                  
						   new_appointment(calEvent, $event);
					   },
					   "Time Off": function(){
					   //console.log("TimeOffFunction calling book_time_off how many times?");
						  calEvent.client_id = 0;
						  calEvent.service_id = 0;
						  $dialogContent.dialog("close");
						  // call book time off dialog
						  book_time_off(calEvent, $event, "book_off");                  
					   },
					   "Cancel" : function() {
						  $dialogContent.dialog("close");
						  $calendar.weekCalendar("removeUnsavedEvents");                  
					   }
					}
				 }).show();


				 
			} // end if not read only
			else  
			{ // read only
					   $('#calendar').weekCalendar("removeUnsavedEvents");

			}
	      },
	      eventDrop : function(calEvent, $event) {
	      },
	      eventResize : function(calEvent, $event) {
	      },
	      eventClick : function(calEvent, $event) {
	    //**** EDIT event / view event
	        
	         if (calEvent.readOnly) {
	            return;
	         }
	         
	         
				 $.data(booking_data_store, "stylist_id", stylist_id);				 	         
	
		         var $dialogContent = $("#event_edit_container");
	         // todo commented out because it was resetting the value of the email_client field
	         resetForm($dialogContent);
	         
                 // clear all the fields to start
                clear_all_fields();	         
	         
	         // if there is no service, we must mean time off - which could be zero, undefined or null
            if(calEvent.service_id == null || typeof calEvent.service_id == undefined || calEvent.service_id == 0)
            {
                // edit the time off
                book_time_off(calEvent, $event, "existing_time_off");

            }
	        else
            {
	           // edit the appointment
	       // save date using php TODO: parse out "&" from user 

         // hide editable view of client details
         $("#client_details_list").show();
         $("#client_details_form").hide();
	    
		if(read_only)
		{
			disable_modal_fields;
		}
		else
		{
			enable_modal_fields();  // it's and edit so they already have a service and can change other fields
		}

		
	       // fetch client info to fill out form
	        $.ajax({
	            url: '../includes/client_info_helper.php',
	            dataType: "json",
	            data: {"booking_id":calEvent.id},
				timeout: 10000,	            
	            success: function(client_data){ // success function
	            
                     $dialogContent.find("input[name='first_name']").val(client_data.client_name);
                    var client_name = "<em>" + client_data.client_name + "</em>";
                     if(client_data.client_last_name != "")
                     {
                         $dialogContent.find("input[name='last_name']").val(client_data.client_last_name);
                         client_name = client_name + " <em>" + client_data.client_last_name + "</em>";
                     }
                     
                      client_name = "<a href=\"edit_client.php?cid=" + client_data.clientID + "&sid=" + stylist_id + "\">" + client_name + "</a>";

                     $("#client_name_list").html(client_name);
                     
                     if(client_data.client_country != "" && client_data.client_country != "0")
                     {
                         $("#country").val(client_data.client_country);
                     }else{
                     	$("#country").val(salon_country);
                     }                            
                     

	            if(has_client_data(client_data))
	            {
                    
                     if(client_data.client_email != "")
                     {
                         $dialogContent.find("input[name='email']").val(client_data.client_email);
                         $("#email_list").html('<a href="mailto:' + client_data.client_email + '">' + client_data.client_email + '</a>');
                     }
                     if(client_data.client_phone_1 != "")
                     {
                         $dialogContent.find("input[name='phone_1']").val(client_data.client_phone_1);
                         $("#home_ph_list").html("<span class=\"client_details_label\">Home</span> " + client_data.client_phone_1);
                     }
                     if(client_data.client_phone_2 != "")
                     {
                         $dialogContent.find("input[name='phone_2']").val(client_data.client_phone_2);
                         $("#mobile_ph_list").html("<span class=\"client_details_label\">Mobile</span> " + client_data.client_phone_2);
                     }
                     if(client_data.client_work_ext != "")
                     {
                       $dialogContent.find("input[name='work_ext']").val(client_data.client_work_ext);
                        var work_ext_txt = " <span class=\"client_details_label\">ext</span> " + client_data.client_work_ext;
                     }
                     else
                    {
                        var work_ext_txt = "";
                    }
             
                     if(client_data.client_work_ph != "")
                     {
                       $dialogContent.find("input[name='work_ph']").val(client_data.client_work_ph);
                       $("#work_ph_list").html("<span class=\"client_details_label\">Work</span> " + client_data.client_work_ph + work_ext_txt);
                     }
                             var client_address = "";
                             if(client_data.client_address_1 != "")
                             {
                             	client_address = client_data.client_address_1;
                             }
                             if(client_data.client_address_2 != "")
                             {
                             	if(client_address.length > 0)
                             	{
                             		var space = " ";
                             	}
                             	else
                             	{
                             		var space = "";
                             	}
                             	$client_address += space + client_data.client_address_2;
                             }
                             if(client_data.client_city != "")
                             {
                             	if(client_address.length > 0)
                             	{
                             		var space = " ";
                             	}
                             	else
                             	{
                             		var space = "";
                             	}
                             	client_address += space + client_data.client_city;                             	
                             }
                             if(client_data.client_province != "")
                             {
                             	if(client_address.length > 0)
                             	{
                             		var space = " ";
                             	}
                             	else
                             	{
                             		var space = "";
                             	}
                             	client_address += space + client_data.client_province;                             	
                             } 
							if(client_address.length > 0)
                             {
                             	client_address = "<a href=\"http://maps.google.com?q=" + client_address + "\" target=\"_blank\" ><i class=\"icon-map-marker\"></i>&nbsp;&nbsp;" + client_address + "</a>";
                               $("#client_address").html(client_address);
                             }  
                             
							 if(client_data.reminder_type != "")
							 {
								 $("#reminder_type").val(client_data.reminder_type);
								 check_reminder_types_available();
							 }                             
                                                        
/*                             if(client_data. != "")
                             {
                               $("#").html("<span class=\"client_details_label\"></span> " + client_data.);
                             }                             */
                     
	             }
	             
	             
	             $dialogContent.find("#client_id").val(client_data.clientID);            
	             $dialogContent.find("#booking_id").val(calEvent.id);
                 $("#email_client_cb").val("no");            	
                 $("#email_client_cb").attr("checked", false);           
                 $dialogContent.find("#appointment_type").val("edit");            	

                // check whether to show "email to client" checkbox	         
                 email_checker();    	
	               
	            },
				error: function(jqXHR, textStatus, errorThrown)
				{
			    	if(textStatus == 'timeout' || textStatus == 'error'){
						connection_doctor();
			    	}
				}
	        });
	  
			
	         var startField = $("#booking_start").val(calEvent.start);
	         var endField = $("#booking_end_time").html(calEvent.end);
	         
	         
	         var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
	         var serviceField = $dialogContent.find("input[name='service']").val(calEvent.service);
	         
	         var statusField = $("#status").val(calEvent.status);
	         
	         if(calEvent.cost != null)
	         {	
	         	var costField = $("#cost").val(calEvent.cost);
	         }
	         else
	         {
	         	var costField = $("#cost").val(calEvent.default_cost);	         
	         }
	         
	         if(calEvent.tip != "0.00")
	         {
	         	var tipField = $("#tip").val(calEvent.tip);
	         }
	         else
	         {
	         	var tipField = $("#tip");
	         }
	         

	         
	         if(calEvent.client_note != undefined && calEvent.client_note.length > 1){var clientNotesField = $dialogContent.find(".client_notes_holder").html("<span class=\"standard_label\">Client's Notes</span><br /><br /><div id=\"client_notes\">" + calEvent.client_note + " </div>");}
	         else{$dialogContent.find(".client_notes_holder").html("")}
	         
	         var edit_buttons = {};		
	         
	         if(!(read_only))
	         {
				 edit_buttons = [
					{
					   		text: "delete",
					   		click: function() {
					// get the email_client value before we destroy the window

							  if($("#email_client_cb").is(":checked"))
							  {
								 calEvent.email_client = true;
							  }
							  else
							  {
								calEvent.email_client = false;
							  }  	               
							   
							   // set client id so we can get their quick key
							   calEvent.client_id = $dialogContent.find("input[name='client_id']").val();
							   // set client email so we can send them delete confirmation
							   calEvent.client_email = $dialogContent.find("input[name='email']").val();

									 // clear all the fields to start
									clear_all_fields(); 
							   // hide existing dialog
								  $dialogContent.dialog("close");
							   // show delete confirmation dialog
								delete_confirmation(calEvent, $event);
													   
						  
					   }
				},				 
				 {
				 	text: 'save',
				 	class: "primary_button",
				 	click: function() {
							  calEvent.start = new Date(startField.val());
							  calEvent.end = new Date(endField.val());
							  calEvent.title = $dialogContent.find("input[name='first_name']").val() + " " + $dialogContent.find("input[name='last_name']").val();
							  calEvent.stylist_note = stylistNotesField.val();
		
							  calEvent.start = new Date(startField.val());
							  calEvent.status = statusField.val();
							  calEvent.cost = costField.val();
							  calEvent.tip = tipField.val();

							  // check if advanced duration
							  if($("#duration_type").val() == "advanced")
							  {
									calEvent.s_start = new Date(parseInt(calEvent.start.getTime()) + (parseInt($("#start_duration").val()) * 60 * 1000));		
									//console.log("start dur: " + $("#start_duration").val() + " process dur: " + $("#process_duration").val() + " total: " + ($("#start_duration").val() + $("#process_duration").val()) * 1000);
									calEvent.s_end = new Date(calEvent.start.getTime() + ((parseInt(parseInt($("#start_duration").val())) + parseInt(parseInt($("#process_duration").val()))) * 60 *1000));
									calEvent.end = new Date(calEvent.start.getTime() + ((parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val())) * 60 * 1000));
							  }
							  else
							  {
								calEvent.s_start = "";
								calEvent.s_end = "";
								calEvent.end = new Date(calEvent.start.getTime() + ($("#service_duration").val() * 60 * 1000));					 
							  }
	
							  calEvent.stylist_note = $("#stylist_notes_field").val();
							  calEvent.service_id = $("#service_id_selector").val();
							  calEvent.service = $("#service_id_selector option[value=" + calEvent.service_id + "]").text();
							  calEvent.client_first_name = $("#client_details_form input[name='first_name']").val();
							  calEvent.client_last_name = $("#client_details_form input[name='last_name']").val();
							  calEvent.title = calEvent.client_first_name + " " + calEvent.client_last_name;
							  calEvent.client_email = $("#client_details_form input[name='email']").val();
							  calEvent.client_phone_1 = $("#client_details_form input[name='phone_1']").val();
							  calEvent.client_phone_2 = $("#client_details_form input[name='phone_2']").val();
							  calEvent.client_work_ph = $("#client_details_form input[name='work_ph']").val();
							  calEvent.client_work_ext = $("#client_details_form input[name='work_ext']").val();
							  calEvent.client_country = $("#country").val();
							  calEvent.reminder_type = $("#reminder_type").val();
	
							 //alert(calEvent.service);
									  if($("#email_client_cb").is(":checked"))
									  {
										 calEvent.email_client = true;
									  }
									  else
									  {
										calEvent.email_client = false;
									  }  
								
								// log this request for debugging
								$.ajax({
									url: '../includes/ajax_request_logger.php',
									dataType: "json",
									timeout: 10000,									
									data: {"stylist_id":stylist_id,"client_type":"update_existing","start_time":calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":$dialogContent.find("input[name='client_id']").val(),"service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"booking_id":calEvent.id,"email":$dialogContent.find("input[name='email']").val(),"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,"work_ext":calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
									success: function(returned_data){ // success function
									}
								});			
		
								// Send appointment details using ajax to appointment_helper.php which will save to mySQL 
								$.ajax({
									url: '../includes/appointment_helper.php',
									dataType: "json",
									data: {"stylist_id":stylist_id,"client_type":"update_existing","start_time":calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":$dialogContent.find("input[name='client_id']").val(),"service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"booking_id":calEvent.id,"email":$dialogContent.find("input[name='email']").val(),"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,"work_ext":calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
									success: function(returned_data){ // success function
									  //  alert("data from json" + returned_data);
									// if(returned_data.success == true){
	
											$calendar.weekCalendar("removeUnsavedEvents");
																								
											var wholeEvent = jQuery.extend({}, calEvent);// clone whole event so it remains untouched to attach as data if we have 2 part booking
					

												  $calendar.weekCalendar("updateEvent", wholeEvent, calEvent);							
            
										  
										 // clear all the fields to start
										clear_all_fields();        											           
														   
										  $dialogContent.dialog("close");
										  client_emailed = returned_data['client_emailed'];    
										  // new appointment successfully saved - let's display success box
										  save_success(calEvent, $event, "edit", client_emailed);	
										
																		
									},
									timeout: 10000,
									error: function(jqXHR, textStatus, errorThrown)
									{
										if(textStatus == 'timeout' || textStatus == 'error'){
											connection_doctor();
										}
									}
								});
					   }
					}
];         
	         
	         
	
	         $dialogContent.dialog({
	            width: 875,
	            modal: true,
	            /*title: "Booking with " + stylist_name,*/
	            close: function() {
                         // clear all the fields to start
                        clear_all_fields();    	            
	               $dialogContent.dialog("destroy");
	               $dialogContent.hide();
	               // clear out any client notes so they don't show next time someone opens a different appt dialog
	               $dialogContent.find(".client_notes_holder").html("");
	               $('#calendar').weekCalendar("removeUnsavedEvents");
					$('#calendar').weekCalendar("refresh");	               
                                        
	               
	            },
	            buttons: edit_buttons
	         }).show();
	         
	         
	         if(calEvent.stylist_note != undefined && calEvent.stylist_note.length > 1)
	         {
	           var stylistNotesField = $("#stylist_notes_field").val(calEvent.stylist_note);
	         } else
	         {
	         	stylistNotesField = $("#stylist_notes_field");
	         }


	         
	        //apply the service id for this cal event to a variable
	        var service_id = calEvent.service_id;
	        // select the select tag with the id #, then the item which has a value matching the set service, then set selected to selected so that it shows as the selected item
	        
	        // was this: - think the select method was wrong and it was marking select and option as selected
	        $("#service_id_selector").val(service_id).attr("selected", "selected");
		
			//$("#service_id_selector option[value='" + service_id + "']").attr("selected", "selected");
	         
	         // show client notes
	         
	        $dialogContent.find("#client_name_holder").html("");         
	         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
	         
	         
	         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), "edit_existing");

			 $(".ui-dialog-buttonpane").append("<span class=\"client_email_cb ui-corner-all\"><label for=\"email_client_cb\" class=\"small_text disabled_text\" ><input type=\"checkbox\" name=\"email_client\" value=\"yes i have a value\" id=\"email_client_cb\"  style=\"margin: 0px;\" disabled /> &nbsp;<i class=\"icon-envelope\"></i> email client + stylist on save </label> </span>");
	         
	         $(window).resize().resize(); //fixes a bug in modal overlay size ??
	         

	}}
	      },
	      eventMouseover : function(calEvent, $event) {
	      
	      },
	      eventMouseout : function(calEvent, $event) {
	      },
	      noEvents : function() {
	
	      },
	      data : "../includes/get_appointments.php"
	   });
/*	
	var dif, current_date = new Date(); // Today's date
	dif = (current_date.getDay() + 6) % 7; // Number of days to subtract
	current_date = new Date(current_date - dif * 24*60*60*1000); // Do the subtraction
	
	//alert("last monday was: " + d);
   // if the date requested isn't today then show the date	
   if((date_to_load.getDate() + date_to_load.getMonth() + date_to_load.getYear()) != (current_date.getDate() + current_date.getMonth() + current_date.getYear()))
   {
   		// not today
   		//alert("date_to_load: |" + date_to_load + "| current_date: |" + current_date + "| not today");
		 $("#calendar").weekCalendar("gotoWeek", date_to_load);   
   }else
   {
   		// today
   }
*/   


	// fix the column header widths
	fix_header_widths();

} // end load calendar function

   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }




function book_time_off(calEvent, $event, edit_type){
    var $bto_dialogContent = $("#book_off_container");
         resetForm($bto_dialogContent);
         
                 // clear all the fields to start
                clear_all_fields();
                         
         var startField = $("#book_off_start").val(calEvent.start);
         var endField = $("#book_off_end").val(calEvent.start);
         var bookingNotes = $("#booked_off_notes").val(calEvent.stylist_note);


        // create object of buttons so that we can add /remove as necessary before displaying
        var bto_buttons = [];
        
        if(!(read_only))
        {

			  
				   
			// check if we have a booking id - this will only be if we are editing
			 var booking_id = calEvent.id;
			 if (typeof booking_id == "undefined")
			 {
				//set data to submit to blank
				booking_id_data = "";
			 }
			 else
			 {
				//set data to submit via ajax
				booking_id_data = {"booking_id": booking_id};
				
				
				// we are editing - need delete button
				bto_buttons.push({
					text: "Delete",
					click:  function()
					{
				
						var booking_data = {"client_type":"mark_deleted", "booking_id":calEvent.id,"stylist_id":calEvent.stylist_id,"start_time":calEvent.start,"end_time":calEvent.end};
				
						// log this request for debugging
						$.ajax({
							url: '../includes/ajax_request_logger.php',
							dataType: "json",
							timeout: 10000,									
							data: booking_data,
							success: function(returned_data){ // success function
							}
						});			


						// send an ajax request to php to mark time off as deleted		
						// save booking using php 
						$.ajax({
							url: '../includes/appointment_helper.php',
							data: booking_data,
							dataType: "json",
							timeout: 10000,
							success: function(returned_data)
							{ // success function
					
								if(returned_data.success == true)
								{
									// run this if ajax delete returns successfully
									$calendar.weekCalendar("removeEvent", calEvent.id);
					
		
					
									 // clear all the fields to start
									clear_all_fields();                     
									// hide this dialog on success
									$bto_dialogContent.dialog("destroy");
									$bto_dialogContent.hide();	
										   
										
								}
								else
								{
									 alert("delete failed - please try again in a few seconds");
								}     
							},
							error: function(jqXHR, textStatus, errorThrown)
							{
								if(textStatus == 'timeout' || textStatus == 'error'){
									connection_doctor();
								}
							}
						});				
					}});       					
			 }// end build delete button 
			 
			bto_buttons.push({
				text: 'Save',
				class: 'primary_button',
				click: function() {
					  
					  calEvent.start = new Date(startField.val());
					  
					  calEvent.end = new Date(calEvent.start.getTime() + ($("#book_off_duration").val() * 60 * 1000));					 
				  
					  calEvent.stylist_note = $("#booked_off_notes").val();
					  if(calEvent.stylist_note == "")
					  {calEvent.title = "Time Off";}
					  else
					  {calEvent.title = calEvent.stylist_note;}
					  
					  calEvent.email_client = false;                 
					
					var booking_data = {"client_type":edit_type,"stylist_id":stylist_id,"start_time":calEvent.start,"end_time":calEvent.end,"client_id":"0","service_id":"0","stylist_note":encodeURIComponent(calEvent.stylist_note),"email_client":calEvent.email_client};

					$.extend(booking_data, booking_id_data);
	
						// log this request for debugging
						$.ajax({
							url: '../includes/ajax_request_logger.php',
							dataType: "json",
							timeout: 10000,									
							data: booking_data,
							success: function(returned_data){ // success function
							}
						});				
	
	
					// save date using php 
					$.ajax({
						url: '../includes/appointment_helper.php',
						data: booking_data,
						dataType: "json",
						timeout: 10000,
						success: function(returned_data){ // success function
						  calEvent.id = returned_data.appointment_id;
						  $calendar.weekCalendar("removeUnsavedEvents");
						  $calendar.weekCalendar("updateEvent", calEvent);
							 // clear all the fields to start
							clear_all_fields();                       
						  $bto_dialogContent.dialog("close");
											   
						  
						},
						timeout: 10000,
						error: function(jqXHR, textStatus, errorThrown)
						{
							if(textStatus == 'timeout' || textStatus == 'error'){
								connection_doctor();
							}
						}
					});
	
				   // set fields populated to false so that the time field can be populated
				$bto_dialogContent.find("input[name='fields_populated']").val("false");
	
				   }});
			  
			  // end save button			 
		}//end if not read only           
         
         // build dialog for time off
         $bto_dialogContent.dialog({
            width: 300,         
            modal: true,
            title: "Time Off",
            close: function() {
               $bto_dialogContent.dialog("destroy");
               $bto_dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");      
               // set fields populated to false so that the time field can be populated
                $bto_dialogContent.find("input[name='fields_populated']").val("false");
            },
            buttons: bto_buttons
         }).show();


        $bto_buttons = $bto_dialogContent.dialog('option', 'buttons');
        
        $.each($bto_buttons, function(bto_key, bto_val)
        {
           if(bto_key == "delete")
           {
                if(edit_type == "existing")
                {
                    //console.log("show");
                   $(this).attr("disabled", false);
                }
                else
                {
                    //console.log("hide");
                    $(this).attr("disabled", true);
                }
           }
        }
        );

        $("#service_id_selector option[value='select']").attr("selected", "selected");
         $bto_dialogContent.find(".date_off_holder").html($calendar.weekCalendar("formatDate", calEvent.start));
         

         if($bto_dialogContent.find("input[name='fields_populated']").val() == false)
         {
            //console.log("running setupstarttime");
             setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), "book_time_off");
            // set the hidden field value to true (we have populated them)
            $bto_dialogContent.find("input[name='fields_populated']").val("true");
        } else {
            //console.log("not going to setup start time - already true");
        }
            //console.log($bto_dialogContent.find("input[name='fields_populated']").val());
        
}

/*------------------------------------------------------*/

function new_appointment(calEvent, $event) {  // form layout for new event

         var $n_a_dialogContent = $("#event_edit_container");
         resetForm($n_a_dialogContent);
         
                 // clear all the fields to start
                clear_all_fields();         
         
         // hide non-editable view of client details
         $("#client_details_list").hide();
         $("#client_details_form").show();
         
         check_reminder_types_available();
         
         // grab references to start and end empty time fields
         var startField = $("#booking_start");
         var endField = $("#booking_end_time");
         
         var titleField = $n_a_dialogContent.find("input[name='title']");
         var bodyField = $n_a_dialogContent.find("textarea[name='body']");
        var clientNotesField = $n_a_dialogContent.find(".client_notes_holder").html(""); // On new appointments clear the field to make sure it is blank
        var clientNameField = $n_a_dialogContent.find("#client_name_holder").html("<div id=\"client_name_container\"><label for=\"title\">&nbsp;Client </label><input type=\"text\" name=\"title\" id=\"client_name_input\" placeholder=\"Search by first name\" value=\"\" /><button name=\"client_lookup\" type=\"button\" onclick=\"fill_client_details()\" >Lookup</button></div>");
        $n_a_dialogContent.find(".client_details_heading").html("<h3><em>New Client</em> details</h3>");
         $n_a_dialogContent.find("#appointment_type").val("new");    
        // set service dropdown to have "select a service..." showing
         $("#service_id_selector option[value='select']").attr("selected", "selected");    
         
	  calEvent.client_country = $("#country").val(salon_country);         
         
        disable_modal_fields();        
                                             	   
         $("#status").val(3);  // set status to confirmed by default
         $("#email_client_cb").val("no");            	
         $("#email_client_cb").attr("checked", false);           

         $n_a_dialogContent.dialog({
            width: 875,         
            modal: true,
            title: "",
            close: function() {
					// clear all the fields to start
					clear_all_fields();                                                        
				   $n_a_dialogContent.dialog("destroy");
				   $n_a_dialogContent.hide();
				   $('#calendar').weekCalendar("removeUnsavedEvents");
				   // hide the text warning because a custom time length is set
				   // hide any error messages that were displayed
				   $("label[generated=true]").hide();				   	
				},
            buttons: [
            {
               text: 'save',
               "class": 'primary_button',
               click : function() {
              if($("#modal_booking_form").valid()){
                      calEvent.start = new Date(startField.val());
        
                      // check if advanced duration
					  if($("#duration_type").val() == "advanced")
					  {
					  		calEvent.s_start = new Date(parseInt(calEvent.start.getTime()) + (parseInt($("#start_duration").val()) * 60 * 1000));		
					  		//console.log("start dur: " + $("#start_duration").val() + " process dur: " + $("#process_duration").val() + " total: " + ($("#start_duration").val() + $("#process_duration").val()) * 1000);
	 				  		calEvent.s_end = new Date(calEvent.start.getTime() + ((parseInt(parseInt($("#start_duration").val())) + parseInt(parseInt($("#process_duration").val()))) * 60 *1000));
	                      	calEvent.end = new Date(calEvent.start.getTime() + ((parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val())) * 60 * 1000));

					  }
					  else
					  {
					  	calEvent.s_start = "";
					  	calEvent.s_end = "";
                        calEvent.end = new Date(calEvent.start.getTime() + ($("#service_duration").val() * 60 * 1000));					 
					  }
					                        
                      
                      calEvent.client_note = "";
                      calEvent.stylist_note = $("#stylist_notes_field").val();
                      calEvent.service_id = $("#service_id_selector").val();
                      calEvent.service = $("#service_id_selector option[value=" + calEvent.service_id + "]").text();
                      calEvent.client_first_name = $("#client_details_form input[name='first_name']").val();
                      calEvent.client_last_name = $("#client_details_form input[name='last_name']").val();
                      calEvent.title = calEvent.client_first_name + " " + calEvent.client_last_name;
                      calEvent.client_email = $("#client_details_form input[name='email']").val();
                      calEvent.client_phone_1 = $("#client_details_form input[name='phone_1']").val();
                      calEvent.client_phone_2 = $("#client_details_form input[name='phone_2']").val();
                      calEvent.client_work_ph = $("#client_details_form input[name='work_ph']").val();
                      calEvent.client_work_ext = $("#client_details_form input[name='work_ext']").val();
					  calEvent.reminder_type = $("#reminder_type").val();
					  calEvent.client_country = $("#country").val();
					  calEvent.status = $("#status").val();
					  calEvent.cost = $("#cost").val();
					  calEvent.tip = $("#tip").val();
			  
                      
                      
					  if($("#email_client_cb").is(":checked"))
					  {
						 calEvent.email_client = true;
					  }
					  else
					  {
						calEvent.email_client = false;
					  }                                            

						// log this request for debugging
						$.ajax({
							url: '../includes/ajax_request_logger.php',
							dataType: "json",
							timeout: 10000,									
							data: {"stylist_id":stylist_id,"client_type":"new_user","start_time":calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":"1","service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"email":calEvent.client_email,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,"work_ext":calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
							success: function(returned_data){ // success function
							}
						});			

                          
                    // save date using php TODO: parse out "&" from user 
                    $.ajax({
                        url: '../includes/appointment_helper.php',
                        data: {"stylist_id":stylist_id,"client_type":"new_user","start_time":calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":"1","service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"email":calEvent.client_email,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,"work_ext":calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
						timeout: 10000,
                        dataType: "json",
                        success: function(returned_data){ // success function
                          //  alert("data from json" + returned_data);
                          // set calevent id to the booking insertion ID returned by the ajax request                            
                          calEvent.id = returned_data['appointment_id'];
                          
                          var client_emailed = returned_data['client_emailed'];  
                            
                          $calendar.weekCalendar("removeUnsavedEvents");
                          $calendar.weekCalendar("updateEvent", calEvent);

                         // clear all the fields to start
                        clear_all_fields();  
                        
                          $n_a_dialogContent.dialog("close");
                          
                          // new appointment successfully saved - let's display success box
                          save_success(calEvent, $event, "new", client_emailed);
                                          
                          
                        },
						error: function(jqXHR, textStatus, errorThrown)
						{
							if(textStatus == 'timeout' || textStatus == 'error'){
								connection_doctor();
							}
						}
                    });
    
                } // end if valid form
               }
            }]
         }).show();
                  

                // check whether to show "email to client" checkbox	         
                 email_checker();    	

        // if service selector doesn't exist (we have no services then)
        if($("#service_id_selector").length == 0)
        {
            // hide the save button so they can't save without service
            $(":button:contains('save')").hide();          
        }                                                  
        $("#service_id_selector option[value='select']").attr("selected", "selected");
         $n_a_dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), "new_appointment");

			 $(".ui-dialog-buttonpane").append("<span class=\"client_email_cb ui-corner-all\"><label for=\"email_client_cb\" class=\"small_text disabled_text\" ><input type=\"checkbox\" name=\"email_client\" value=\"yes i have a value\" id=\"email_client_cb\"  style=\"margin: 0px;\" disabled /> &nbsp;<i class=\"icon-envelope\"></i> Email client + stylist on save </label> </span>");

      }
      
/*************************************************************************************/      
      
function new_appointment_for_existing(calEvent, $event) {  // form layout for new event

         var $n_a_dialogContent = $("#event_edit_container");
         resetForm($n_a_dialogContent);
         
		 // clear all the fields to start
  		 clear_all_fields();         
         
         // hide editable view of client details
         $("#client_details_list").show();
         $("#client_details_form").hide();         
        
        // grab references to empty start and end fields
         var startField = $("#booking_start");
         var endField = $("#booking_end_time");
                                                                                     
        disable_modal_fields();        

		$n_a_dialogContent.find("input[name='first_name']").val(calEvent.client_first_name);
		var client_name = "<em>" + calEvent.client_first_name + "</em>";
		if(calEvent.client_last_name != "")
		{
			$n_a_dialogContent.find("input[name='last_name']").val(calEvent.client_last_name);
			client_name = client_name  + " <em>" + calEvent.client_last_name + "</em>";
		}
		client_name = "<a href=\"edit_client.php?cid=" + calEvent.client_id + "&sid=" + stylist_id + "\">" + client_name + "</a>";	             
		$("#client_name_list").html(client_name);
                     
		if(has_client_data(calEvent))
		{
			 if(calEvent.client_email != "")
			 {
				 $n_a_dialogContent.find("input[name='email']").val(calEvent.client_email);
				 $("#email_list").html('<a href="mailto:' + calEvent.client_email + '">' + calEvent.client_email + '</a>');
			 }
			 else{$("#email_list").html("");}
			 if(calEvent.client_phone_1 != "")
			 {
				 $n_a_dialogContent.find("input[name='phone_1']").val(calEvent.client_phone_1);
				 $("#home_ph_list").html("<span class=\"client_details_label\">Home</span> " + calEvent.client_phone_1);
			 }
			 else{$("#home_ph_list").html("");}	             
			 if(calEvent.client_phone_2 != "")
			 {
				 $n_a_dialogContent.find("input[name='phone_2']").val(calEvent.client_phone_2);
				 $("#mobile_ph_list").html("<span class=\"client_details_label\">Mobile</span> " + calEvent.client_phone_2);
			 }
			 else{$("#mobile_ph_list").html("");}	             
			 if(calEvent.client_work_ext != "")
			 {
			   $n_a_dialogContent.find("input[name='work_ext']").val(calEvent.client_work_ext);
				var work_ext_txt = " <span class=\"client_details_label\">ext</span> " + calEvent.client_work_ext;
			 }
			 else
			{
				var work_ext_txt = "";
			}
			 if(calEvent.client_work_ph != "")
			 {
			   $n_a_dialogContent.find("input[name='work_ph']").val(calEvent.client_work_ph);
			   $("#work_ph_list").html("<span class=\"client_details_label\">Work</span> " + calEvent.client_work_ph + work_ext_txt);
			 }
			 else{$("#work_ph_list").html("");}	       
			 if(calEvent.reminder_type != "")
			 {
				 $("#reminder_type").val(calEvent.reminder_type);
			 }
				   
		}

		var titleField = $n_a_dialogContent.find("input[name='title']").val(calEvent.title);
		var clientNotesField = $n_a_dialogContent.find(".client_notes_holder").html(""); // On new appointments clear the field to make sure it is blank         
		$n_a_dialogContent.find("input[name='client_id']").val(calEvent.client_id);      
		$("#booking_id").val("");
		$n_a_dialogContent.find("#appointment_type").val("new");   
		// set service dropdown to have "select a service..." showing
		$("#service_id_selector option[value='select']").attr("selected", "selected");           	                                   
		$("#status").val(3);  // set status to confirmed by default         
		$n_a_dialogContent.find(".client_details_heading").html("<h3><em>Client</em> details</h3>");
		$("#email_client_cb").val("no");            	
		$("#email_client_cb").attr("checked", false);          

         $n_a_dialogContent.dialog({
            width: 875,         
            modal: true,
          
          /*  title: "Booking with " + stylist_name,*/
            close: function() {
                         // clear all the fields to start
                        clear_all_fields();                 
               $n_a_dialogContent.dialog("destroy");
               $n_a_dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
               // hide the text warning because a custom time length is set

			   // hide any error messages that were displayed
			   $("label[generated=true]").hide();		
                                       
			   	   
            },
            buttons: [{
               text: "Save",
               "class": 'primary_button',
               click: function() {
                  if($("#modal_booking_form").valid()){    
                          calEvent.start = new Date(startField.val());

						  // check if advanced duration
						  if($("#duration_type").val() == "advanced")
						  {
								calEvent.s_start = new Date(parseInt(calEvent.start.getTime()) + (parseInt($("#start_duration").val()) * 60 * 1000));		
								//console.log("start dur: " + $("#start_duration").val() + " process dur: " + $("#process_duration").val() + " total: " + ($("#start_duration").val() + $("#process_duration").val()) * 1000);
								calEvent.s_end = new Date(calEvent.start.getTime() + ((parseInt(parseInt($("#start_duration").val())) + parseInt(parseInt($("#process_duration").val()))) * 60 *1000));
								calEvent.end = new Date(calEvent.start.getTime() + ((parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val())) * 60 * 1000));
	
						  }
						  else
						  {
							calEvent.s_start = "";
							calEvent.s_end = "";
							calEvent.end = new Date(calEvent.start.getTime() + ($("#service_duration").val() * 60 * 1000));					 
						  }                          
                          
                          calEvent.stylist_note = $("#stylist_notes_field").val();
                          calEvent.service_id = $("#service_id_selector").val();
                          calEvent.service = $("#service_id_selector option[value=" + calEvent.service_id + "]").text();
                          calEvent.client_first_name = $("#client_details_form input[name='first_name']").val();
                          calEvent.client_last_name = $("#client_details_form input[name='last_name']").val();
                          calEvent.title = calEvent.client_first_name + " " + calEvent.client_last_name;
                          calEvent.client_email = $("#client_details_form input[name='email']").val();
                          calEvent.client_phone_1 = $("#client_details_form input[name='phone_1']").val();
                          calEvent.client_phone_2 = $("#client_details_form input[name='phone_2']").val();
						  calEvent.client_work_ph = $("#client_details_form input[name='work_ph']").val();
						  calEvent.client_work_ext = $("#client_details_form input[name='work_ext']").val();                          
						  calEvent.client_country = $("#country").val()
						  calEvent.reminder_type = $("#reminder_type").val();            			  
	                      calEvent.status = $("#status").val();
	                      calEvent.cost = $("#cost").val();           
	                      calEvent.tip = $("#tip").val();
	                      
            			  
            			  if($("#email_client_cb").is(":checked"))
            			  {
            			     calEvent.email_client = true;
            			  }
            			  else
            			  {
                            calEvent.email_client = false;
                          }             			  

						// log this request for debugging
						$.ajax({
							url: '../includes/ajax_request_logger.php',
							dataType: "json",
							timeout: 10000,									
                            data: {"stylist_id":stylist_id,"client_type":"new_for_existing","start_time": calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":calEvent.client_id,"service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"booking_id":calEvent.id,"email":calEvent.client_email,"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,'work_ext':calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
							success: function(returned_data){ // success function
							}
						});			
            
                        // save date using php 
                        $.ajax({
                            url: '../includes/appointment_helper.php',
                            data: {"stylist_id":stylist_id,"client_type":"new_for_existing","start_time": calEvent.start,"split_start":calEvent.s_start,"split_end":calEvent.s_end,"end_time":calEvent.end,"client_id":calEvent.client_id,"service_id":calEvent.service_id,"stylist_note":encodeURIComponent(calEvent.stylist_note),"booking_id":calEvent.id,"email":calEvent.client_email,"first_name":calEvent.client_first_name,"last_name":calEvent.client_last_name,"phone_1":calEvent.client_phone_1,"phone_2":calEvent.client_phone_2,"work_ph":calEvent.client_work_ph,'work_ext':calEvent.client_work_ext,"service_name":calEvent.service,"email_client":calEvent.email_client,"cost":calEvent.cost,"tip":calEvent.tip,"status":calEvent.status,"reminder_type":calEvent.reminder_type,"country":calEvent.client_country},
                            dataType: "json",
							timeout: 10000,
                            success: function(returned_data){ // success function
                              //  alert("data from json" + returned_data);

                              // set calevent id to the booking insertion ID returned by the ajax request                            
                              calEvent.id = returned_data['appointment_id'];      

                            calEvent.client_emailed = returned_data['client_emailed'];    
        
                              $calendar.weekCalendar("removeUnsavedEvents");
                              $calendar.weekCalendar("updateEvent", calEvent);

                             // clear all the fields to start
                            clear_all_fields();        
                            
                              $n_a_dialogContent.dialog("close");

                              // new appointment successfully saved - let's display success box
                              save_success(calEvent, $event, "existing", calEvent.client_emailed);
                                    
        
                            },
							error: function(jqXHR, textStatus, errorThrown)
							{
								if(textStatus == 'timeout' || textStatus == 'error'){
									connection_doctor();
								}
							}
                        });
                } // end if valid data check

               }
            }]
         }).show();
         
	                  
                // check whether to show "email to client" checkbox	         
                 email_checker();   

		 check_reminder_types_available();                                     
                 
        // if service selector doesn't exist (we have no services then)
        if($("#service_id_selector").length == 0)
        {
            // hide the save button so they can't save without service
            $(":button:contains('save')").hide();          
        }                  
        $("#service_id_selector option[value='select']").attr("selected", "selected");
         $n_a_dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), "new_appointment_for_existing");

		if(calEvent.client_email != "")
		{
			var show_disabled = "";
		}
		else
		{
			var show_disabled = " disabled ";
		}

		 $(".ui-dialog-buttonpane").append("<span class=\"client_email_cb ui-corner-all\"><label for=\"email_client_cb\" class=\"small_text disabled_text\" ><input type=\"checkbox\" name=\"email_client\" value=\"yes i have a value\" id=\"email_client_cb\"  style=\"margin: 0px;\" " + show_disabled  + "/> &nbsp;<i class=\"icon-envelope\"></i> Email client + stylist on save </label> </span>");

      }      
 
// Function to call ajax to delete selected appointment after dialog confirmation
function delete_confirmation(calEvent, $event){
	// get a handle for the delete confirmation container
	$cd_container = $("#confirm_delete_container");
		
	// render the Dialog 
	$cd_container.dialog(
	{
		width: 340,
		modal: true,
		title: "Confirm Delete",
		close: function()
		{
               $cd_container.dialog("destroy");
               $cd_container.hide();		
		},
		buttons:
		{
			"Cancel": function() 
			{
                  $cd_container.dialog("close");
			},
			"Delete Appointment": function()
			{
			
						// log this request for debugging
						$.ajax({
							url: '../includes/ajax_request_logger.php',
							dataType: "json",
							timeout: 10000,									
							data: {"stylist_id":stylist_id,"client_type":"mark_deleted","booking_id":calEvent.id,"service_name":calEvent.service,"start_time":calEvent.start,"client_id":calEvent.client_id,"email":calEvent.client_email,"email_client":calEvent.email_client},
							success: function(returned_data){ // success function
							}
						});					
			
				// send an ajax request to php to mark appointment as deleted		
                // save booking using php 
                $.ajax({
                    url: '../includes/appointment_helper.php',
                    data: {"stylist_id":stylist_id,"client_type":"mark_deleted","booking_id":calEvent.id,"service_name":calEvent.service,"start_time":calEvent.start,"client_id":calEvent.client_id,"email":calEvent.client_email,"email_client":calEvent.email_client},
                    dataType: "json",
					timeout: 10000,
                    success: function(returned_data)
                    { // success function
            
            	        if(returned_data.success == true)
            	        {
							// run this if ajax delete returns successfully
							 $calendar.weekCalendar("removeEvent", calEvent.id);
			                 $calendar.weekCalendar("removeEvent", calEvent.id);
			                 console.log("Remove: " + calEvent.id);

			
			
							// hide this dialog on success
			                $cd_container.dialog("destroy");
			                $cd_container.hide();		
			            }
			            else
			            {
			                 alert("delete failed - please try again in a few seconds");
			            }     
                    },
					error: function(jqXHR, textStatus, errorThrown)
					{
						if(textStatus == 'timeout' || textStatus == 'error'){
							connection_doctor();
						}
					}
                });
				
				
				
						
			}
		}
	}
	).show();
	
}

// show the success dialog on a successful save
function save_success(calEvent, $event, type, client_emailed)
{	
	$ss_container = $("#save_success")

	
	// todo check which type of success
	
	// check if the client was emailed
	
	if(typeof client_emailed == "undefined")
	{ // TODO: in the future, we probably won't tell people when the client Wasn't emailed
         var client_emailed_text = "<i class=\"icon-exclamation-sign\"></i> Client was not emailed";
	}
	else if(client_emailed == false)
	{
        var client_emailed_text = "<i class=\"icon-exclamation-sign\"></i> The client was not emailed";
	}
	else
	{
	     var client_emailed_text = "<i class=\"icon-envelope\"></i> The client was emailed a copy of the booking.";
	}
	
	$(".success_message").html("<span class=\"script bigger\">Saved</span><br /><br />Your booking was <em>successfully saved</em>.<br><br><br />" + client_emailed_text);

	$ss_container.dialog(
		{
			width: 350,
			modal: true,
			title: "",
			close: function()
			{
	               $ss_container.dialog("destroy");
	               $ss_container.hide();		
			},
			buttons:
			{
				OK: function() 
				{
	                  $ss_container.dialog("close");
				}
			}
		}
	).show();
	
   setTimeout(function(){$ss_container.dialog("close");},2500);			

}

function selectItem(li, calEvent, $event) {
	findValue(li, calEvent);
    $("#new_appointment_container").dialog("destroy");
	$("#new_appointment_container").hide();
	new_appointment_for_existing(calEvent, $event);
}

// findValue(li, calEvent)  -- this one
// oSuggest.findValue()  -- redirecting to here somehow

// Find value is used for the autofill
function findValue(li, calEvent) 
{
	if( li == null ) return alert("No match!");

    // set client variables from selected drop down option
	if( !!li.extra ) calEvent.client_email = li.extra[0];
    if(!!li.extra) calEvent.client_first_name = li.extra[1];
    if(!!li.extra) calEvent.client_last_name = li.extra[2];
    if(!!li.extra) calEvent.client_id = li.extra[3];
    if(!!li.extra) calEvent.client_phone_1 = li.extra[4];
    if(!!li.extra) calEvent.client_phone_2 = li.extra[5];
    if(!!li.extra) calEvent.client_work_ph = li.extra[6];
    if(!!li.extra) calEvent.client_work_ext = li.extra[7];
    if(!!li.extra) calEvent.reminder_type = li.extra[8];

	// otherwise, let's just display the value in the text box
	else var sValue = li.selectValue;


	//alert("The email selected was: " + client_email + " id: " + client_id + " " + client_phone_1 + " " + client_phone_2 );
}




   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes, callingFunction) {


      	
      	$("#modal_book_off_form input[name='calling_function']").val(callingFunction);

		var selected_slots = $("input[name='selected_slots']").val();   // number of slots dragged on the calendar

  
	if(callingFunction != "book_time_off"){$endTimeField.html("");}
    
    var end_time_html = "";


      
    var start_time_html = setupStartSelect($startTimeField, calEvent.start, timeslotTimes);  

    $startTimeField.html(start_time_html);

    $("#booking_start").val(String(calEvent.start));



        end_time_html = twelve_hour_format(calEvent.end);

		if(callingFunction == "book_time_off")
		{
		    $("#book_off_start").val(String(calEvent.start));
			var this_duration = (calEvent.end.getTime() - calEvent.start.getTime())/60/1000;
			$("#book_off_duration").val(this_duration);
		}
		else
		{
			
			//setup durations
			// if simple
			if(calEvent.s_start == "" || calEvent.s_start == undefined)
			{
				 // simple
				 // calc total duration
				 var this_duration = (calEvent.end.getTime() - calEvent.start.getTime())/60/1000;
				 show_simple_duration();
				 $("#bookback").attr('checked', false);;
				 $("#service_duration").val(this_duration);
			}
			else
			{
				 // advanced
				 $("#bookback").attr('checked', true);
				 show_advanced_duration();
				 // calc start duration
				 var start_duration = (calEvent.s_start.getTime() - calEvent.start.getTime())/60/1000;
				$("#start_duration").val(start_duration);
				
				 // calc process duration
				 var process_duration = (calEvent.s_end.getTime() - calEvent.s_start.getTime())/60/1000;
				$("#process_duration").val(process_duration);	 
				
				 // calc finish duration
				 var finish_duration = (calEvent.end.getTime() - calEvent.s_end.getTime())/60/1000;
				$("#finish_duration").val(finish_duration);	
				
			}
		
        }
        

    // apply end time html 

	$endTimeField.html(end_time_html);
	// save js date object as data to end field
	$endTimeField.data("end_date", calEvent.end);	    
    
    	         //console.log("in func: " + $endTimeField.val());

	  // set the hidden field "selected_slots" to the number selected upon opening

	       var selected_slots = (calEvent.end.getTime() - calEvent.start.getTime())/1000/60/15;
            $("input[name='selected_slots']").val(selected_slots);		 


      $endTimeOptions = $endTimeField.find("option");
	
      
   } // end setupStartEndTimeFields


    // running inline
    if(isiOS())
    {

    // We were using .on('mouseup') which was causing problems on iOS because it doesn't have a mouse
        $("#service_id_selector").on('focusout', function() {
            check_service_duration();
        });
    }
    else
    {

    // We were using .on('mouseup') which was causing problems on iOS because it doesn't have a mouse
        $("#service_id_selector").on('change', function() {
            check_service_duration();
        });    
    }
     
    
    
    // function to check if an iOS device is requesting
    function isiOS(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1) ||
            (navigator.platform.indexOf("iPad") != -1)
        );
    }    
    
    function enable_modal_fields()
    {
         // set input to be disable until service is selected
        $("#bookback").removeAttr('disabled');
        $("#booking_start").removeAttr('disabled');
        $("#service_duration").removeAttr('disabled');
        $("#start_duration").removeAttr('disabled');
        $("#process_duration").removeAttr('disabled');
        $("#finish_duration").removeAttr('disabled');
        $("#status").removeAttr('disabled');
        $("#cost").removeAttr('disabled');
        $("#stylist_notes_field").removeAttr('disabled');
        
        $(".disableable").removeClass("disabled");        
    }
    
    function disable_modal_fields()
    {
         // set input to be disable until service is selected
        $("#bookback").attr('disabled', true);
        $("#booking_start").attr('disabled', true);
        $("#service_duration").attr('disabled', true);         
        $("#start_duration").attr('disabled', true);         
        $("#process_duration").attr('disabled', true);         
        $("#finish_duration").attr('disabled', true);         
        $("#status").attr('disabled', true);         
        $("#cost").attr('disabled', true);     
        $("#stylist_notes_field").attr('disabled', true);  
        
        $(".disableable").addClass("disabled");
    }
    

  // change end time based on service type selected if new appointment was created by clicking (if created by dragging the use the time specified by the user's drag)
function check_service_duration() {

        $("#modal_booking_form").validate().element("#service_id_selector");

        if($("#service_id_selector").val() == "select")
        {
            disable_modal_fields();
        }
        else
        {
            enable_modal_fields();
        }

          var $endTimeField = $("#booking_end_time");      
          var $startTimeField = $("#booking_start");

		// only run if default time length is set - 15min/1time slot

        // get if new or existing appointment the user is viewing
        var appointment_type = $("#appointment_type").val();

		var selected_slots = parseInt($("input[name='selected_slots']").val());   // number of slots dragged on the calendar

            var $service_list = $("#service_id_selector");
			// get service duration from selected service
			var service_duration = $service_list.find(":selected").attr("name");


            var start_time_date = new Date($startTimeField.val());		
			
			// check if advanced duration
			if(service_duration.indexOf("|") != -1)
			{
				// advanced duration, we will show advanced and set the 3 durations
				var duration_parts = service_duration.toString().split('|');
				var start_duration = duration_parts[0];
				var process_duration = duration_parts[1];
				var finish_duration = duration_parts[2];
				service_duration = parseInt(start_duration) + parseInt(process_duration) + parseInt(finish_duration);
				var duration_type = "advanced";
				show_advanced_duration();
                 $("#bookback").attr('checked', true);
				// set durations
				$("#start_duration").val(start_duration);
				$("#process_duration").val(process_duration);
				$("#finish_duration").val(finish_duration);
                // set end time = date from start + duration minutes
                
                new_end_date = new Date(start_time_date);
                new_end_date.setMinutes(start_time_date.getMinutes() + service_duration);
                
                var end_time_html = twelve_hour_format(new_end_date);
                $endTimeField.html(end_time_html);
                $endTimeField.data("end_time", new_end_date);
                
                
			}
			else
			{
				// simple duration
				service_duration = parseInt(service_duration); // can't force int until after check for advanced
				var duration_type = "simple";
				show_simple_duration();
                 $("#bookback").attr('checked', false); 
 
 			
                // slot_number = slot_number of start time + number of slots the service duration takes (calculated from min) - 1
                //var slot_number = parseInt($("#booking_start option:selected").attr("name")) + ((15 * Math.round(service_duration/15)) / 15) -1;
 
  				//console.log("slot numb " + slot_number);

 
                // see if we should update the end time to be correct - don't do this if we are a new appointment with custom drag selected
                if((appointment_type == "new") && (selected_slots > 1))
                {
                    // new appointment with custom length - don't change end time!
                    // 1) keep duration no matter what - they specified a particular length
                    // hide length warning if custom == true service length here          
                }       
                 else if((appointment_type == "new") && (selected_slots == 1))
                {
                    // new appointment is 15 min or it is an edit in which case we check if custom length
                    // change appointment duration
                      // set the end time field to the correct time based on the number of slots this service requires
					new_end_date = new Date(start_time_date);
					new_end_date.setMinutes(start_time_date.getMinutes() + service_duration);
					
					var end_time_html = twelve_hour_format(new_end_date);
					$endTimeField.html(end_time_html);                 
					$endTimeField.data("end_time", new_end_date);  
					
					$("#service_duration").val(service_duration);
					
                }		      
                else if(appointment_type == "edit")
                {
                      // set the end time field to the correct time based on the number of slots this service requires
					new_end_date = new Date(start_time_date);
					new_end_date.setMinutes(start_time_date.getMinutes() + service_duration);
					
					var end_time_html = twelve_hour_format(new_end_date);
					$endTimeField.html(end_time_html);                
					$("#service_duration").val(service_duration);

				}	

			}
			


			// update the price too - todo: might make this a separate function	  
			
			$.ajax({
				url: '../includes/service_details_helper.php',
				data: {"service_id":$service_list.val()},
				dataType: "json",
				timeout: 10000,
				success: function(returned_data){ // success function
					$("#cost").val(returned_data);
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
			    	if(textStatus == 'timeout' || textStatus == 'error'){
						connection_doctor();
			    	}
				}
			});


		
			// find the first element that is displayed (block)
			// step forward as many 15 min slots as needed
			// mark that as selected


	}


	
	// when the user changes the start time of the appointment
	
	$("#booking_start").change(function()
	{
	   adjust_end_time("#booking_start", "#booking_end_time");
	});

	$("#book_off_start").change(function()
	{
	   adjust_end_time("#book_off_start", "#book_off_end");
	});	
	
	
	function adjust_end_time(start_field_name, end_field_name)
	{
	      var $endTimeField = $(end_field_name);      
		  var $startTimeField = $(start_field_name);	
		  		  
		  var start_time = $startTimeField.find("option:selected").val();
		  
		  

		if($startTimeField == "#book_off_start")
		{
			var booking_duration = parseInt($("#book_off_duration").val());
		} // end if book off
		else
		{
			if($("#duration_type").val() == "simple")
			{
				var booking_duration = parseInt($("#service_duration").val());
			}
			else
			{
				var booking_duration = parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val());
			}

         }	// end else not book off	  		 
        // Adjust the end time to keep the duration of the appointment when start time changes (like iCal)
          
  
        var end_date = new Date(start_time);
        

        end_date.setMinutes(end_date.getMinutes() + booking_duration);
        
        
        var formatted_date = twelve_hour_format(end_date);
		
        // apply the adjusted end time so appointment length stays the same
        $endTimeField.html(formatted_date);		  
        /*$endTimeField.data(end_date);	*/	  
			
	}
	
	// when a duration changes on advanced appt
	$("#start_duration, #process_duration, #finish_duration").change(function(){	   
            var start_time_date = new Date($("#booking_start").val());		
			var service_duration = parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val());
            new_end_date = new Date(start_time_date);
            new_end_date.setMinutes(start_time_date.getMinutes() + service_duration);
            
            var end_time_html = twelve_hour_format(new_end_date);
            $("#booking_end_time").html(end_time_html);      	   
           $("#booking_end_time").data("end_time", new_end_date);
	});
	
	// change of duration on simple appt
	$("#service_duration").change(function(){
            var start_time_date = new Date($("#booking_start").val());		
			var service_duration = $("#service_duration").val();
            new_end_date = new Date(start_time_date);
            new_end_date.setMinutes(start_time_date.getMinutes() + parseInt(service_duration));
            
            var end_time_html = twelve_hour_format(new_end_date);
            $("#booking_end_time").html(end_time_html);        	   
            $("#booking_end_time").data(new_end_date);
	});
	
	// change of duration on book off
	$("#book_off_duration").change(function(){
            var start_time_date = new Date($("#book_off_start").val());		
			var service_duration = $("#book_off_duration").val();
            new_end_date = new Date(start_time_date);
            new_end_date.setMinutes(start_time_date.getMinutes() + parseInt(service_duration));
            
            var end_time_html = twelve_hour_format(new_end_date);
            $("#book_off_end").html(end_time_html);        	   
            $("#book_off_end").data(new_end_date);
	});	
	
	$("#booking_end").change(function()
	{
		// find out if a custom time length has been selected
	      var $endTimeField = $("#booking_end");      
		  var $startTimeField = $("#booking_start");	 
		  var end_time_int = parseInt($endTimeField.find("option:selected").attr("name"));
		  var start_time_int = parseInt($startTimeField.find("option:selected").attr("name"));

	
			// check if it matches a selected appointment duration
			var $service_list = $("#service_id_selector");
			var service_duration = $service_list.find(":selected").attr("name");
			if(service_duration == undefined) // Service not selected
			{			
			}
			else
			{
			// Service is selected
	
					
					// if the service minutes divided by 15 don't match the number of time slots
					if(((service_duration/15)-1) != (end_time_int - start_time_int))
					{
						// show the text warning because a custom time length is set

					}	
					else
					{ 
						// the service length matches the number of timeslots	
						// hide the text warning because a custom time length is set

					}
			}			

	});	
	
	
	$("#reset_default_length").click(function()
	{
	   // set the hidden variable we use to determine if a custom length was set to 1
		$("input[name='selected_slots']").val(1);
		
		// get service duration
			var $service_list = $("#service_id_selector");
			var service_duration = $service_list.find(":selected").attr("name");
					
		// get current start time slot
		  var $startTimeField = $("#booking_start");	 
		  var $endTimeField = $("#booking_end");
		  var start_time_int = parseInt($startTimeField.find("option:selected").attr("name"));
		
		// calculate number of slots in future
		var end_slot_value = start_time_int + Math.round(((service_duration/15)-1));
		
		// set end time to number of slots in future
		      $endTimeField.find("option[name=" + end_slot_value + "]").attr("selected", "selected");		

		// hide warning messages


		return false;
	});	
	

// when the jump to week today buttons are clicked then make calendar update to selected date	
$(".jump_today").click(function()
{
	// today function was causing problems with double loading events so they showed 2x - so we're just calling this current week instead
	var current_week = Math.round(new Date().getTime() / 1000); 
	// unix time for today's date
	current_week_mili = current_week * 1000;
	var current_week_date = new Date(current_week_mili);
	$('#calendar').weekCalendar("gotoWeek", current_week_date);	
	return false;
});

$(".jump_weeks").click(function()
{
	var current_week = unix_week_start_date; //unix time for the first day of the week in seconds
	// turn into miliseconds for weekcal compatibility
	current_week_mili = current_week * 1000;
	
	var num_weeks = $(this).find("a").attr("name");
	var new_week_mili = current_week_mili + (num_weeks * 7 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000); // add 1/2 a day to make sure it ends up in next week (daylight savings prob)

	//alert("current_week " + current_week + " current_week_mili " + current_week_mili + " num_weeks " + num_weeks + " new_week_mili " + new_week_mili);

	var new_week_date = new Date(new_week_mili);

	$('#calendar').weekCalendar("gotoWeek", new_week_date);	
	
	return false;

});

$("input[name='email']").keyup(function()
    {
        email_checker();    
    }
);
	
// show editable client details when user clicks on edit
$("#edit_client_link").click(function()
{
    // show editable view of client details
     $("#client_details_list").hide();
     $("#client_details_form").show();
     return false;
});	
	
		
// function to check if email valid
function email_checker()
{
        function isValidEmail(email)
        {
             var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
             return email.match(re)
       }
       
    var current_email_val = $("input[name='email']").val();

    if(isValidEmail(current_email_val))
    {
        // true
        if(current_email_val == "")
        {
            // blank
            // disable checkbox and text  TODO make target just email client checkbox
            $("#email_client_cb").attr("disabled", true);
            $("#email_client_cb").attr("checked", false);
            $(".small_text").addClass("disabled_text");
        }
        else
        {    
            // valid email
            $("#email_client_cb").attr("disabled", false);
            $("#email_client_cb").attr("checked", false);
            $(".small_text").removeClass("disabled_text");            
        }    
    }
    else
    {
            // disable checkbox and text  TODO make target just email client checkbox
            $("#email_client_cb").attr("disabled", true);
            $("#email_client_cb").attr("checked", false);
            $(".small_text").addClass("disabled_text");        
    }
    
    

}	
	
function fix_header_widths()
{

	if($(".wc-scrollable-grid").width() == $(".wc-time-slots").width())
	{
		$("#scroll_shim").hide();
	}


	// adjust the header column widths to fit line up properly
	var cal_outer_width = $(".wc-scrollable-grid").outerWidth();
	
	// calculate the total width used by the hour column headers
	var hour_col_widths = 4 * 81;
	
	// calculate the width that each column header will have
	var col_head_width = Math.round((cal_outer_width - hour_col_widths -16)/7) ;
		
	$(".wc-day-column-header").css("width",col_head_width);
	
	$("#calendar").weekCalendar("resizeCalendar");
	
}

// run the fix header widths when the page is resized
$(window).resize(function()
{
	fix_header_widths();
});

//  form validation 
			
jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
			phone_number = phone_number.replace(/\-?\.?\s?/g, ""); 
			if(this.optional(element) || phone_number.length > 9)
			{ 
				//alert("true");
				return true;
			}
			else
			{ 
				//alert("false");
				$("#client_details_form").show();
				$("#client_details_list").hide();
				return false;
			}
		}, "Please specify a valid phone number");
	
		jQuery.validator.addMethod("not_zero", function(service_number) {
			return service_number > 0;
		}, "Please select a service");		   
	   
		$("#modal_booking_form").validate({		
			rules: {
				first_name: {
					required: true
				},
				last_name: {
					required: false
				},
				email: {
					required: false,
					email: true,
					remote: {
    					url: "../includes/client_email_helper.php",
    					type: "post",
    					data:{
    					   client_id: function(){
    					        return $("input[name='client_id']").val();
    					   }
    				    }
					}
				},
				phone_1: {
					required: false,
					phoneUS: true
				},
				phone_2: {
					required: false,
					phoneUS: true
				},
				work_ph: {
					required: false,
					phoneUS: true
				},
				service:{
				    not_zero: true
				}
			},
			messages:{
				first_name: {
					required: "Please enter a firstname &uarr;"
				},
				last_name: "Please enter a lastname &uarr;", 
			   email: { 
					required: "Please enter a valid email address &uarr;", 
					minlength: "Please enter a valid email address &uarr;",
					remote: "Email address is already in use &uarr;"
				}, 
				phone_1: "Please enter a valid phone number with area code &uarr;",
				phone_2: "Please enter a valid phone number with area code &uarr;",
				work_ph: "Please enter a valid phone number with area code &uarr;",
				service: "Please select a service &uarr;"				
			}
			
		});


// end form validation
        
        //show advanced service duration
        
		$("#bookback").change(function(){
            if($(this).is(":checked"))
            {
			     show_advanced_duration();
			 }
			 else
			 {
			     show_simple_duration();
			 }
		});

        function show_simple_duration()
        {
			$("#advanced_duration").hide();
			$("#simple_duration").show();
			$("#duration_type").val("simple");	
			update_end_time("simple");        
        }
        
        function show_advanced_duration()
        {
			$("#simple_duration").hide();
			$("#advanced_duration").show();
			$("#duration_type").val("advanced");            
			update_end_time("advanced");
        }



        function update_end_time(booking_type)
        {
                var start_time_date = new Date($("#booking_start").val());		                
                new_end_date = new Date(start_time_date);
                
                if(booking_type == "simple")
                {
                    service_duration = parseInt($("#service_duration").val());
                }
                else
                {
                    service_duration = parseInt($("#start_duration").val()) + parseInt($("#process_duration").val()) + parseInt($("#finish_duration").val());        
                }
                new_end_date.setMinutes(start_time_date.getMinutes() + service_duration);
                
                var $endTimeField = $("#booking_end_time");
                
                var end_time_html = twelve_hour_format(new_end_date);
                $endTimeField.html(end_time_html);
                $endTimeField.data("end_time", new_end_date);        
        }


    function clear_all_fields()
    {
        // clear all the fields to start
        $("#email_list").html("");
        $("#home_ph_list").html("");
        $("#mobile_ph_list").html("");
        $("#work_ph_list").html("");
        $("#stylist_notes_field").val("");    
        $("#client_notes_holder").html("");
        $("#no_info_notice").html("");
		$("#current_notes").show();
		$("#client_history").html("").hide();        
		$("#booking_nav_2").removeClass("active_note");
		$("#booking_nav_1").addClass("active_note");
		$("#booking_id").val("");
		$("#client_address").html("");		
		$("#country").val(salon_country);
    }

    function has_client_data(client_data)
    {

    
         if(client_data.client_email != "")
         {
            return true;
         }
         if(client_data.client_phone_1 != "")
         {
            return true;
         }
         if(client_data.client_phone_2 != "")
         {
            return true;
         }
         if(client_data.client_work_ph != "")
         {
            return true;
         }

         
         $("#no_info_notice").html("<br />You have <em>no contact information for this client!</em>");
        return false;
    }
    


	// refresh the events on the calendar every 3 minutes
	function timed_cal_refresh()
	{
	 	$('#calendar').weekCalendar("refresh");
	}
	
	setInterval(timed_cal_refresh,180000); // every 3 minutes


	// view appointment history
	$("#booking_nav_2").click(function(action)
		{
			action.preventDefault();
			$("#current_notes").hide();	
			$("#booking_nav_1, #booking_nav_3").removeClass("active_note");
			$("#booking_nav_2").addClass("active_note");
			$("#client_history").show();
			
			var this_client_id = $("#client_id").val();
			var this_booking_id = $("#booking_id").val();
			console.log("history");
			var client_history_html = "<ul>\n";
			
			$.ajax({
				url: '../includes/history_helper.php',
				type: "POST",
				data: {"client_id":this_client_id,"booking_id":this_booking_id},
				dataType: "json",
			    timeout: 10000,
			    error: function(jqXHR, textStatus, errorThrown)
			    {	console.log("fail");
			    	if(textStatus == 'timeout'){
						connection_doctor();
			    	}
			    },	
				success: function(bookings_data)
				{
					var bookings_data = bookings_data['bookings'][0];

						$.each(bookings_data, function(booking_key)
						{
							client_history_html += "<li><em>" + bookings_data[booking_key].service_name + "</em><br />\n"
							+ bookings_data[booking_key].date + "<br />\n"
							+ "From " + bookings_data[booking_key].start + " to " + bookings_data[booking_key].end + "<br />\n"
							+ "$" + bookings_data[booking_key].cost + "<br />\n";
							
							if(bookings_data[booking_key].stylist_note!= "")
							{
								client_history_html += "<br /><em>Service Details: </em>" + bookings_data[booking_key].stylist_note + "<br />\n";
							}
							if(bookings_data[booking_key].client_note!= "")
							{
								client_history_html += "<br /><em>Client Note: </em>" + bookings_data[booking_key].client_note + "<br />\n";
							}						
							client_history_html += "</li>\n";
						});
						client_history_html += "</ul>\n";

					$("#client_history").html(client_history_html);
				},
				error: function()
				{				
					client_history_html = "<br /><br /><span style=\"padding:80px;color: #ccc;\">No bookings to display</span>";
					$("#client_history").html(client_history_html);

				}
			});
			
			return false;
		}
	);

	// view current note
	$("#booking_nav_1").click(function(action)
		{
			action.preventDefault();
			$("#current_notes").show();
			$("#client_history").html("").hide();
			$("#booking_nav_2, #booking_nav_3").removeClass("active_note");
			$("#booking_nav_1").addClass("active_note");
			return false;
		}
	);
	

	
	
	$("#phone_2").on('change', function(){check_reminder_types_available();});
	$("#email").on('change', function(){check_reminder_types_available();});


});


// -----------------------  functions outside of document ready


        function twelve_hour_format(this_date)
        {
            // setup end time text
            if(this_date.getHours() <12)
            {
                var this_end_hours = this_date.getHours();
                var this_end_xm = "am";
            }
            else if(this_date.getHours() == 12)
            {
                var this_end_hours = this_date.getHours();
                var this_end_xm = "pm";
            }
            else
            {
                var this_end_hours = this_date.getHours() - 12;
                var this_end_xm = "pm";
            }
            if(this_date.getMinutes() == 0)
            {
                var this_end_minutes = "00";
            }
            else
            {
                  var this_end_minutes = this_date.getMinutes();
            }
            var response_data = this_end_hours + ":" + this_end_minutes + " " + this_end_xm;
            return response_data
        }
        
        function setupStartSelect($startTimeField, startTime, timeslotTimes)
        {
		   //  clear the submitted start time field to make sure we don't append to the end of it with multiple selector lists
		   $startTimeField.html("");
           	
          var start_time_html = "";
           	
		  // setup start time fields
		  for (var i = 0; i < timeslotTimes.length; i++) 
		  {
			 var startTime = timeslotTimes[i].start;
			 
			 start_time_html += "<option value=\"" + startTime + "\" name=\"" + i + "\" >" + timeslotTimes[i].startFormatted + "</option>";
		  }   
		  
		  $startTimeField.html(start_time_html);
		  
        }
        
   		function check_reminder_types_available()
		{
			var mobile_length = $("#phone_2").val().length;
			var email_length = $("#email").val().length;
			var mobile_valid = (mobile_length > 9 ? true : false);
			var email_valid = (email_length > 3 ? true : false);
			
			if(email_valid && mobile_valid){
				enable_sms_reminders();
				enable_email_reminders();
			}
			else if(email_valid && !(mobile_valid)){
				enable_email_reminders();
				disable_sms_reminders();
				$("#reminder_type").val(1);				
			}
			else if(!(email_valid) && (mobile_valid))
			{
				disable_email_reminders();
				enable_sms_reminders();
				$("#reminder_type").val(3);				
			}
			else
			{
				$("#reminder_type").val(1);
				$("#reminder_type_container").hide();							
			
			}			
		}

		
		function enable_sms_reminders(){
				$("#reminder_type_container").show();
				$("#reminder_type option[value=2]").removeAttr("disabled");				
				$("#reminder_type option[value=3]").removeAttr("disabled");		
		}

		function disable_sms_reminders(){
				$("#reminder_type option[value=2]").attr("disabled", "disabled");				
				$("#reminder_type option[value=3]").attr("disabled", "disabled");				
		}
		
		function enable_email_reminders(){
				$("#reminder_type_container").show();
				$("#reminder_type option[value=1]").removeAttr("disabled");				
				$("#reminder_type option[value=3]").removeAttr("disabled");
		}

		function disable_email_reminders(){
				$("#reminder_type option[value=1]").attr("disabled", "disabled");								
				$("#reminder_type option[value=3]").attr("disabled", "disabled");								
		}
