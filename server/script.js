'use strict';

import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';
import * as process from 'node:process';
import * as url from 'node:url';

import Loader from './script/loader.js';
import Sorter from './script/sorter.js';
import Teller from './script/teller.js';

const $ = globalThis;
const node = '21.7.0';

if (+0. < Sorter.compare(node, process.versions.node))
	$.console.error(`Node.js version unmet: ${process.versions.node} < ${node}`);
else
{
	const client = Loader.load(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'client'));
	const server = http.createServer
	(
		/** @this http.Server */ function (message, response)
		{
			const socket = null === response.socket ? null : Teller.client(response.socket);

			/**/ if (message.url === $.undefined)
				void response.writeHead(+500.).end(); // Internal Server Error
			else if (message.url === '/')
				void response.writeHead(+307., { location: '/index.html' }).end(); // Temporary Redirect
			else if (message.url in client)
				void response.writeHead(+200., client[message.url].type).end(client[message.url].content); // OK
			else
				void response.writeHead(+404.).end(); // Not Found

			return $.console.info(`${new $.Date().toJSON()} ${socket} ${message.url}`);
		}
	).addListener
	(
		'listening', /** @this http.Server */ function ()
		{
			/** @type {number} */ const port = this.address().port;

			$.Object.values(os.networkInterfaces()).flatMap(δ => δ.map(Teller.server)).filter($.Boolean).forEach(δ => $.console.info(`http://${δ}:${port}/`));

			return $.console.info('...');
		}
	).listen();

	void process.stdin.once
	(
		'data', /** @this NodeJS.ReadStream */ function (_data)
		{
			void this.pause();
			// https://github.com/nodejs/node/pull/51797
			return server.close($.console.error).closeAllConnections();
		}
	);
}
