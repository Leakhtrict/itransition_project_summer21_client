import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import { Button } from "@material-ui/core";

function Login() {
    let history = useHistory();
    const { setAuthState } = useContext(AuthContext);

    const initialValues = {
        nameOrEmail: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        nameOrEmail: Yup.string().required(),
        password: Yup.string().required()
    });

    const onSubmit = (data) => {
        axios.post("https://itransition-project-genis.herokuapp.com/users/login", data).then((response) => {
            if (response.data.error){
                alert(response.data.error);
            }
            else{
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    isAdmin: response.data.isAdmin,
                    status: true,
                });
                history.push("/");
            }
        });
    };

    return (
        <div className="loginPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit = {onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="loginForm">
                    <ErrorMessage name="nameOrEmail" render={msg => <span id="formError"><FormattedMessage id="login-page.nameOrEmail.error"/></span>} />
                    <FormattedMessage id="login-page.nameOrEmail">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="loginFormField" 
                            name="nameOrEmail" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="password" render={msg => <span id="formError"><FormattedMessage id="login-page.password.error"/></span>} />
                    <FormattedMessage id="login-page.password">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            type="password"
                            id="loginFormField" 
                            name="password" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <Button id="submitButton" type="submit" style={{ width: "auto" }}>
                        <FormattedMessage id="login-page.login" />
                    </Button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login;
