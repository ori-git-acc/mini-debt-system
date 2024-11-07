// hooks/useForm.js
import { useState } from "react";
import * as Yup from "yup";

const useForm = (initialValues, onSubmit) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const validationSchema = Yup.object().shape({
		debtorName: Yup.string().required("Debtor's name is required"),
		amount: Yup.number()
			.required("Amount is required")
			.positive("Amount must be positive")
			.integer("Amount must be an integer"),
	});

	const validate = async () => {
		try {
			await validationSchema.validate(values, { abortEarly: false });
			setErrors({});
			return true;
		} catch (validationErrors) {
			const formattedErrors = validationErrors.inner.reduce((acc, error) => {
				acc[error.path] = error.message;
				return acc;
			}, {});
			setErrors(formattedErrors);
			return false;
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const isValid = await validate();
		if (isValid) {
			setLoading(true);
			try {
				await onSubmit(values);
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		}
	};

	return {
		values,
		errors,
		loading,
		handleChange,
		handleSubmit,
		setValues, // Ensure this is returned
	};
};

export default useForm;
