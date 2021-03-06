mapa = function(){
	var _start = function(){
		google.maps.event.addDomListener(window, 'load', _initialize());

		google.maps.event.addListener(marker, 'drag', function () {
		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					//$('#txtEndereco').val(results[0].formatted_address);
					//$('#txtLatitude').val(marker.getPosition().lat());
					//$('#txtLongitude').val(marker.getPosition().lng());
				}
			}
		});
	});
};

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

		var dcooc = '';

	var _initialize = function (){

		var latlng = new google.maps.LatLng(-23.19586486253487, -45.89185186132812);
		var options = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map"), options);

        directionsDisplay.setMap(map);

        directionsDisplay.setPanel(document.getElementById("trajeto-texto"));

		geocoder = new google.maps.Geocoder();
		marker = new google.maps.Marker({
			map: map,
			draggable: true,
			visible: false
		});
		marker.setPosition(latlng);

	};
    var _calcularRota = function () {

        var enderecoPartida = $("#txtEnderecoPartida").val();
        var enderecoChegada = $("#txtEnderecoChegada").val();


      directionsService.route({
        origin: enderecoPartida,
        destination: enderecoChegada,
        waypoints: index.listarPontos(),
        optimizeWaypoints: true,
        region: 'São José dos Campos, SP - Brasil',
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            index.exibirListaCalculada(response.routes[0].legs);
        } else {
          //window.alert('Directions request failed due to ' + status);
            window.alert('Algum endereço não pode ser localizado pelo Google, verifique os endereços!');
        }
      });
    };
	var _carregarNoMapa = function (endereco) {
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();
                    var enderecoFormatado = results[0].formatted_address;

                    $("#enderecoAtendimentoGoogle").val(enderecoFormatado);

                    $("#mapaLegenda").html("Posição geográfica da emergência, latitude: ".concat(latitude," e longitude: ",longitude,"."));

					var location = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(location);
					marker.setVisible(true);
					map.setCenter(location);
					map.setZoom(16);

                    var infowindow = new google.maps.InfoWindow({
                        content: "<b>Local da emergência</b><br/>".concat(enderecoFormatado),
                        maxWidth: 250
                    });

                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });

				}
			}
		});
	};
	return {
		start: _start,
		initialize: _initialize,
		carregarNoMapa: _carregarNoMapa,
        calcularRota:_calcularRota
	};
}();
