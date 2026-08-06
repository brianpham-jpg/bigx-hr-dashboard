/* init */
nav('overview');
(function(){function fix(){var c=document.getElementById('content');if(c&&c.querySelector('.loading')){try{if(typeof nav==='function')nav('ho-so');}catch(e){}}}setTimeout(fix,2800);setTimeout(fix,6000);})();setInterval(loadData, 5 * 60 * 1000); // auto-refresh mỗi 5 phút
