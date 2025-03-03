import { toggleSpinner } from '../stores/spinner';
import { showAlert } from './show-alert';

export const apiCall = async <T>(
	url: string,
	method: 'get' | 'post' | 'put' | 'delete',
	successMessage: string,
	body?: string,
	jwt = ''
): Promise<T> => {
	toggleSpinner.update((toggleSpinner) => true);
	let response;
	try {
		const headers: { 'Content-Type': string; Authorization?: string } = {
			'Content-Type': 'application/json'
		};
		if (jwt) {
			headers['Authorization'] = jwt;
		}
		switch (method) {
			case 'get':
				response = await fetch(url, {
					headers
				});
				break;
			case 'post':
				response = await fetch(url, {
					headers,
					method: 'POST',
					body
				});
				break;
		}
	} catch (err: unknown) {
		toggleSpinner.update((toggleSpinner) => false);
	}

	if (response?.status === 200) {
		toggleSpinner.update((toggleSpinner) => false);
		if (successMessage) {
			showAlert({ show: true, message: successMessage, isSuccess: true });
		}
		return await response.json();
	}
	const data = await response?.json();
	toggleSpinner.update((toggleSpinner) => false);
	showAlert({
		show: true,
		message: `${(data.message as string[]).reduce((acc, curr) => `${acc} ${curr}`, '')}` as string,
		isError: true
	});
	throw new Error(`${response?.statusText}`);
};
