import axios from 'axios';
export async function wazuhHealth(){
  return axios.get(`${process.env.WAZUH_API_URL}/security/user/authenticate`, { auth: { username: process.env.WAZUH_API_USER||'', password: process.env.WAZUH_API_PASS||'' } });
}
