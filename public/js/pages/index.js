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
    var _exibirListaCalculada = function (novaOrdem){
        var novaOrdemEndereco = [];
        $.each(novaOrdem, function (index, item){
            console.log(item);
            var enderecos = $(".pontos-embarque");
            var endereco = enderecos[index];
            novaOrdemEndereco.push({ordem: item, endereco: endereco.value });
        });
        for(i = 0; i <= novaOrdemEndereco.length; i++){
            if(novaOrdemEndereco.length == i) break;
            end = novaOrdemEndereco.filter(function (item){return item.ordem == i});
            $("tbody").append("<tr><th scope='row'>"+end[0].ordem+"</th><td>"+end[0].endereco+"</td></tr>")                                 
        }
        //$(".info-gerar-rota").hide();
        //$(".info-resultado-rota").show();
        
    }
	return {
		api_user_login: _api_user_login,
        novoPonto: _novoPonto,
        listarPontos: _listarPontos,
        exibirListaCalculada: _exibirListaCalculada,
        init: _init
	}
}();