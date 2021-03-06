import React, { Fragment, useState } from 'react'
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import axios from 'axios';
import usersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Gestion des champs
  const handleChange = ({ target }) => {
    const {value, name} = target;

    setUser({...user, [name]: value})
  };

  // Gestion de la soumission
  const handleSubmit = async event => {
    event.preventDefault();

    const apiErrors= {};
    if(user.password !== user.passwordConfirm){
      apiErrors.passwordConfirm = "Passwords aren't the same";
      setErrors(apiErrors);
      toast.error("Il y a des erreurs dans votre formulaire !")
      return;
    }

    try {
      await usersAPI.register(user);
      setErrors({});
      toast.info("Vous êtes désormais inscrit, vous pouvez vous connecter")
      history.replace("/login");
    } catch(error) {
      console.log(error.response);
      const {violations} = error.response.data;

      if(violations){
        const apiErrors = {};
        violations.map(violation => {
          apiErrors[violation.propertyPath] = violation.message
        });
        setErrors(apiErrors);
      }
      toast.error("Il y a des erreurs dans votre formulaire !")
    }
  }

  return (
    <Fragment>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
        name="firstName"
        label="Prénom"
        placeholder="Votre prénom"
        error={errors.firstName}
        value={user.firstName}
        onChange={handleChange}
        />
        <Field
        name="lastName"
        label="Nom de famille"
        placeholder="Votre nom de famille"
        error={errors.lastName}
        value={user.lastName}
        onChange={handleChange}
        />
        <Field
        name="email"
        label="Email"
        type="email"
        placeholder="Votre email"
        error={errors.email}
        value={user.email}
        onChange={handleChange}
        />
        <Field
        name="password"
        type="password"
        label="Mot de passe"
        placeholder="Votre mot de passe"
        error={errors.password}
        value={user.password}
        onChange={handleChange}
        />
        <Field
        name="passwordConfirm"
        type="password"
        label="Confirmer le Mot de passe"
        placeholder="Confirmer le mot de passe"
        error={errors.passwordConfirm}
        value={user.passwordConfirm}
        onChange={handleChange}
        />
        <div className="form-group">
          <button className="btn btn-success">Inscription</button>
          <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
        </div>
      </form>
    </Fragment>
  )
}

export default RegisterPage;
