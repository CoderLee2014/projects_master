/* Représentation des formules */

/** Class commune aux autres types de formules */
var Formula = function () {

    this.children = []; // Fils du nœud courant
    this.priority = 0;  // Priorité du nœud courant
    this.arity = 0;     // Arité du nœud courant
}

// Convertit les arguments en chaînes de caractères
Formula.prototype.childrenToString = function () {
    var _this = this;

    //Fonction auxiliaire qui convertit la formule
    //form en chaîne de caractère et rajoute des
    //parenthèses si sa priorité est plus petite que p
    function protect(form, p) {
	var s = form.toString();
	if (p > form.priority)
	    s = "(" + s + ")";
	return s;

    };

    return this.children.map(function (c, i, a) {
	if (c)
	    return protect(c, _this.priority);
	else
	    return "";
    });
}



//Évalue tous les enfants de la formule courante
//et renvoie un tableau de leur valeurs

Formula.prototype.evalChildren = function () {
    return this.children.map(function(c, i, a) {
	return c.eval();
    });
};

Formula.prototype.getCellRefs = function () {
    var s = new Set ();
    this.children.forEach(function (c, i, t) {

	var sc = c.getCellRefs();
	sc.forEach(function (k, v, _) {
	    s.add(v);
	});
    });
    return s;
}

//////////////////////////////////
/** Class Const */

var Const = function (n) {
    Formula.call(this);    //appel du constructeur parent
    this.priority = 10;    //plus haute priorité
    this.value = n || 0;   //valeur directement égale
                           //au nombre passé en paramètre
};

Const.prototype = Object.create(Formula.prototype);

Const.prototype.toString = function () {
    return this.value.toString();
};

Const.prototype.eval = function () {
    return this.value;
};


//////////////////////////////////
/** Class Str */

// Question 1.1

var Str = function (s) {
    Formula.call(this);
    this.priority = 10;
    this.value = s ||"";
};

Str.prototype = Object.create(Formula.prototype);

Str.prototype.toString = function () {
    return '"' + this.value + '"';
};

Str.prototype.eval = function () {
    return this.value;
};


//////////////////////////////////
/** Classe Add (addition) */
var Add = function () {
    Formula.call(this);
    this.priority = 3;
    this.arity = 2;
};

Add.prototype = Object.create(Formula.prototype);

Add.prototype.toString = function () {
    var schildren = this.childrenToString();
    return schildren[0] + " + " + schildren[1];
};

// Question 1.2

Add.prototype.eval = function () {
    var vchildren = this.evalChildren();
    return (+vchildren[0]) + (+vchildren[1]);
};

//////////////////////////////////
var Sub = function () {
    Formula.call(this);
    this.priority = 3;
    this.arity = 2;
};

Sub.prototype = Object.create(Formula.prototype);

Sub.prototype.toString = function () {
    var schildren = this.childrenToString();
    return schildren[0] + " - " + schildren[1];
};

Sub.prototype.eval = function () {
    var vchildren = this.evalChildren();
    return vchildren[0] - vchildren[1];
};

//////////////////////////////////
var Mul = function () {
    Formula.call(this);
    this.priority = 4;
    this.arity = 2;
};

Mul.prototype = Object.create(Formula.prototype);

Mul.prototype.toString = function () {
    var schildren = this.childrenToString();
    return schildren[0] + " * " + schildren[1];
};

Mul.prototype.eval = function () {
    var vchildren = this.evalChildren();
    return vchildren[0] * vchildren[1];
};

//////////////////////////////////
var Div = function () {
    Formula.call(this);
    this.priority = 4;
    this.arity = 2;
};

Div.prototype = Object.create(Formula.prototype);

Div.prototype.toString = function () {
    var schildren = this.childrenToString();
    return schildren[0] + " / " + schildren[1];
};

Div.prototype.eval = function () {
    var vchildren = this.evalChildren();
    return vchildren[0] / vchildren[1];
};


////////////////////////////////////
//Références vers une cellule
//Question 2.2
var CellRef = function (col, row, model) {
    Formula.call(this);
    this.priority = 10; // comme une constante
    this.arity = 0;
    this.row = row;
    this.col = col;
    this.model = model;
}

CellRef.prototype = Object.create(Formula.prototype);
CellRef.prototype.toString = function () {
    return (this.col + this.row);
};

CellRef.prototype.eval = function () {
    var cell = this.model.getCell(this.col, this.row);
    if (cell instanceof Cell)
	return (+(cell.getValue()))
    else
	return NaN;
};

CellRef.prototype.getCellRefs = function () {
    var s = new Set ();
    s.add(this.col + ',' + this.row);
    return s;
}

////////////////////////////////////////////
//La fonction de AVERAGE
//
var Average = function(model){
    Formula.call(this);
    this.priority = 10;
    this.arity = 2;
    this.model = model;
};

Average.prototype = Object.create(Formula.prototype);

Average.prototype.toString = function(){
    return "AVERAGE( " + this.children[0].toString() + ", "+ this.children[1].toString() + " )";
};
//calculer la valeur de cette fonction 
Average.prototype.eval = function () {
    //retourner les deux paramètres
    var cell1 = this.children[0];
    var cell2 = this.children[1];
    var row_min = (cell1.row > cell2.row)?cell2.row:cell1.row;
    var row_max = (cell1.row < cell2.row)?cell2.row:cell1.row;
    var f = this.model.colToIdx;
    var col_min = (f(cell1.col) > f(cell2.col))?f(cell2.col):f(cell1.col);
    var col_max = (f(cell1.col) < f(cell2.col))?f(cell2.col):f(cell1.col);
    var sum = 0;
    var count = 0;
    for(var i = row_min; i <= row_max; i++ ){
        for(var j = col_min; j <= col_max; j++){
            var cell = new CellRef(this.model.idxToCol(j),i, this.model);
            sum += cell.eval();
            count += 1;
        }
    }
    return sum/count;
};

////////////////////////////////////////////
//La fonction de COUNT
//
var Count = function(model){
    Formula.call(this);
    this.priority = 10;
    this.arity = 2;
    this.model = model;
};

Count.prototype = Object.create(Formula.prototype);

Count.prototype.toString = function(){
    return "COUNT( " + this.children[0].toString() + ", "+ this.children[1].toString() + " )";
};
//calculer la valeur de cette fonction 
Count.prototype.eval = function () {
    //retourner les deux paramètres
    var cell1 = this.children[0];
    var cell2 = this.children[1];
    var row_min = (cell1.row > cell2.row)?cell2.row:cell1.row;
    var row_max = (cell1.row < cell2.row)?cell2.row:cell1.row;
    var f = this.model.colToIdx;
    var col_min = (f(cell1.col) > f(cell2.col))?f(cell2.col):f(cell1.col);
    var col_max = (f(cell1.col) < f(cell2.col))?f(cell2.col):f(cell1.col);
    var count = 0;
    for(var i = row_min; i <= row_max; i++ ){
        for(var j = col_min; j <= col_max; j++){
            var cell = new CellRef(this.model.idxToCol(j),i, this.model);
            if(cell.eval()!="")
                count += 1;
        }
    }
    return count;
};

////////////////////////////////////////////
//La fonction de SUM
//
var Sum = function(model){
    Formula.call(this);
    this.const = false;
    this.priority = 10;
    this.arity = 2;
    this.model = model;
};

Sum.prototype = Object.create(Formula.prototype);

Sum.prototype.toString = function(){
    if(this.const == true)
        return "SUM( " + this.children[0].toString() + ", "+ this.children[1].toString() + " )";
    else
        return "SUM( " + this.children[0].toString() + ":"+ this.children[1].toString() + " )";
};
//calculer la valeur de cette fonction 
Sum.prototype.eval = function () {
    //retourner les deux paramètres
    var cell1 = this.children[0];
    var cell2 = this.children[1];
    if(cell1 instanceof Const || cell2 instanceof Const){
        this.const = true;
        return cell1.eval() + cell2.eval();
    }
    var row_min = (cell1.row > cell2.row)?cell2.row:cell1.row;
    var row_max = (cell1.row < cell2.row)?cell2.row:cell1.row;
    var f = this.model.colToIdx;
    var col_min = (f(cell1.col) > f(cell2.col))?f(cell2.col):f(cell1.col);
    var col_max = (f(cell1.col) < f(cell2.col))?f(cell2.col):f(cell1.col);
    var sum = 0;
    for(var i = row_min; i <= row_max; i++ ){
        for(var j = col_min; j <= col_max; j++){
            var cell = new CellRef(this.model.idxToCol(j),i, this.model);
            sum += cell.eval();
        }
    }
    return sum;
};

////////////////////////////////////////////
//La fonction de STDDEV
//
var Stddev = function(model){
    Formula.call(this);
    this.priority = 10;
    this.arity = 2;
    this.model = model;
};

Stddev.prototype = Object.create(Formula.prototype);

Stddev.prototype.toString = function(){
    return "STDDEV( " + this.children[0].toString() + ", "+ this.children[1].toString() + " )";
};
//calculer la valeur de cette fonction 
Stddev.prototype.eval = function () {
    //retourner les deux paramètres
    var cell1 = this.children[0];
    var cell2 = this.children[1];
    var row_min = (cell1.row > cell2.row)?cell2.row:cell1.row;
    var row_max = (cell1.row < cell2.row)?cell2.row:cell1.row;
    var f = this.model.colToIdx;
    var col_min = (f(cell1.col) > f(cell2.col))?f(cell2.col):f(cell1.col);
    var col_max = (f(cell1.col) < f(cell2.col))?f(cell2.col):f(cell1.col);
    var sum = 0;
    var count = 0;
    for(var i = row_min; i <= row_max; i++ ){
        for(var j = col_min; j <= col_max; j++){
            var cell = new CellRef(this.model.idxToCol(j),i, this.model);
            sum += cell.eval();
            count += 1;
        }
    }
    var average = sum/count;        

    var dev = 0;
    for(var i = row_min; i <= row_max; i++ ){
        for(var j = col_min; j <= col_max; j++){
            var cell = new CellRef(this.model.idxToCol(j),i, this.model);
            dev += (cell.eval()-average)*(cell.eval()-average);
        }
    }
    return Math.sqrt(dev)/count;
};


//Méthode « statique », directement attachée à l'objet Formula, pas
//individuellement à chaque formule.

//Méthode « statique », directement attachée à l'objet Formula, pas
//individuellement à chaque formule.

Formula.parse = function (input, model) {

    //tableau d'action pour le lexer
    var actions = [
        { re : /[+]/, action : function (s, i, j) { return new Add(); }},
        { re : /-/, action : function (s, i, j) { return new Sub(); }},
        { re : /[*]/, action : function (s, i, j) { return new Mul(); }},
        { re : /\//, action : function (s, i, j) { return new Div(); }},
        { re : /[()]/, action : function (s, i, j) { return s; } },
        { re : /[-+]?[0-9]+(?:[.][0-9]*(?:[eE](?:[-+]?)[0-9]+)?)?/ ,
          action : function (s, i, j) { return new Const(+(s)); } },
	//Question 1.3
	{ re : /"(?:[^"]|\\")*"/,
	  action : function (s, i, j) { return new Str(s.substring(1,s.length - 1)) }},
	{ re : /[A-Z]+[1-9][0-9]*/,
	  action : function (s, i, j) {
	      var coords = s.match(/([A-Z]+)([1-9][0-9]*)/);
	      return new CellRef(coords[1], coords[2], model);
	  }},
        /*Identifier la fonction de AVERAGE*/
        {re:/AVERAGE/,
         action: function(s,i,j){
             return new Average(model);
         }
        },
        {re:/COUNT/,
         action: function(s,i,j){
             return new Count(model);
         }
        },
        {re:/SUM/,
         action: function(s,i,j){
             return new Sum(model);
         }
        },
        {re:/STDDEV/,
         action: function(s,i,j){
             return new Stddev(model);
         }
        },
        {re:/[:]/, action: function(s, i, j){ return s;}},
        {re:/[,]/, action: function(s, i, j){ return s;}}
    ];

    //Création d'un nouveau lexer
    var lexer = new Lexer(actions);
    //Obtention d'un tableau de jetons.
    //Un jeton est soit un objet dont le type est une sous-classe de Formula
    //soit la chaîne "(", soit la chaîne ")"

    var tokens = lexer.scan(input);


    //La sortie et la pile, comme dans l'algorithme de Dijkstra
    var output = [];
    var stack = [];

    //Monkey patching : on ajoute une méthode peek sur l'objet stack qui permet
    //de récupérer le sommet sans le dépiler
    stack.peek = function () {
	return this[this.length - 1];
    }

    //Monkey patching : on ajoute une méthode reduce sur l'objet output. Lorsque
    //L'on ajoute un opérateur dans la sortie, alors la méthode reduce dépile
    //automatiquement les n formules en sommet de pile et le place comme fils
    //du nœud ajouté.
    //Lève une exception si la pile ne dispose pas d'assez de valeurs.

    output.reduce = function (op) {
        var args = [];
        for (var i = 0; i < op.arity; i++) {
            if (this.length === 0) {
            throw "Syntax error, not enough arguments";
            } else {
            args.push(this.pop());
            }
        }
        op.children = args.reverse ();
        this.push(op);
    };

    //Algorithme de Dijkstra, Phase I

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token instanceof Const || token instanceof Str || token instanceof CellRef ) {
            output.push(token);
        } else if (token instanceof Formula) {
            //operator
            var op;
            while (stack.length) {
                op = stack.peek();

                if (token.priority <= op.priority) {
                    stack.pop();
                    output.reduce(op);
                } else { break; }
            }
            stack.push(token);
        }else if(token === ","){
            continue;
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while(stack.length > 0 && stack.peek() !== "(") {
            output.reduce(stack.pop());
            };
            if (stack.peek() === "(")
            stack.pop();
            else
            throw "Mismatched parenthesis";
            
        }
    }
    // Phase II
    while(stack.length > 0) {
	if (stack.peek() instanceof Formula)
	    output.reduce(stack.pop());
	else
	    throw "Mismatched parenthesis";
    };
    if (output.length !== 1)
	throw "Syntax error, missing operatorFDF";
    else
	return output[0];
};
