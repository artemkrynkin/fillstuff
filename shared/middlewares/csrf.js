import hostValidation from 'host-validation';

// NOTE(@mxstbr):
// - Host header only contains the domain, so something like 'build-api-asdf123.now.sh' or 'keeberink.com'
// - Referer header contains the entire URL, so something like 'https://build-api-asdf123.now.sh/feed' or 'https://keeberink.com/dashboard'
// That means we have to check the Host slightly differently from the Referer to avoid things like 'my-domain-keeberink.com' to be able to hack our users

// Hosts, without http(s):// and paths
const trustedHosts = [
	process.env.NOW_URL && new RegExp(`^${process.env.NOW_URL.replace('https://', '')}$`),
	/^fillstuff.keeberink\.com$/,
	// All subdomains
	/^.*\.keeberink\.com$/,
].filter(Boolean);

// Referers, with http(s):// and paths
const trustedReferers = [
	/^https:\/\/fillstuff.keeberink\.com($|\/.*)/,
	// All subdomains
	/^https:\/\/.*\.keeberink\.com($|\/.*)/,
].filter(Boolean);

export default hostValidation({
	hosts: trustedHosts,
	referers: trustedReferers,
	mode: 'either',
});
