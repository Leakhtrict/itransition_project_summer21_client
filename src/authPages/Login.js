import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";

function Login() {
    let history = useHistory();
    const { setAuthState } = useContext(AuthContext);

    const initialValues = {
        nameOrEmail: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        nameOrEmail: Yup.string().required("Username or E-Mail are required."),
        password: Yup.string().required("Password is required.")
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/users/login", data).then((response) => {
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
                console.log(response.data);
                history.push("/");
            }
        });
    };

    return (
        <div className="loginPage">
            <Formik 
            initialValues={initialValues} 
            onSubmit = {onSubmit}
            validationSchema={validationSchema}>
                <Form className="loginForm">
                    <ErrorMessage name="nameOrEmail" component="span"/>
                    <FormattedMessage id="login-page.nameOrEmail">
                        {(id) => 
                            <Field 
                            autocomplete="off" 
                            id="loginFormField" 
                            name="nameOrEmail" 
                            placeholder={id} />
                        }
                    </FormattedMessage>
                    <ErrorMessage name="password" component="span"/>
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
                    
                    <button type="submit">
                        <FormattedMessage id="login-page.login" />
                    </button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login;
