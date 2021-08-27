import React, { useContext, useLayoutEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { AuthContext } from "../helpers/AuthContext";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { IconButton, Button, Grid, Tooltip } from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function EditCollection() {
    let { id } = useParams();
    const { authState } = useContext(AuthContext);
    const [freeText, setFreeText] = useState("");
    const [selectedTab, setSelectedTab] = useState("write");
    const [currCollection, setCurrCollection] = useState({});
    const [showAdditFields, setShowAdditFields] = useState(false);
    let history = useHistory();

    useLayoutEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/byId/${id}`, 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((response) => {
            if (response.data.error) {
                history.push("/login");
            } else if (response.data.collection.UserId !== response.data.userInfo.id && !response.data.userInfo.isAdmin) {
                history.push("/");
            }
            setCurrCollection(response.data.collection);
            setFreeText(response.data.collection.description);
        });
    }, [id]);

    const initialValues = {
        title: currCollection.title,
        description: currCollection.description,
        theme: currCollection.theme,
        ownerUser: currCollection.ownerUser,
        numField1_Name: currCollection.numField1_Name,
        numField2_Name: currCollection.numField2_Name,
        numField3_Name: currCollection.numField3_Name,
        stringField1_Name: currCollection.stringField1_Name,
        stringField2_Name: currCollection.stringField2_Name,
        stringField3_Name: currCollection.stringField3_Name,
        textField1_Name: currCollection.textField1_Name,
        textField2_Name: currCollection.textField2_Name,
        textField3_Name: currCollection.textField3_Name,
        dateField1_Name: currCollection.dateField1_Name,
        dateField2_Name: currCollection.dateField2_Name,
        dateField3_Name: currCollection.dateField3_Name,
        UserId: currCollection.UserId,
    };

    const onSubmit = (data) => {
        data.description = freeText;
        axios.post(`https://itransition-project-genis.herokuapp.com/collections/${id}/editCollection`, data).then(() => {
            history.push(`/user/${currCollection.UserId}`);
        });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required."),
        description: Yup.string().max(240, "Limit is reached! (max. 240 chars)"),
        theme: Yup.string().required("Theme is required."),
    });

    return (
        <div className="createCollection">
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form>
                    <Grid container direction="column" alignItems="center" spacing={1}>
                        <Grid item>
                            <div className="createCollectionMain">
                                <ErrorMessage name="title" component="span" />
                                <FormattedMessage id="createcollection-page.title">
                                    {(id) => 
                                        <Field
                                        autocomplete="off"
                                        id="inputCreateCollection"
                                        name="title"
                                        placeholder={currCollection.title} />
                                    }
                                </FormattedMessage>
                                <ErrorMessage name="theme" component="span" />
                                <Field as="select" id="inputCreateCollection" name="theme">
                                    <FormattedMessage id="collection-theme.default">
                                        {(id) => <option value="" selected="selected" hidden >{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.alcohol">
                                        {(id) => <option value={id}>{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.boardgames">
                                        {(id) => <option value={id}>{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.books">
                                        {(id) => <option value={id}>{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.cars">
                                        {(id) => <option value={id}>{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.videogames">
                                        {(id) => <option value={id}>{id}</option>}
                                    </FormattedMessage>
                                </Field>
                                <div style={{ width: "90vw", maxWidth: 800 }}>
                                    <ReactMde
                                        value={freeText}
                                        onChange={setFreeText}
                                        selectedTab={selectedTab}
                                        onTabChange={setSelectedTab}
                                        generateMarkdownPreview={(markdown) =>
                                            Promise.resolve(converter.makeHtml(markdown))
                                        }
                                        childProps={{
                                            writeButton: {
                                                tabIndex: -1
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        
                        {!showAdditFields &&
                            <Button type="submit">
                                <FormattedMessage id="editcollection-page.submit" />
                            </Button>
                        }
                        <Grid item>
                            <Button onClick={() => setShowAdditFields(!showAdditFields)}>
                                {showAdditFields ?
                                    <FormattedMessage id="createcollection-page.hide-additional-fields" /> :
                                    <FormattedMessage id="createcollection-page.show-additional-fields" />
                                }
                            </Button>
                            <FormattedMessage id="createcollection-page.additional-fields-tooltip">
                                {(id) =>
                                    <Tooltip title={id} interactive>
                                        <IconButton style={{ width: 8, height: 8 }}>
                                            <HelpIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            </FormattedMessage>
                            
                        </Grid>
                        {showAdditFields &&
                            <>
                                <Grid item container justifyContent="center" alignItems="center" spacing={1}>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-number" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="numField1_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="numField2_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="numField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-string" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="stringField1_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="stringField2_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="stringField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-text" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="textField1_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="textField2_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="textField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-date" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="dateField1_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="dateField2_Name" />
                                        <Field autocomplete="off" id="inputAdditionalField" name="dateField3_Name" />
                                    </Grid>
                                </Grid>
                                <Button type="submit">
                                    <FormattedMessage id="editcollection-page.submit" />
                                </Button>
                            </> 
                        }
                    </Grid>
                </Form>
            </Formik>
        </div>
    );
}

export default EditCollection;