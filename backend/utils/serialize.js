//encode a js obj into a querystring https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object/1714899#1714899
export const serialize = (obj) => {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}
	return str.join("&");
};