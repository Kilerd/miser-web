import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';

import { count } from "./stores"

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

export default polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		cookieParser(),
		sirv('static', { dev }),
		async (req, res, next) => {
			const token = req.cookies['AUTH']
			const profile = true
			return sapper.middleware({
				session: () => {
					let a = {
						authenticated: !!profile,
						profile,
						token
					};
					console.log(a);
					return a; 
				}
			})(req, res, next)
		}
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
