import axios from 'axios';
const CF_API = 'https://api.cloudflare.com/client/v4';
const auth = { headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` } };
export async function listFirewallRules(){
  return axios.get(`${CF_API}/zones/${process.env.CLOUDFLARE_ZONE_ID}/firewall/rules`, auth);
}
export async function createIPAccessRule(mode:'block'|'challenge', ip:string, note?:string){
  return axios.post(`${CF_API}/zones/${process.env.CLOUDFLARE_ZONE_ID}/firewall/access_rules/rules`, { mode, configuration: { target: 'ip', value: ip }, notes: note }, auth);
}
