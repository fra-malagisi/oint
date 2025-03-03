import type { PhonePrefix } from '../../models';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const response = await fetch('https://oint-ms.vercel.app/phone-prefix', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const phonePrefixes = ((await response.json()) as PhonePrefix[]).map((phonePrefix) => ({
		text: `${phonePrefix.regionCode} ${phonePrefix.prefix}`,
		value: phonePrefix.prefix
	}));

	return {
		phonePrefixes
	};
};
