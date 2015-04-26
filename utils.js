module.exports = {
	zfill: function(number) {
		if (number.toString().length < 2) {
			return '0' + number;
		} else {
			return number;
		}
	}
};