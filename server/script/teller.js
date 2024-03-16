'use strict';

import * as net from 'node:net';
import * as os from 'node:os';

export default class extends null
{
	/** @returns {string} @param {net.Socket} socket */
	static client(socket) { return `${socket.remoteFamily}${socket.remoteAddress}:${socket.remotePort}`; }

	/** @returns {?string} @param {os.NetworkInterfaceInfo} information */
	static server(information)
	{
		if (information.internal)
			return null;
		else switch (information.family)
		{
			default: return null;
			case 'IPv4': return information.address;
			case 'IPv6': return `[${information.address}]`;
		}
	}
}
