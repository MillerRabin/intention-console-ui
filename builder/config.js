import path from 'path';
import process from "node:process";

export const production = (process.argv[2] != 'debug');
export const root = path.resolve('./static');
export const domain = production ? 'https://int-t.com' : 'http://localhost:8084';
export const useHttp2 = false;

export default {
    root,
    production,
    domain,
    useHttp2
}