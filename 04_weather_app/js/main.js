/* by [tnga](https//github.com/tnga) */

$(document).ready( function () {
    
    showWeatherDetails("hidden") ;
    animateLoader("start") ;
    iJS.animate( $(".i-block>figure>button")[0], "wobble", 13) ;
    showNotification("<b>note:</b> for any other location, use search button.") ;
    
    var location = {} ;
    
    /* get the user's location */
    $.getJSON( "http://ipinfo.io/json")
    
    .done( function (loc) {
        
        var location = loc ;
        //ipinfo just provide de country iso code name, so will try to get native country name
        location.countryName = location.country ;
        
        //try to get native country name. this is usefull to have better result from Flickr API
        $.getJSON( "https://restcountries.eu/rest/v1/name/"+location.country
        )
        .done( function (data) {
            
            location.countryName = (iJS.isObject( data ) || iJS.isArray( data )) ? data[0].name : location.country ;
            console.log( data ) ;
            
            showPictureFromLoacation( location.city + ", "+ location.countryName ) ;
        })
        .fail( function () {

            showNotification( "(country.io) Oops! Connexion error...", "error" ) ;
            
            showPictureFromLoacation( location.city + ", "+ location.countryName ) ;
        }) ;
        
       
        showWeatherLocation( location.city + ", "+ location.country ) ;
        
        console.log( loc ) ;

    })
    .fail( function () {
        
        showNotification( "(ipinfo) Oops! Connexion error...", "error" ) ;
        animateLoader("stop") ;
        iJS.animate( $(".i-block")[0], "shake") ;
    }) ;
    
    $("input[name='search-weather']").on("change", function () {
        
        animateLoader("start") ;
        
        showPictureFromLoacation( this.value ) ;
        showWeatherLocation( this.value ) ;
    }) ;
    
    $("input[name='fahrenheit']").on("change", function () {
        
        if (this.checked) {
            
            $("#weather-details >p span:nth-child(1) i").text(_weather.fah) ;
        }
        else {
            
            $("#weather-details >p span:nth-child(1) i").text(_weather.cel) ;
        }
    }) ;
    
}) ;


/*loader start/stop animation*/
function animateLoader (status) {
    
    if (status === "start") {
        
        $("#loader-zone").css("display", "block") ;
        iJS.animate( $("#loader-zone >i")[0], "flip", 45 ) ;
    }
    else {
        
        $("#loader-zone").css("display", "none") ;
    }
}

function showWeatherDetails (status) {
    
    if (status === "visible") {

        $("#weather-details").css("visibility", "visible") ;
        iJS.animate( $("#weather-details")[0], "fade-in-up" ) ;
    }
    else {

        $("#weather-details").css("visibility", "hidden") ;
    }
}

var _weather = {} ;

function showWeatherLocation (place) {
    
    showWeatherDetails("hidden") ;
    
    if (iJS.isString( place )) {
        
        /* get the user's location weather infos */
        $.getJSON( "http://api.openweathermap.org/data/2.5/weather",
            {
                q: place ,
                units: "metric" ,
                appid: "b4ba2ba099fb66e6e49df3cfdad599df"
                //callback: "JSON_CALLBACK"
            }
        )
        .done( function (data) {

            if (iJS.isObject(data.main) && iJS.isSet(data.weather)) {

                _weather.temp = Math.round(data.main.temp);
                _weather.cel = Math.round(data.main.temp) +" °C";
                _weather.des = data.weather[0].main;
                _weather.wspeed = data.wind.speed +" m/s";
                _weather.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon +".png";
                _weather.sunrise = new Date( data.sys.sunrise*1000 ).getTime() ; //time 100 to get millisecond
                _weather.sunset = new Date( data.sys.sunset*1000 ).getTime() ; //time 100 to get millisecond
                _weather.fah = Math.round( ( _weather.temp * 9)/5 + 32 ) +" °F";

                $("#weather-details >h4 >img:first-of-type").attr("src", _weather.icon) ;
                
                $("#weather-details >p span:nth-child(1) i").text(_weather.cel) ;
                $("#weather-details >p span:nth-child(2) i").text(_weather.des) ;
                $("#weather-details >p span:nth-child(3) i").text(_weather.wspeed) ;
                $("#weather-details >p span:nth-child(4) i").text( new Date(_weather.sunrise).toLocaleTimeString()) ;
                $("#weather-details >p span:nth-child(5) i").text( new Date(_weather.sunset).toLocaleTimeString()) ;
                
                showWeatherDetails("visible") ;
                animateLoader("stop") ;
                iJS.animate( $(".i-block")[0], "pulse")
                
                //change backgound depending of weather's location conditions
                if (_weather.des.toLocaleLowerCase() == "rain") {
                    
                    $("body").css("background", "url(img/weather_onrain.jpg) no-repeat center fixed") ;
                }
                else if (_weather.des.toLocaleLowerCase() == "snow") {
                    
                    $("body").css("background", "url(img/weather_winter.jpg) no-repeat left fixed") ;
                }
                else if (_weather.des.toLocaleLowerCase() == "thunderstom") {
                    
                    $("body").css("background", "url(img/weather_thunderstom.jpg) no-repeat left fixed") ;
                }
                else { //if weather conditions are good or pretty, change backgound depending of current time (morning, night, ...)
                    
                    var currentTime = new Date().getTime() ;
                    //@Note 1 hour = 3600*1000 milliseconds
                    if ((_weather.sunrise - (3600*1000)) <= currentTime && currentTime <= (_weather.sunrise + (2*3600*1000))) {
                        
                        $("body").css("background", "url(img/weather_sunrise.jpg) no-repeat right fixed") ;
                    }
                    else if ((_weather.sunset - (3600*1000)) <= currentTime && currentTime <= (_weather.sunset + (3600*1000)) ) {
                        
                        $("body").css("background", "url(img/weather_sunset.jpg) no-repeat right fixed") ;
                    }
                    else if ((_weather.sunset + (3600*1000)) < currentTime && currentTime <= (_weather.sunset + (2*3600*1000))) {
                        
                        $("body").css("background", "url(img/weather_nightset.jpg) no-repeat left fixed") ;
                    }
                    else if ((_weather.sunset + (2*3600*1000)) < currentTime || currentTime < (_weather.sunrise - (3600*1000))) {
                        
                        $("body").css("background", "url(img/weather_star_night.jpg) no-repeat left fixed") ;
                    } 
                    else {
                        
                        $("body").css("background", "url(img/weather_clear_cloud.jpg) no-repeat left fixed") ;
                    }    
                }
                $("body").css("background-size", "cover") ;
            }
            else {

                showNotification( "(weather) Humm! Can't get weather from your location...", "error" ) ;
            }

            console.log( data ) ;
        })
        .fail( function () {

            showNotification( "(weather) Oops! Connexion error...", "error" ) ;
            animateLoader("stop") ;
        }) ;
    }
}


function showPictureFromLoacation (place) {
    
    if (iJS.isString( place )) {
        
        $("#weather-details >h4 >span").text( place ) ;
        
        /* get an random picture of user's location */
        $.getJSON( "https://api.flickr.com/services/rest/",
                  {
            method: "flickr.photos.search" ,
            api_key: "3699274559f630654bae279694f54314" ,
            tags: "city, people, street, rue, ville, " + place ,
            text: place ,
            accuracy: 3 ,
            content_type: 1 ,
            per_page: 70 ,
            format: "json" ,
            nojsoncallback: 1
        }
        )
        .done( function (data) {

            if (data.stat === "ok") {

                if (data.photos.total >= 1) {

                    var luckyPic = Math.floor(Math.random() * data.photos.photo.length) ;
                    var luckyPicInfo = data.photos.photo[ luckyPic ] ;
                    var luckyPicLink = "https://farm"+luckyPicInfo.farm+".staticflickr.com/"+luckyPicInfo.server+"/"+luckyPicInfo.id+"_"+luckyPicInfo.secret+"_c.jpg" ;

                    $(".i-block>figure").css("background", "url("+luckyPicLink+") no-repeat center fixed") ;
                    $(".i-block>figure").css("background-size", "cover") ;

                    $(".i-block>figure>figcaption").text( luckyPicInfo.title ) ;
                    
                    /*magnific-popup show lucky picture*/ 
                    $('.i-block>figure').magnificPopup({
                        items: [
                            {
                                src: luckyPicLink
                            }
                        ] ,
                        gallery: {
                            enabled: true
                        },
                        type: 'image' // this is default type
                    });
                    
                    /*disable parent event propagation to search button to avoid conflit*/ 
                    $(".i-block >figure >button").click(function(e) {
                        e.stopPropagation();
                    }); 
                    /*disable parent event propagation to search button to avoid conflit*/ 
                    $(".i-block >figure >figcaption").click(function(e) {
                        e.stopPropagation();
                    });
                } 
                else {

                    $(".i-block>figure>figcaption").html("<span style='color:red'>Humm! Can't get associated picture of your location...</span>") ;
                }
            }
            else {

                $(".i-block>figure>figcaption").html("<span style='color:red'>Oops! Flickr API connexion error...</span>") ;
            }
            
            iJS.animate( $(".i-block>figure")[0], "fade-in") ;

            console.log( data ) ;
        })
        .fail(function () {

            $(".i-block>figure>figcaption").html("<span style='color:red'>Oops! Connexion error...</span>") ;
        }) ;
    }
}