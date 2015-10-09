index = function(){
     var _init = function (){
        mapa.start();
         $(".info-resultado-rota").hide();
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
    var _novoPonto = function (valor){
        if(!valor) valor = "";
        $("#listaPontos").append("<div class='input-group form-group pontos-embarque-group'><input type='text' value='"+valor+"' class='form-control pontos-embarque'/><span class='input-group-btn'><button type='button' onclick='$(this).parent().parent().remove();' class='btn btn-default'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></span></div>");        
    }
    var _listarPontos = function (){
        var lista =[];
        $.each($(".pontos-embarque"), function (index, item){
            if(item.value)
                lista.push({location: item.value});
        });
        return lista;
    }
    var _exibirListaCalculada = function (novaOrdem){
        $.each(novaOrdem, function (index, item){
            $("tbody").append("<tr><th scope='row'>"+index+"</th><td>"+item.end_address+"</td></tr>");                                
        });
        $(".info-gerar-rota").hide();
        $(".info-resultado-rota").show();
        
    }
    var _preencherDadosGeo = function (){
        
        $("#txtEnderecoPartida").val("R. Cruzeiro, 213 - Bosque dos Eucaliptos");
        $("#txtEnderecoChegada").val("Av. Shishima Hifumi, 2.911 Urbanova");
        _novoPonto("Rua Machado de Assis, 558 – Monte Castelo");
        _novoPonto("Rua Manoel Fiel Filho, 254 – Bosque dos Eucaliptos");
        _novoPonto("Rua Carlos Carnevalli, 33 – Jardim Satelite");
        _novoPonto("Rua Castor, 25 - Jardim Satélite");
        _novoPonto("Rua Ilha do Sul, 299 - Jardim America, 12235-490");
        _novoPonto("Avenida Heitor vila Lobos, 555 – Vila Ema");
        _novoPonto("Avenida Doutor Mario Galvão, 252 – Jardim Bela Vista");
        _novoPonto("Rua Professor Jacir Madureira, 121 - Santana");
    }
	return {
		api_user_login: _api_user_login,
        novoPonto: _novoPonto,
        listarPontos: _listarPontos,
        exibirListaCalculada: _exibirListaCalculada,
        preencherDadosGeo: _preencherDadosGeo,
        init: _init
	}
}();