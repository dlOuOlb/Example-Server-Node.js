'use strict';

import clock from './script/clock.js';

globalThis.document.querySelector('button').addEventListener
(
	'click', async function (_click)
	{
		this.disabled = true;
		const time = clock();

		return await globalThis.
			fetch(this.formAction, { cache: 'no-store' }).
			then(δ => void (this.textContent = `${δ.statusText}: ${clock(time).toFixed(+1.)} ms`)).
			catch(δ => void (this.textContent = `${δ}`)).
			finally(() => void (this.disabled = false));
	}
);
