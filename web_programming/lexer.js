/* Constructeur pour les objets Lexer
   prend en argument un paramètre actions.
 */

var Lexer = function (actions) {

    var _this = this; //On mets dans une variable locale
                      //La valeur de this, pour pouvoir l'utiliser
                      //dans des sous-fonctions

    //Si actions n'est pas du type Array
    //On l'initialise au tableau vide.
    if (!Array.isArray(actions))
        actions = [];


    _this.actions = []; //On initialise la propriété actions
                        //de l'objet en cours de création au tableau vide


    //Pour chaque élément du tableau actions passé en paramètre :
    actions.forEach(function (v, i, a) {
	//v : valeur de l'élément courant
	//i : position courante dans le tableau
	//a : référence vers le tableau parcouru, i.e. actions
	// Attention, dans cette fonction, this est associé à
	// l'objet global, il faut donc utiliser _this.

        if (v.re
            && v.re instanceof RegExp
            && v.action && typeof v.action === "function") {
	    //Si l'élément courant est un objet qui
	    // - contient une propriété 're'
	    // - que cette propriété est une expression régulière
	    // - contient une propriété 'action'
	    // - que cette propriété est une fonction

            _this.actions.push({re : v.re, action: v.action});
	    //on ajoute un objet contenant uniquement { re: …, action: }
	    //à la propriété actions de l'objet créé
        }
    });

    var res = [];
    _this.actions.forEach(function (o, i, a) {
        res.push ("(" + o.re.source + ")");
    });

    _this.re = res.join("|");
    // on met dans la propriété 're' de l'objet créé une expression régulière
    // qui est l'union de toutes les expressions passées.
};

Lexer.prototype.scan = function (input) {

    //Si l'argument n'est pas une chaîne, on a fini
    if (!(typeof input == "string" || input instanceof String))
        return [];

    //Sinon on crée une nouvelle expression régulière, basée sur l'expression
    // this.re avec le flag 'g' (trouver tous les matches)
    var re = new RegExp(this.re, "g");
    var match = null;
    var result = [];
    var i = 0;
    while (match = re.exec(input)) {
	//tant que l'on trouve une sous-chaîne qui matche

	//On cherche le groupe de parenthèses auxquelle l'expression
	//Matchée correspond
        for(i = 1; i < match.length; i++)
            if (typeof match[i] != "undefined")
                break;
        var str = match[i];
        i = i - 1;
	//On récupère l'action correspondant à cette sous-expression.
        var obj = this.actions[i];
	//On appelle cette action avec en paramètre, la sous-chaîne matchée
	//Ainsi que ses positions de début et de fin.
	//On place le résultat de l'action dans le tableau de résultat.
        result.push(obj.action(str, re.index, re.index + str.length - 1));
    }
    return result;
}
