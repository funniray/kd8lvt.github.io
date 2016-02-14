function HTMLActuator() {
	this.tileContainer    = document.getElementsByClassName("tile-container")[0];
	this.scoreContainer   = document.getElementsByClassName("score-container")[0];

	this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.tileContainer = self.clearContainer(self.tileContainer);

		grid.cells.forEach(function (column) {
			column.forEach(function (cell) {
				if (cell) {
					self.addTile(cell);
				}
			});
		});

		self.updateScore(metadata.score);

	});
};

HTMLActuator.prototype.restart = function () {
	this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
	
	var newContainer = container.cloneNode(false);
	container.parentNode.replaceChild(newContainer,container);
	return newContainer;

};

HTMLActuator.prototype.addTile = function (tile) {
	if( !document.getElementById('animation_on').checked )
		return;

	var self = this;

	var element   = document.createElement("div");
	var position  = tile.previousPosition || { x: tile.x, y: tile.y };
	positionClass = this.positionClass(position);

	// We can't use classlist because it somehow glitches when replacing classes
	var classes = ["tile", "tile-" + tile.value, positionClass];
	this.applyClasses(element, classes);

	element.textContent = tile.value;
	if (tile.previousPosition) {
		// Make sure that the tile gets rendered in the previous position first
		window.requestAnimationFrame(function () {
			classes[2] = self.positionClass({ x: tile.x, y: tile.y });
			self.applyClasses(element, classes); // Update the position
		});
	} else if (tile.mergedFrom) {
		classes.push("tile-merged");
		this.applyClasses(element, classes);

		// Render the tiles that merged
		tile.mergedFrom.forEach(function (merged) {
			self.addTile(merged);
		});
	} else {
		classes.push("tile-new");
		this.applyClasses(element, classes);
	}

	// Put the tile on the board
	this.tileContainer.appendChild(element);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
	return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
	this.scoreContainer = this.clearContainer(this.scoreContainer);

	this.score = score;

	this.maxScore = this.maxScore || score;

	if( this.score > this.maxScore )
		this.maxScore = this.score;

	this.scoreContainer.textContent = this.score.toFixed(2) + ' - ' + this.maxScore.toFixed(2);

};

HTMLActuator.prototype.message = function (won) {

};

HTMLActuator.prototype.clearMessage = function () {

};

HTMLActuator.prototype.scoreTweetButton = function () {

};


HTMLActuator.prototype.showHint = function(hint) {
	document.getElementById('feedback-container').innerHTML = ['↑','→','↓','←'][hint];
}

HTMLActuator.prototype.setRunButton = function(message) {
	document.getElementById('run-button').innerHTML = message;
}
