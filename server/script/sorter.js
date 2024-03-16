'use strict';

export default class extends null
{
	static #$ = globalThis.Number;
	static #table = [[this.#$.NaN, this.#$.POSITIVE_INFINITY], [this.#$.NEGATIVE_INFINITY, this.#$()]];

	/** @returns {number} @param {string} source @param {number} radix */
	static #parse(source, radix = +10.)
	{
		const target = this.#$.parseInt(source, radix);

		if (this.#$.isSafeInteger(target) && target.toString(radix) === source)
			return target;
		else
			throw new globalThis.RangeError(`Failed to parse a safe integer from "${source}".`);
	}

	/** @returns {number} @param {globalThis.Iterator<string, string>} former @param {globalThis.Iterator<string, string>} latter */
	static #compare(former, latter)
	{
		const x = former.next();
		const y = latter.next();
		const z = this.#table[~~x.done][~~y.done];

		return z === z ? z : x.value === y.value ? this.#compare(former, latter) : this.#parse(x.value) - this.#parse(y.value);
	}

	/** @returns {number} @param {string} former @param {string} latter */
	static compare(former, latter)
	{
		const x = former.split('.').values();
		const y = latter.split('.').values();
		const z = this.#compare(x, y);

		return z;
	}
}
