'use strict';

import * as fs from 'node:fs';
import * as path from 'node:path';

export default class extends null
{
	/** @returns {Object.<string, {content: (string | Buffer), type: {'Content-Type': string}}>} @param {string} directory */
	static load(directory) { return globalThis.Object.fromEntries(this.#scan(directory, path.sep).map(δ => [δ.replaceAll(path.sep, '/'), this.#load(path.join(directory, δ))])); }

	/** @returns {string[]} @param {string} root @param {string} stem */
	static #scan(root, stem = '') { return fs.readdirSync(path.join(root, stem), { withFileTypes: true }).flatMap(δ => δ.isDirectory() ? this.#scan(root, path.join(stem, δ.name)) : δ.isFile() ? path.join(stem, δ.name) : [], this); }

	/** @returns {{content: (string | Buffer), type: {'Content-Type': string}}} @param {string} file */
	static #load(file)
	{
		const format = file.split('.').pop().toLowerCase();

		/**/ if (format in this.#mime.image)
			return { content: fs.readFileSync(file), type: { 'Content-Type': this.#mime.image[format] } };
		else if (format in this.#mime.text)
			return { content: fs.readFileSync(file, this.#utf8.options), type: { 'Content-Type': `${this.#mime.text[format]}; ${this.#utf8.charset}` } };
		else
			throw new RangeError(`Failed to load a file from the path '${file}'; '${format}' is not a supported format.`);
	}

	static #utf8 = { charset: 'charset=UTF-8', options: { encoding: 'utf8' } };
	static #mime =
	{
		image: { png: 'image/png' },
		text:
		{
			css: 'text/css',
			html: 'text/html',
			js: 'text/javascript',
			txt: 'text/plain'
		}
	};
}
