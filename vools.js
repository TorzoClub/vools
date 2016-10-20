	(function (){
		const ObjecExtends = function (source, add) {
			Object.keys(add).forEach(addProperty => {
				source[addProperty] = add[addProperty];
			});
		};
		const selector = function (sel, ele) {
			ele = ele || document;
			return Array.prototype.slice.call(ele.querySelectorAll(sel));
		};

		const DOMMethod = {
			html(value){
				if (typeof(value) === 'string') {
					this.forEach(ele => {
						ele.innerHTML = value;
					})
				} else {
					return this.map(ele => {
						return ele.innerHTML;
					});
				}
			}
		};
		const DOMs = function (sel, ele) {
			ObjecExtends(this, DOMMethod);
		};
		DOMs.prototype = Array.prototype;

		const vools = function (sel, ele) {
			const doms = new DOMs;
			const domArr = selector(sel, ele);
			domArr.forEach(element => doms.push(element));

			return doms;
		};

		vools.rjax = (() => {
			var stringifyRequest = (function (){
				const backValueKey = (key, value) => `${key}=` + encodeURIComponent(value);
				const stringifyArray = (key, arr) => arr.length ? arr.map(item => backValueKey(key, item)).join('&') : backValueKey(key, '');
				const fetcher = (data, key) => Array.isArray(data[key]) ? stringifyArray(key, data[key]) : backValueKey(key, data[key]);
				return data => Object.keys(data).map(key => fetcher(data, key)).join('&');
			})();
			return (url, args) => {
				var xhr = new XMLHttpRequest;

				xhr.onloadend = () => {
					args.success && args.success(xhr.responseText, xhr.status, xhr);
				};
				if (args.method === undefined) {
					throw new Error('请求方法未指定');
				}

				xhr.open(args.method.toUpperCase(), url, true);
				if (args.data !== undefined) {
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
					if (typeof args.data === 'object') {
						let formated = stringifyRequest(args.data);
						xhr.send(formated);
					} else {
						xhr.send(args.data);
					}
				} else {
					xhr.send();
				}
			};
		})();

		window.vools = vools;
	})(	);
