export const sampleTrace = {
  source: "Bangkok (TH)",
  target: "Frankfurt (DE)",
  hops: [
    { hop: 1, ip: "192.168.1.1", lat: 13.7563, lon: 100.5018, rtt: 1,  city: "Bangkok",     asn: "LAN" },
    { hop: 2, ip: "10.10.0.1",    lat: 1.3521,  lon: 103.8198, rtt: 32, city: "Singapore",   asn: "AS??? (demo)" },
    { hop: 3, ip: "203.0.113.5",  lat: 35.6895, lon: 139.6917, rtt: 95, city: "Tokyo",       asn: "AS??? (demo)" },
    { hop: 4, ip: "198.51.100.9", lat: 50.1109, lon: 8.6821,   rtt: 210,city: "Frankfurt",   asn: "AS??? (demo)" }
  ],
};
