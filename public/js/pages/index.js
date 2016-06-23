index = function(){
     var _init = function (){
        mapa.start();
         $(".info-resultado-rota").hide();
    };
    var _novoPonto = function (valor){
        if(!valor) valor = "";
        $("#listaPontos").append("<div class='input-group form-group pontos-embarque-group'><input type='text' value='"+valor+"' class='form-control pontos-embarque'/><span class='input-group-btn'><button type='button' onclick='$(this).parent().parent().remove();' class='btn btn-default'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></span></div>");
    };
    var _listarPontos = function (){
        var lista =[];
        $.each($(".pontos-embarque"), function (index, item){
            if(item.value)
                lista.push({location: item.value});
        });
        return lista;
    };
    var _exibirListaCalculada = function (novaOrdem){
        var alfabeto = ["B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        var horariosViagem = $("#txtHorarioPartida").val();
        $.each(novaOrdem, function (index, item){

            horariosViagem = _somaHora(horariosViagem, _preCalculoMinutos(item.duration.value));
            if(novaOrdem.length-1 != index)
                $("tbody").append("<tr><th scope='row'>"+alfabeto[index]+"</th><td>"+horariosViagem+"</td><td>"+item.end_address+"</td></tr>");

        });
        $("#txtEnderecoPartida").parent().html("<b>(A)</b> ("+$("#txtHorarioPartida").val()+") " + $("#txtEnderecoPartida").val());
        $("#txtEnderecoChegada").parent().html("<b>("+alfabeto[novaOrdem.length-1]+")</b> ("+horariosViagem+") " + $("#txtEnderecoChegada").val());

        $(".info-gerar-rota").hide();
        $(".info-resultado-rota").show();
        $("#passo").html("<b>Rota Gerada!</b> Os endereços de embarque são re-organizados automaticamente para o melhor caminho a ser feito.");
        $("#passo").removeClass("alert-info").addClass("alert-success");

    };
    var _preCalculoMinutos = function (x){

        var minutes = Math.floor(Math.ceil(x / 60));

        if(minutes.toString().length == 1)
            minutes = "0"+minutes;

        return "00:"+minutes;

    };
    var _trocarEndereco = function (){
        var tempA = $("#txtEnderecoPartida").val();
        var tempB = $("#txtEnderecoChegada").val();
        $("#txtEnderecoPartida").val(tempB);
        $("#txtEnderecoChegada").val(tempA);

    };
    var _preencherDadosGeo = function (){

        $("#txtEnderecoPartida").val("São Paulo, SP");
        $("#txtEnderecoChegada").val("Rio de Janeiro, RJ");
        _novoPonto("Brasília, DF");
    };
    /**
    * Soma duas horas.
    * Exemplo:  12:35 + 07:20 = 19:55.
    */
    var _somaHora = function (horaInicio, horaSomada) {

        horaIni = horaInicio.split(':');
        horaSom = horaSomada.split(':');

        horasTotal = parseInt(horaIni[0], 10) + parseInt(horaSom[0], 10);
        minutosTotal = parseInt(horaIni[1], 10) + parseInt(horaSom[1], 10);

        if(minutosTotal >= 60){
            minutosTotal -= 60;
            horasTotal += 1;
        }

        horaFinal = _completaZeroEsquerda(horasTotal) + ":" + _completaZeroEsquerda(minutosTotal);
        return horaFinal;
    };
    /**
    * Completa um número menor que dez com um zero à esquerda.
    * Usado aqui para formatar as horas... Exemplo: 3:10 -> 03:10 , 10:5 -> 10:05
    */
    var _completaZeroEsquerda = function ( numero ){
        return ( numero < 10 ? "0" + numero : numero);
    };
	return {
        novoPonto: _novoPonto,
        listarPontos: _listarPontos,
        exibirListaCalculada: _exibirListaCalculada,
        preencherDadosGeo: _preencherDadosGeo,
        somaHora: _somaHora,
        trocarEndereco: _trocarEndereco,
        init: _init
	};
}();
