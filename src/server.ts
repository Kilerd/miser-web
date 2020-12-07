import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
export default polka()
	.use(
		compression({ threshold: 0 }),
		cookieParser(),
		sirv('static', { dev }),
		async (req, res, next) => {
			const token = req.cookies['AUTH'] || null;
			const currentLedgerId = req.cookies['CURRENT_LEDGER_ID'] || null;
			const profile = token ? jwt.decode(token) : false
			return sapper.middleware({
				session: () => {
					return {
						authenticated: !!profile,
						profile,
						user: false,
						token,
						currentLedgerId
					};
				}
			})(req, res, next)
		}
	)
	.listen(PORT, (err: any) => {
		if (err) console.log('error', err);
	});
