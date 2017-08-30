


function TableModel (w, h) {
    var _this = this;
    this.width = w || 1;
    this.height = h || 1;
    this.cells = new Array(this.height);
    for (var i = 0; i < this.height; i++) {
        this.cells[i] = new Array(this.width);
        for (var j = 0; j < this.width; j++) {
            this.cells[i][j] = new Cell(this);
        }
    }


};

TableModel.prototype =
    (function () {


	var colToIdx = function (s) {
            var res = 0;
            for (var i = 0; i < s.length; i++) {
                res *= 26;
                res += (s.charCodeAt(i) - 64);
            }
            return (res - 1);
        };

        var idxToCol = function (i) {
            var res = "";
            var n = i+1;
            var c = 0;
            while (n > 0) {
                c = n % 26;
                c = c == 0 ? 26 : c;
                res = String.fromCharCode(c + 64) + res;
                n = Math.trunc((n-c) / 26) ;
            };
            return res;

        };

	var rowToIdx = function (r) {
	    return r-1;
	};

        var idxToRow = function (i) {
            return (i+1).toString();
        }

	var newLine = function (len, model) {
	    var res = new Array(len);
            for (var i = 0; i < len; i++)
                res[i] = new Cell(model);
	};


	return {
        idxToCol,
        colToIdx: function (s) {
            var res = 0;
            for (var i = 0; i < s.length; i++) {
                res *= 26;
                res += (s.charCodeAt(i) - 64);
            }
            return (res - 1);
        },
	    getWidth : function () { return width; },
	    getHeight : function () { return height; },


            firstLine : function () { return this.height ? "1" : ""; },
            lastLine : function () { return this.height ? this.height.toString() : ""; },

            firstColumn : function () { return this.width ? "A" : ""; },
            lastColumn : function () { return idxToCol(this.width); },

	    getCell : function (c, r) {
		var j = rowToIdx(r);
		var i = colToIdx(c);

		if (j >= 0  && j < this.height && i >= 0 && i < this.width)
		    return this.getCellAtIdx(i, j);

		return undefined;
	    },


	    getCellAtIdx : function (i, j) {
		return this.cells[j][i];
	    },

	    insertLineAtIdx  : function (i) {
		this.cells.splice(i, 0, newLine(this.width, this.model));
		this.height++;
	    },

	    insertLineBefore : function (r) {
		var i = rowToIdx(r);
		if (i >= 0 && i < this.height)
		    this.insertLineAtIdx(i);
	    },

	    insertLineAfter  : function (r) {
		var i = rowToIdx(r);
		if (i >= 0 && i < this.height)
		    this.insertLineAtIdx(i+1);
	    },

            insertColumnAtIdx : function (i) {
		var model = this.model;
                this.cells.forEach(function (_, _, a) {
                    a.splice(i, 0, new Cell(model));
                });
            },
            insertColumnBefore : function (c) {
                var i = colToIdx(c);
                if (i >= 0 && i < this.width)
                    this.insertColumnAtIdx(i);
            },

            insertColumnAfter : function (c) {
                var i = colToIdx(c);
                if (i >= 0 && i < this.width)
                    this.insertColumnAtIdx(i+1);
            },

            forEachRow : function (f) {
                for(var i = 0; i < this.height; i++)
                    f(idxToRow(i));
            },

            forEachCol : function (f) {
                for(var i = 0; i < this.width; i++)
                    f(idxToCol(i));
            }

        }

}) ();
