import fs from "node:fs";
import batchflow from "batchflow";
import dnsPlugins from "../certbot/dns-plugins.json" with { type: "json" };
import { certbot as logger } from "../logger.js";
import errs from "./error.js";
import utils from "./utils.js";

/**
 * Installs a cerbot plugin given the key for the object from
 * ../certbot/dns-plugins.json
 *
 * @param   {string}  pluginKey
 * @returns {Object}
 */
const installPlugin = async (pluginKey) => {
	if (!pluginKey || typeof pluginKey !== "string" || !Object.hasOwn(dnsPlugins, pluginKey)) {
		throw new errs.ItemNotFoundError(pluginKey);
	}

	const basePlugin = dnsPlugins[pluginKey];
	logger.start(`Installing ${pluginKey}...`);

	const certbotVersion = process.env.CERTBOT_VERSION || "";
	const pluginVersion = (basePlugin.version || "").replace(/{{certbot-version}}/g, certbotVersion);
	const pluginDependencies = (basePlugin.dependencies || "").replace(/{{certbot-version}}/g, certbotVersion);

	// SETUPTOOLS_USE_DISTUTILS=local uses setuptools' own bundled distutils.
	// "stdlib" breaks Python 3.13+ where distutils was removed from the standard library.
	let env = Object.assign({}, process.env, { SETUPTOOLS_USE_DISTUTILS: "local" });
	if (typeof basePlugin.env === "object" && basePlugin.env !== null) {
		env = Object.assign(env, basePlugin.env);
	}

	const depsArray = pluginDependencies.trim()
		? pluginDependencies
				.trim()
				.split(/\s+/)
				.filter(Boolean)
		: [];

	const pkgWithVersion = `${basePlugin.package_name}${pluginVersion}`;

	let result;
	if (fs.existsSync("/opt/certbot/bin/pip")) {
		result = await utils.execFile(
			"/opt/certbot/bin/pip",
			["install", "--no-cache-dir", ...depsArray, pkgWithVersion],
			{ env },
		);
	} else {
		result = await utils.execFile(
			"pipx",
			["inject", "certbot", ...depsArray, pkgWithVersion],
			{
				env: Object.assign({}, env, {
					PIPX_HOME: "/opt/pipx",
					PIPX_BIN_DIR: "/usr/local/bin",
				}),
			},
		);
	}

	logger.complete(`Installed ${pluginKey}`);
	return result;
};

/**
 * @param {array} pluginKeys
 */
const installPlugins = async (pluginKeys) => {
	let hasErrors = false;

	return new Promise((resolve, reject) => {
		if (pluginKeys.length === 0) {
			resolve();
			return;
		}

		batchflow(pluginKeys)
			.sequential()
			.each((_i, pluginKey, next) => {
				installPlugin(pluginKey)
					.then(() => {
						next();
					})
					.catch((err) => {
						hasErrors = true;
						next(err);
					});
			})
			.error((err) => {
				logger.error(err.message);
			})
			.end(() => {
				if (hasErrors) {
					reject(new errs.CommandError("Some plugins failed to install. Please check the logs above", 1));
				} else {
					resolve();
				}
			});
	});
};

export { installPlugin, installPlugins };
