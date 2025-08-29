import axios from 'axios';
export async function getVaultSecret(path:string){
  const r = await axios.get(`${process.env.VAULT_ADDR}/v1/${path}`, { headers: { 'X-Vault-Token': process.env.VAULT_TOKEN } });
  return r.data;
}
