var include = include || (function () {

    function include(urls, cont) {

	var i = 0;
	function loop () {

	    if (urls.length == i) {
		if (typeof cont == "function")
		    return cont();
		else return;
	    };

	    var script = document.createElement("script");
	    script.type = "text/javascript";

	    script.addEventListener("load", loop);
	    script.addEventListener("error", loop);
	    script.src = urls[i++];
	    document.head.appendChild(script);

	};
	loop ();

    }

    return include;
})();
