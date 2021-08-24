import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";

function Register() {
    let history = useHistory();

    const initialValues = {
        username: "",
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required."),
        email: Yup.string().email("Wrong input").required("E-Mail is required."),
        password: Yup.string().required("Password is required.")
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/users/register", data).then(() => {
            history.push("/login");
        });
    };

    return (
        <div className="registerPage">
            <Formik 
            initialValues={initialValues} 
            onSubmit = {onSubmit}
            validationSchema={validationSchema}>
                <Form className="registerForm">
                    <ErrorMessage name="username" component="span"/>
                    <FormattedMessage id="register-page.username">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="registerFormField" 
                            name="username" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="email" component="span"/>
                    <FormattedMessage id="register-page.email">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="registerFormField" 
                            name="email" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="password" component="span"/>
                    <FormattedMessage id="register-page.password">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            type="password"
                            id="registerFormField" 
                            name="password" 
                            placeholder={id} />
                        }
                    </FormattedMessage>

                    <button type="submit">
                        <FormattedMessage id="register-page.register" />
                    </button>
                </Form>
            </Formik>
        </div>
    )
}

export default Register;
