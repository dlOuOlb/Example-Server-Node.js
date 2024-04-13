'use strict';

import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

export default class extends null
{
	/** @returns {Object.<string, {content: (string | Buffer), headers: http.OutgoingHttpHeaders}>} @param {string} directory */
	static load(directory) { return globalThis.Object.fromEntries(this.#scan(directory, path.sep).map(δ => [δ.replaceAll(path.sep, '/'), this.#load(path.join(directory, δ))])); }

	/** @returns {string[]} @param {string} root @param {string} stem */
	static #scan(root, stem = '') { return fs.readdirSync(path.join(root, stem), { withFileTypes: true }).flatMap(δ => δ.isDirectory() ? this.#scan(root, path.join(stem, δ.name)) : δ.isFile() ? path.join(stem, δ.name) : [], this); }

	/** @returns {{content: (string | Buffer), headers: http.OutgoingHttpHeaders}} @param {string} file */
	static #load(file)
	{
		const format = file.split('.').pop().toLowerCase();
		const headers = { 'cache-control': format === 'html' ? 'no-cache' : 'immutable, private, max-age=31536000', 'x-content-type-options': 'nosniff' };

		/**/ if (format in this.#mime.image)
			return { content: fs.readFileSync(file), headers: { ...headers, 'content-type': `image/${this.#mime.image[format]}` } };
		else if (format in this.#mime.text)
			return { content: fs.readFileSync(file, { encoding: 'utf8' }), headers: { ...headers, 'content-type': `text/${this.#mime.text[format]}; charset=UTF-8` } };
		else
			throw new RangeError(`Failed to load a file from the path '${file}'; '${format}' is not a supported format.`);
	}

	static #mime = { image: { png: 'png' }, text: { css: 'css', html: 'html', js: 'javascript', txt: 'plain' } };
}
