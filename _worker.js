const CLOUDFLARE_IPS = [
  // Cloudflare IPv4 Ranges
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
  "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/12",
  "172.64.0.0/13", "131.0.72.0/22",
  // Cloudflare IPv6 Ranges
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
  "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32"
];

// Check if an IP is in a CIDR block
const isIpInCidr = (ip, cidr) => {
  const [range, bits = 32] = cidr.split("/");
  const mask = ~(2 ** (32 - bits) - 1);
  const ipNum = ipToNum(ip);
  const rangeNum = ipToNum(range);
  return (ipNum & mask) === (rangeNum & mask);
};

// Convert IP to a numerical representation
const ipToNum = (ip) => ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);

export default {
  async fetch(request) {
    const clientIp = request.headers.get("CF-Connecting-IP");
    if (!clientIp) {
      return new Response("Client IP not found.", { status: 400 });
    }

    const isCleanIp = CLOUDFLARE_IPS.some((cidr) => isIpInCidr(clientIp, cidr));
    return new Response(
      JSON.stringify({ ip: clientIp, isClean: isCleanIp }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};