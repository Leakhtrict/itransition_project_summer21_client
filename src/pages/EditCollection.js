import React, { useLayoutEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { IconButton, Button, Grid, Tooltip } from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageDropzone from "../components/ImageDropzone";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function EditCollection() {
    let { id } = useParams();
    const [freeText, setFreeText] = useState("");
    const [selectedTab, setSelectedTab] = useState("write");
    const [currCollection, setCurrCollection] = useState({});
    const [showAdditFields, setShowAdditFields] = useState(false);
    const [imageToUpload, setImageToUpload] = useState({});
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
        imageURL: currCollection.imageURL,
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

    const onSubmit = async (data) => {
        if(imageToUpload.name && !imageToUpload.error){
            const uploadData = new FormData();
            uploadData.append("file", imageToUpload, "file");
            await axios.post("https://itransition-project-genis.herokuapp.com/cloudinaryUpload", uploadData)
            .then((response) => {
                data.imageURL = response.data.secure_url;
            });
        } else{
            data.imageURL = currCollection.imageURL;
        }
        data.description = freeText;
        axios.post(`https://itransition-project-genis.herokuapp.com/collections/${id}/editCollection`, data).then(() => {
            history.push(`/user/${currCollection.UserId}`);
        });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().max(240),
        theme: Yup.string().required(),
    });

    const deleteImage = () => {
        setCurrCollection({...currCollection, imageURL: "" });
    };

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
                                <ErrorMessage name="title" render={msg => 
                                    <span id="formError">
                                        <FormattedMessage id="createcollection-page.title.error"/>
                                    </span>
                                }/>
                                <FormattedMessage id="createcollection-page.title">
                                    {(id) => 
                                        <Field
                                        autoComplete="off"
                                        id="inputCreateCollection"
                                        name="title"
                                        placeholder={currCollection.title} />
                                    }
                                </FormattedMessage>
                                <ErrorMessage name="theme" render={msg => 
                                    <span id="formError">
                                        <FormattedMessage id="createcollection-page.theme.error"/>
                                    </span>
                                }/>
                                <Field as="select" id="inputCreateCollection" name="theme">
                                <FormattedMessage id="collection-theme.default">
                                        {(id) => <option value="" selected="selected" hidden >{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.alcohol">
                                        {(id) => <option value="collection-theme.alcohol">{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.boardgames">
                                        {(id) => <option value="collection-theme.boardgames">{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.books">
                                        {(id) => <option value="collection-theme.books">{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.cars">
                                        {(id) => <option value="collection-theme.cars">{id}</option>}
                                    </FormattedMessage>
                                    <FormattedMessage id="collection-theme.videogames">
                                        {(id) => <option value="collection-theme.videogames">{id}</option>}
                                    </FormattedMessage>
                                </Field>
                                {(imageToUpload.error === "tooManyFiles") &&
                                    <span id="formError" style={{ marginBottom: -10 }}>
                                        <FormattedMessage id="createcollection-page.dropzone.error.tooManyFiles"/>
                                    </span>
                                }
                                {(imageToUpload.error === "wrongInput") && 
                                    <span id="formError" style={{ marginBottom: -10 }}>
                                        <FormattedMessage id="createcollection-page.dropzone.error.wrongInput"/>
                                    </span>
                                }
                                {(currCollection.imageURL !== "") ?
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <IconButton onClick={deleteImage} style={{ color: "black", width: 32, height: 32 }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <img src={currCollection.imageURL} style={{ maxWidth: 200, maxHeight: 200, marginBottom: 8 }}/>
                                    </div> :
                                    <ImageDropzone setImageToUpload={setImageToUpload} />
                                }
                                {(freeText.length > 240) &&
                                    <span id="formError" style={{ marginBottom: 10 }}>
                                        <FormattedMessage id="createcollection-page.description.error"/>
                                    </span>
                                }
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
                            <Button id="submitButton" type="submit">
                                <FormattedMessage id="editcollection-page.submit" />
                            </Button>
                        }
                        <Grid item style={{ marginBottom: 8 }}>
                            <Button id="submitButton" onClick={() => setShowAdditFields(!showAdditFields)} style={{ marginLeft: 24 }}>
                                {showAdditFields ?
                                    <FormattedMessage id="createcollection-page.hide-additional-fields" /> :
                                    <FormattedMessage id="createcollection-page.show-additional-fields" />
                                }
                            </Button>
                            <FormattedMessage id="createcollection-page.additional-fields-tooltip">
                                {(id) =>
                                    <Tooltip title={id} interactive>
                                        <IconButton style={{ maxWidth: 20, maxHeight: 20, color: "red" }}>
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
                                        <Field autoComplete="off" id="inputAdditionalField" name="numField1_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="numField2_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="numField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-string" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="stringField1_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="stringField2_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="stringField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-text" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="textField1_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="textField2_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="textField3_Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center">
                                        <FormattedMessage id="createcollection-page.additional-date" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="dateField1_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="dateField2_Name" />
                                        <Field autoComplete="off" id="inputAdditionalField" name="dateField3_Name" />
                                    </Grid>
                                </Grid>
                                <Button id="submitButton" type="submit" style={{ marginBottom: 12 }}>
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