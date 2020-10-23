import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { api } from './http'

import { count } from "./stores"

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

export default polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		cookieParser(),
		sirv('static', { dev }),
		async (req, res, next) => {
			const token = req.cookies['AUTH'] || null;
			const profile = token ? jwt.decode(token) : false
			return sapper.middleware({
				session: () => {
					return {
						authenticated: !!profile,
						profile,
						user:false, 
						token
					};
				}
			})(req, res, next)
		}
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
