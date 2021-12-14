/**
 * Name: Form to JSON
 * Description: Create JSON object from a form submission using jQuery
 * Version: 1.0.0
 * Author: Shrikumar Infotech
 * Author URI: dev@shrikumarinfotech.com
 * License: MIT
 * Lincense URI: https://opensource.org/licenses/MIT
 */

 'use strict';

 jQuery.noConflict();
 jQuery(document).ready(function( $ ){
 
     // usage: 2
     $('#myForm').formToJson('.result-json-output');
     var obj = $('myForm').serializeJSON();
     obj.abc1.push({        //add the employee
        firstName:"Mike",
        lastName:"Rut",
        time:"10:00 am",
        email:"rut@bah.com",
        phone:"800-888-8888",
        image:"images/mike.jpg"
    });
    $('#abc1').append(obj); 
 });
