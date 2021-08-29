import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button } from "@material-ui/core";

function Register() {
    let history = useHistory();

    const initialValues = {
        username: "",
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().max(18, "maxlimit").required(),
        email: Yup.string().email("notEmail").required(),
        password: Yup.string().required()
    });

    const onSubmit = (data) => {
        axios.post("https://itransition-project-genis.herokuapp.com/users/register", data)
        .then(() => {
            history.push("/login");
        });
    };

    return (
        <div className="registerPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit = {onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="registerForm">
                    <ErrorMessage name="username" render={msg => {
                            if(msg === "maxlimit"){
                                return <span id="formError"><FormattedMessage id="register-page.username.error.maxlimit"/></span>
                            } else{
                                return <span id="formError"><FormattedMessage id="register-page.username.error.required"/></span>
                            }
                        }
                    }/>
                    <FormattedMessage id="register-page.username">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="registerFormField" 
                            name="username" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="email" render={msg => {
                        if(msg === "notEmail"){
                            return <span id="formError"><FormattedMessage id="register-page.email.error.notEmail"/></span>
                        } else{
                            return <span id="formError"><FormattedMessage id="register-page.email.error.required"/></span>
                        }
                    }}/>
                    <FormattedMessage id="register-page.email">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="registerFormField" 
                            name="email" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="password" render={msg => <span id="formError"><FormattedMessage id="register-page.password.error"/></span>} />
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

                    <Button id="submitButton" type="submit" style={{ width: "auto" }}>
                        <FormattedMessage id="register-page.register" />
                    </Button>
                </Form>
            </Formik>
        </div>
    )
}

export default Register;
