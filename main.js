/// <reference path="jquery-3.6.0.js" />
"use strict";
async function getCoins() {
    try {
        localStorage.clear();
        let url = "https://api.coingecko.com/api/v3/coins/list";
        const coins = await getJSON(url);
        displayCoins(coins);
    }
    catch(err) {
        alert(err.status);
    }
}

function displayCoins(coins) {
    document.getElementById("child").innerHTML = '';
    document.getElementById("child").innerHTML = `<div class="spinner-border"></div>`
    setTimeout(() => {
        document.getElementById("child").innerHTML += `${coins.map(coinTemplate).join("")}`;
        $('.spinner-border').hide();
    },2000);
}

function coinTemplate(coin){
    return `
    <div id="${coin.symbol}" class="card">
        <div class="card-body">
            <div class="raw">
                <h5 class="card-title">${coin.symbol}</h5>
                <label class="switch">
                <input  id="toggle1${coin.symbol}" value=${coin.symbol} type="checkbox" unchecked data-toggle="toggle" data-size="xs" onclick="addtoReport(event)">
                <span class="slider round"></span>
                </label>
            </div>
            <p class="card-text">${coin.name}</p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" onclick="moreInfo('${coin.id}')" data-target="#collapse${coin.id}" aria-expanded="true" aria-controls="collapseExample">
            More Info
            </button>
            <p class="collapse" id="collapse${coin.id}">
            </p>
        </div>
    </div>`;
}

function moreInfo(coin_id){
    document.getElementById("collapse"+coin_id).innerHTML = `<div class="loading-price">
    <div class="spinner-border" role="status">
      <span class="visually-hidden"></span>
    </div>
    </div>
    `

    if(!sessionStorage.getItem(coin_id+"eur")){
        setTimeout(() => {
            $.ajax({
                url: "https://api.coingecko.com/api/v3/coins/" + coin_id,
                success: response => {
                    document.getElementById("collapse"+coin_id).innerHTML = `<div class="raw">
                    <div>
                    ${response.market_data.current_price.usd} $ <br>
                    ${response.market_data.current_price.eur} € <br>
                    ${response.market_data.current_price.ils} ₪
                    </div>
                    <img class="imgCoin" src="${response.image.large}">
                    </div>`

                    sessionStorage.setItem(coin_id+"usd", response.market_data.current_price.usd);
                    sessionStorage.setItem(coin_id+"eur", response.market_data.current_price.eur);
                    sessionStorage.setItem(coin_id+"ils", response.market_data.current_price.ils);
                    sessionStorage.setItem(coin_id+"img", response.image.small);

                    setTimeout(() => {
                        sessionStorage.removeItem(coin_id+"usd");
                        sessionStorage.removeItem(coin_id+"eur");
                        sessionStorage.removeItem(coin_id+"ils");
                        sessionStorage.removeItem(coin_id+"img");
                    },1000*120);
                }
            });
        }, 1000);
    }

    else {
        document.getElementById("collapse"+coin_id).innerHTML = `<div class="raw" ><div>${sessionStorage.getItem(coin_id+"usd")} $ <br>
                                                                ${sessionStorage.getItem(coin_id+"eur")} € <br>
                                                                ${sessionStorage.getItem(coin_id+"ils")} ₪
                                                                </div>
                                                                <img class="imgCoin" src="${sessionStorage.getItem(coin_id+"img")}"></div>`;
    }

}

function addtoReport(event){
    if (event.target.checked === false) {
        localStorage.removeItem(event.target.value);
    }

    else {
        addToLocalStorage(event.target.value);
    }
}

function addToLocalStorage(symbolCoin){
    if(localStorage.length < 5){
        localStorage.setItem(symbolCoin, symbolCoin);
    }
    else {
        $("#toggle1"+event.target.value).prop("checked",false)
        document.getElementById("modal").innerHTML = ` 
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>You have to remove coin from these, to add this one</p>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div class="modal-body">
                            <div>
                            ${getSelectedCoins(symbolCoin).join('\n')}
                            </div>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
      </div>`
      jQuery.noConflict(); 
      $("#exampleModalCenter").modal('show');
    }
}

function getSelectedCoins(symbolCoin){
    let i = 0,
    arrayCoins = [],
    sKey;
    for (; sKey = window.localStorage.key(i); i++) {
        arrayCoins[i] = window.localStorage.getItem(sKey);
    }

    let theseCheckBoxes = arrayCoins.map(function(element) {
        let coinSymbol = element;
        return `<div>
        <input type="checkbox" id="toggle2${coinSymbol}" name="cpg_services" value="${coinSymbol}" checked onclick="replaceCoin(event,'${symbolCoin}')" />
        <label for="${coinSymbol}">${element}</label>
        </div>`});

        return theseCheckBoxes;
}

function replaceCoin(event,symbolCoin){

    if (event.target.checked === false) {
        localStorage.removeItem(event.target.value);
        localStorage.setItem(symbolCoin,symbolCoin);
        $("#toggle1"+event.target.value).prop("checked",false);
        $("#toggle1"+symbolCoin).prop("checked",true);
    }

    else {
       localStorage.setItem(symbolCoin,symbolCoin); 
    }
}

function searchCoinByID(){
    let coinID = document.getElementById("search").value.toLowerCase();

    if(coinID){
        let cards = document.getElementsByClassName('card')

        for (let card of cards) {
            if (card.innerText.toLowerCase().includes(coinID)) {
                card.style.display = "inline-block";
            } 

            else {
                card.style.display = "none";
            }
        }
    }

    else{
        alert("Insert coin ID to search it!!");
    }
}

function aboutPage(){
    document.getElementById('child').innerHTML = 
    `<div class="about">
    <h1 class="header">About Page</h1>
    <img src="assets/personal_image.jpg">
    <h2 class="aboutText">Moataz Atawna</h2>
    <h4 class="aboutText">4th Year Software Engineering Student at sce</h4><br />
    <p class="aboutProject">The Cryptonite site displays virtual currencies and their cost in shekels, dollars and euros.</p>
    <p class="aboutProject">Soon on the site you will be able to see coins and their costs live in a graph</p>
    </div>
    `;
}

$(document).ready(function(){
    $('#Home').click(getCoins);
});
