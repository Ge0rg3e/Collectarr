import { useState } from 'react';
import * as yup from 'yup';

/**
 * This function is used to simplify the process of creating a form.
 * @param defineKeys Object that defines the keys for the form.
 */
export const createFormData = ({
	defineKeys = {}
}: {
	defineKeys: Record<string, 'email' | 'string' | 'number' | 'boolean' | null>;
}) => {
	const [data, setData] = useState<any>({});

	/**
	 * Updates the form data with a new value for the specified key.
	 * @param key The key to update.
	 * @param value The new value for the key.
	 */
	const update = (key: string, value: any) => setData({ ...data, [key]: value });

	/**
	 * Sets the initial data for the form.
	 * @param data The initial data object.
	 */
	const setInitData = (data: any) => setData(data);

	/**
	 * Checks if the current form data is the same as the initial data.
	 * @param initData The data to compare against.
	 * @returns A boolean.
	 */
	const isSame = (initData: any) => JSON.stringify(data) === JSON.stringify(initData);

	/**
	 * Checks if the form is empty.
	 */
	const isEmpty = () => Object.keys(data).length === 0;

	/**
	 * Validates the form data based on the defined keys.
	 * @returns A boolean.
	 */
	const validate = () => {
		if (isEmpty()) return false;

		let schema = yup.object();

		for (const key in defineKeys) {
			let field: yup.Schema<any> | null = null;

			const keyType = defineKeys[key];

			if (keyType === null) continue;

			switch (keyType) {
				case 'string':
					field = yup.string().required();
					break;
				case 'number':
					field = yup.number().required();
					break;
				case 'boolean':
					field = yup.boolean().required();
					break;
				case 'email':
					field = yup.string().email().required();
					break;
			}

			schema = schema.shape({ [key]: field });
		}

		return schema.isValidSync(data);
	};

	/**
	 * Filters the form data based on the defined keys.
	 * @returns The filtered form data object.
	 */
	const getData = () => {
		const result: any = {};

		for (const key in defineKeys) {
			result[key] = data[key];
		}

		return result;
	};

	return { update, validate, setInitData, isEmpty, isSame, getData } as const;
};
