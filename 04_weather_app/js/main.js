/* by [tnga](https://github.com/tnga) - 2016
 *
 * It use HTML5 geolocalisation API,
 * if it isn't supported or unable to be used (access denied by user, timeout, ...)
 * then it use IP address localisation API (like ipinfo.io).
 * User can manually search for a location.
 * Results are organised according to Weather API returning data.
*/

$(document).ready( function () {
    
    showWeatherDetails("hidden") ;
    animateLoader("start") ;
    iJS.animate( $(".i-block>figure>button")[0], "wobble", 13) ;
    showNotification("<b>note:</b> for any other location, use search button.") ;
    
    if (navigator.geolocation) {
        
        var timeoutVal = 45 * 1000 ; //45s
        var ageVal = 600 * 1000 ;    //10min = 600s
        
        navigator.geolocation.getCurrentPosition(
            function (position) { //success
                
                showWeatherLocation( position.coords ) ;
                console.log( position ) ;
            }, 
            function (error) {
                
                showNotification("<b>Oops!</b> If you have wrong location, use search button.", "warring") ;
                console.warn( error ) ;
                
                getLocationFromIP() ;
            },
            { timeout: timeoutVal, maximumAge: ageVal, /*enableHighAccuracy: true*/ }
        );
    }
    else {
        
        showNotification("<b>Oops!</b> Think to update your browser, use search button to find a location.", "warring");
        console.warn("Geolocation is not supported by this browser");
        
        getLocationFromIP() ;
    }
    
    
    $("input[name='search-weather']").on("change", function () {
        
        animateLoader("start") ;
        
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
var _location = {} ;

/* get the user's location from his ip address*/
//use globale variable `_location`
function getLocationFromIP () {
    
    $.getJSON( "http://ipinfo.io/json")
        .done( function (loc) {

            _location = loc ;
            //ipinfo just provide de country iso code name, so will try to get native country name
            _location.countryName = _location.country ;

            showWeatherLocation( _location.city + ", "+ _location.country ) ;

            console.log( loc ) ;

        })
        .fail( function () {

            showNotification( "(ipinfo) Oops! Connexion error...", "error" ) ;
            animateLoader("stop") ;
            iJS.animate( $(".i-block")[0], "shake") ;
        }) ;
} 

/*get weather informations and show some of them in target view page*/
//use globales variables `_location`, `_weather`
function showWeatherLocation (place) {
    
    showWeatherDetails("hidden") ;
    
    if (iJS.isString( place ) || iJS.isObject( place )) {
        
        var searchParams = {} ;
        searchParams.units = "metric" ;
        searchParams.appid = "b4ba2ba099fb66e6e49df3cfdad599df" ;
        if (iJS.isString( place )) searchParams.q = place ;
        if (place.longitude) searchParams.lon = place.longitude ;
        if (place.latitude) searchParams.lat = place.latitude ;
        /* get the user's location weather infos */
        $.getJSON( "http://api.openweathermap.org/data/2.5/weather", searchParams)
        .done( function (data) {

            if (iJS.isObject(data.main) && iJS.isSet(data.weather)) {

                _weather.temp = Math.round(data.main.temp);
                _weather.cel = Math.round(data.main.temp) +" °C";
                _weather.des = data.weather[0].description;
                _weather.cond = data.weather[0].main;
                _weather.wspeed = data.wind.speed +" m/s";
                _weather.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon +".png";
                _weather.sunrise = new Date( data.sys.sunrise*1000 ).getTime() ; //time 100 to get millisecond
                _weather.sunset = new Date( data.sys.sunset*1000 ).getTime() ; //time 100 to get millisecond
                _weather.fah = Math.round( ( _weather.temp * 9)/5 + 32 ) +" °F";
                
                _location.city = data.name ;
                _location.country = data.sys.country ;

                getCountryInfos( _location.country ) ;
                
                $("#weather-details >h4 >img:first-of-type").attr("src", _weather.icon) ;
                
                $("#weather-details >p span:nth-child(1) i").text(_weather.cel) ;
                $("#weather-details >p span:nth-child(2) i").text(_weather.des) ;
                $("#weather-details >p span:nth-child(3) i").text(_weather.wspeed) ;
                $("#weather-details >p span:nth-child(4) i").text( new Date(_weather.sunrise).toLocaleTimeString()) ;
                $("#weather-details >p span:nth-child(5) i").text( new Date(_weather.sunset).toLocaleTimeString()) ;
                
                showWeatherDetails("visible") ;
                iJS.animate( $(".i-block")[0], "pulse") ;
                
                //change backgound depending of weather's location conditions
                if (_weather.cond.toLocaleLowerCase() == "rain") {
                    
                    $("body").css("background", "url(img/weather_onrain.jpg) no-repeat center fixed") ;
                }
                else if (_weather.cond.toLocaleLowerCase() == "snow") {
                    
                    $("body").css("background", "url(img/weather_winter.jpg) no-repeat left fixed") ;
                }
                else if (_weather.cond.toLocaleLowerCase() == "thunderstorm") {
                    
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

//use globale variable `_location`
function getCountryInfos (country) {
    
    if (iJS.isString( country )) {
        
        //try to get common country name. this is usefull to have better result from Flickr API
        $.getJSON( "https://restcountries.eu/rest/v1/name/"+country)
            .done( function (data) {

            //set default value for precaution
            _location.countryName =  _location.country ;
            _location.demonym =  "" ;
            console.log( data ) ;
            
            if (iJS.isArray( data )) {
                
                for (var i=0; i<data.length; i++) {
                  
                    if (data[i].alpha2Code.toLowerCase() === _location.country.toLowerCase()) {
                        _location.countryName = data[i].name ;
                        _location.demonym =  data[i].demonym ;
                        break ;
                    }
                }
            }

            $("#weather-details >h4 >span").text( _location.city + ", "+ _location.countryName ) ;
            
            showPictureFromLoacation() ;
        })
            .fail( function () {

            showNotification( "(country.io) Oops! Connexion error...", "error" ) ;
            
            $("#weather-details >h4 >span").text( _location.city + ", "+ _location.countryName ) ;
            
            _location.demonym = "" ;
            showPictureFromLoacation() ;
        }) ;
    }
}

/* get an random picture of user's location */
//use globales variables (_location, ...) 
function showPictureFromLoacation () {

    $.getJSON( "https://api.flickr.com/services/rest/",
        {
            method: "flickr.photos.search" ,
            api_key: "3699274559f630654bae279694f54314" ,
            tags: "city, people, street, rue, ville, " + _location.city + ", "+ _location.countryName + ", "+ _location.demonym ,
            text: _location.city + ", "+ _location.countryName ,
            accuracy: 3 ,
            content_type: 1 ,
            per_page: 100 ,
            format: "json" ,
            nojsoncallback: 1
        })
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
                    $(".i-block >figure >.i-btn").click(function(e) {
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

            animateLoader("stop") ;
            iJS.animate( $(".i-block>figure")[0], "fade-in") ;
            
            console.log( data ) ;
        })
        .fail(function () {

            animateLoader("stop") ;
            $(".i-block>figure>figcaption").html("<span style='color:red'>Oops! Connexion error...</span>") ;
        }) ;
}
