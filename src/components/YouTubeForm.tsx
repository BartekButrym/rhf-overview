import { useEffect } from 'react';
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

type FormValues = {
	username: string;
	email: string;
	channel: string;
	social: {
		twitter: string;
		facebook: string;
	};
	phoneNumbers: string[];
	phNumbers: {
		number: string;
	}[];
	age: number;
	dob: Date;
};

export const YouTubeForm = () => {
	const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } =
		useForm<FormValues>({
			defaultValues: {
				username: '',
				email: '',
				channel: '',
				social: {
					twitter: '',
					facebook: '',
				},
				phoneNumbers: ['', ''],
				phNumbers: [{ number: '' }],
				age: 0,
				dob: new Date(),
			},
			mode: 'onSubmit',
		});
	const {
		errors,
		touchedFields,
		dirtyFields,
		isDirty,
		isValid,
		isSubmitting,
		isSubmitted,
		isSubmitSuccessful,
		submitCount,
	} = formState;

	console.log('touchedFields', touchedFields);
	console.log('dirtyFields', dirtyFields);
	console.log('isDirty', isDirty);
	console.log('isValid', isValid);
	console.log('isSubmitting', isSubmitting);
	console.log('isSubmitted', isSubmitted);
	console.log('isSubmitSuccessful', isSubmitSuccessful);
	console.log('submitCount', submitCount);

	const { fields, append, remove } = useFieldArray({
		name: 'phNumbers',
		control,
	});

	const onSubmit = (data: FormValues) => {
		console.log('data', data);
	};

	const onError = (errors: FieldErrors<FormValues>) => {
		console.log('Form errors', errors);
	};

	// const watchUsername = watch('username');

	const handleGetValues = () => {
		console.log('Get values: ', getValues());
		console.log('Get value: ', getValues('social'));
		console.log('Get array value: ', getValues(['username', 'channel']));
	};

	const handleSetValue = () => {
		setValue('username', '', {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	useEffect(() => {
		const subscription = watch((value) => {
			console.log(value);
		});

		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<div>
			{/* <h2>Watched value: {watchUsername}</h2> */}
			<form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
				<div className='form-control'>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						id='username'
						{...register('username', {
							required: 'Username is required',
						})}
					/>
					<p className='error'>{errors.username?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='email'>Email</label>
					<input
						type='text'
						id='email'
						{...register('email', {
							pattern: {
								value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
								message: 'Invalid email format',
							},
							validate: {
								notAdmin: (fieldValue) => {
									return fieldValue !== 'admin@mail.com' || 'Enter a different email address';
								},
								notBlackListed: (fieldValue) => {
									return !fieldValue.endsWith('baddomain.com') || 'This domain is not supported';
								},
								emailAvailable: async (fieldValue) => {
									const response = await fetch(
										`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
									);

									const data = await response.json();

									return data.length == 0 || 'Email already exists';
								},
							},
						})}
					/>
					<p className='error'>{errors.email?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='channel'>Channel</label>
					<input
						type='text'
						id='channel'
						{...register('channel', {
							required: 'Channel is required',
						})}
					/>
					<p className='error'>{errors.channel?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='twitter'>Twitter</label>
					<input
						type='text'
						id='twitter'
						{...register('social.twitter', {
							disabled: watch('channel') === '',
						})}
					/>
				</div>

				<div className='form-control'>
					<label htmlFor='facebook'>Facebook</label>
					<input type='text' id='facebook' {...register('social.facebook')} />
				</div>

				<div className='form-control'>
					<label htmlFor='primary-phone'>Primary phone number</label>
					<input type='text' id='primary-phone' {...register('phoneNumbers.0')} />
				</div>

				<div className='form-control'>
					<label htmlFor='secondary-phone'>Secondary phone number</label>
					<input type='text' id='secondary-phone' {...register('phoneNumbers.1')} />
				</div>

				<div>
					<label>List of phone numbers</label>
					<div>
						{fields.map((field, index) => (
							<div className='form-control' key={field.id}>
								<input type='text' {...register(`phNumbers.${index}.number` as const)} />
								{index > 0 && (
									<button type='button' onClick={() => remove(index)}>
										Remove
									</button>
								)}
							</div>
						))}
						<button type='button' onClick={() => append({ number: '' })}>
							Add phone number
						</button>
					</div>
				</div>

				<div className='form-control'>
					<label htmlFor='age'>Age</label>
					<input
						type='number'
						id='age'
						{...register('age', {
							valueAsNumber: true,
							required: 'Age is required',
						})}
					/>
					<p className='error'>{errors.age?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='dob'>Date of birth</label>
					<input
						type='date'
						id='dob'
						{...register('dob', {
							valueAsDate: true,
							required: 'Date of birth is required',
						})}
					/>
					<p className='error'>{errors.dob?.message}</p>
				</div>

				<button disabled={!isDirty || isSubmitting}>Submit</button>
				<button type='button' onClick={() => reset()}>
					Reset
				</button>
				<button type='button' onClick={handleGetValues}>
					Get values
				</button>
				<button type='button' onClick={handleSetValue}>
					Set values
				</button>
				<button type='button' onClick={() => trigger()}>
					Trigger
				</button>
				<button type='button' onClick={() => trigger('channel')}>
					Trigger "Channel" field
				</button>
			</form>
			<DevTool control={control} />
		</div>
	);
};
