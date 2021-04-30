import * as yenv from "yenv";
import lodash = require("lodash");
import BigNumber from "bignumber.js";

const env = yenv("env.yaml", { env: "test" });
Object.keys(env).forEach((key) => {
	if (lodash.isNil(process.env[key])) {
		// process.env only allows string-to-string mapping
		if (lodash.isArray(env[key]) || lodash.isObject(env[key])) {
			process.env[key] = JSON.stringify(env[key]);
		} else {
			process.env[key] = env[key];
		}
	}
});

// DECIMAL_PLACES. Integer, 0 to MAX inclusive.
// Setting at 1e+9 would almost never return exponential notation
// For more, please visit http://mikemcl.github.io/bignumber.js/#config
BigNumber.config({ EXPONENTIAL_AT: 1e9, DECIMAL_PLACES: 8 });
