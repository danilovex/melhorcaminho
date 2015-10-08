index = function(){
     var _init = function (){
        mapa.start();
    }
	var _api_user_login = function (){
			
		var requestData = JSON.stringify($('#formLogin').serializeObject());
		
		$.ajax({
			url: '/api/login',
			type: 'POST',
			async: false,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: requestData
		}).done(function(data, textStatus, jqXHR) {
			//$.sessionStorage.setItem('userToken', data.token);
			window.location.href = '/atendimento';
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert(textStatus);
		});
		
		return false;
	}
    var _novoPonto = function (){
        $('<input>').attr({
            type: 'text',
            class: 'form-control pontos-embarque'
        }).appendTo('#listaPontos');
    }
    var _listarPontos = function (){
        var lista =[];
        $.each($(".pontos-embarque"), function (index, item){
            lista.push({location: item.value});
        });
        return lista;
    }    
	return {
		api_user_login: _api_user_login,
        novoPonto: _novoPonto,
        listarPontos: _listarPontos,
        init: _init
	}
}();