'use strict';

/** @returns {number} @param {number} offset */
export default function (offset = +0.) { return globalThis.performance.now() - offset; }
