import React, { useState } from 'react'

const CForm = (props) =>{
  const {
    initialVaues,
    onSubmit,
    validate,
    children
  } = props
  const [values, setValues] = useState(initialVaues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (event) =>{
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    event.persist()
    setValues (prevState=>({
      ...prevState, [name]: value
    }));
    setErrors (prevState=>({...prevState, ...validate(values)}))
  }

  const handleBlur = (event) => {
    const name = event.target.name;
    event.persist()
    setTouched (prevState=>({
      ...prevState, [name]: true,
    }))
    setErrors (prevState=>({...prevState, ...validate(values)}))
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    // do validation
    onSubmit(values);
  }
  
  return children ({
      values,
      errors,
      touched,
      handleChange: handleChange,
      handleBlur: handleBlur,
      handleSubmit: handleSubmit
    })
}

export default CForm