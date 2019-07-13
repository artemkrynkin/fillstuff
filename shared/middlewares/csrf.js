import hostValidation from 'host-validation';

// NOTE(@mxstbr):
// - Host header only contains the domain, so something like 'build-api-asdf123.now.sh' or 'blikside.com'
// - Referer header contains the entire URL, so something like 'https://build-api-asdf123.now.sh/feed' or 'https://blikside.com/feed'
// That means we have to check the Host slightly differently from the Referer to avoid things like 'my-domain-blikside.com' to be able to hack our users

// Hosts, without http(s):// and paths
const trustedHosts = [
	process.env.NOW_URL && new RegExp(`^${process.env.NOW_URL.replace('https://', '')}$`),
	/^blikside\.com$/,
	// All subdomains
	/^.*\.blikside\.com$/,
].filter(Boolean);

// Referers, with http(s):// and paths
const trustedReferers = [
	process.env.NOW_URL && new RegExp(`^${process.env.NOW_URL}($|\/.*)`),
	/^https:\/\/blikside\.com($|\/.*)/,
	// All subdomains
	/^https:\/\/.*\.blikside\.com($|\/.*)/,
].filter(Boolean);

export default hostValidation({
	hosts: trustedHosts,
	referers: trustedReferers,
	mode: 'either',
});
