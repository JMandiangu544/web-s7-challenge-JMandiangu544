import React, { useState } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' }
];

const schema = yup.object().shape({
  fullName: yup.string().trim().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
  size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect).required(),
  toppings: yup.array().of(yup.number().oneOf([1, 2, 3, 4, 5]))
});

export default function Form() {
  const [formState, setFormState] = useState({
    fullName: '',
    size: '',
    toppings: []
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormState({
        ...formState,
        toppings: checked
          ? [...formState.toppings, Number(name)]
          : formState.toppings.filter(topping => topping !== Number(name))
      });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setFailureMessage('');
    setErrors({});
    
    try {
      await schema.validate(formState, { abortEarly: false });
      await axios.post('http://localhost:9009/api/order', formState);
      setSuccessMessage('Thank you for your order!');
      setFormState({ fullName: '', size: '', toppings: [] }); // Clear the form
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        setFailureMessage('Something went wrong');
      }
    }
  };

  const isFormValid = formState.fullName && formState.size;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      {failureMessage && <div className='failure'>{failureMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            name="fullName"
            type="text"
            value={formState.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formState.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              checked={formState.toppings.includes(Number(topping.topping_id))}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={!isFormValid} />
    </form>
  );
}
