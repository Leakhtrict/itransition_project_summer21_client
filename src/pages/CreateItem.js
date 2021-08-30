import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { FormattedMessage } from "react-intl";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import { Button, Grid } from "@material-ui/core";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function CreateItem() {
    let { id } = useParams();
    let history = useHistory();
    const [currentCollection, setCurrentCollection] = useState({});
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [freeText1, setFreeText1] = useState("");
    const [selectedTab1, setSelectedTab1] = useState("write");
    const [freeText2, setFreeText2] = useState("");
    const [selectedTab2, setSelectedTab2] = useState("write");
    const [freeText3, setFreeText3] = useState("");
    const [selectedTab3, setSelectedTab3] = useState("write");
    const [date1, setDate1] = useState();
    const [date2, setDate2] = useState();
    const [date3, setDate3] = useState();

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/byId/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
            if (response.data.error) {
                localStorage.removeItem("accessToken");
                history.push("/login");
            } else if (response.data.collection.UserId !== response.data.userInfo.id && !response.data.userInfo.isAdmin) {
                history.push("/");
            }
            setCurrentCollection(response.data.collection);
        });

        axios.get("https://itransition-project-genis.herokuapp.com/tags")
        .then((response) => {
            const getTags = response.data;
            getTags.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
                return value;
            });
        });
    }, [id])

    const initialValues = {
        name: "",
        tags: "",
        numField1: undefined,
        numField2: undefined,
        numField3: undefined,
        stringField1: "",
        stringField2: "",
        stringField3: "",
        textField1: "",
        textField2: "",
        textField3: "",
        dateField1: undefined,
        dateField2: undefined,
        dateField3: undefined,
    };

    const onSubmit = (data) => {
        axios.post("https://itransition-project-genis.herokuapp.com/tags/addTags", selectedTags)
        .then((response) => {
            if (response.data.error){
                alert(response.data.error);
            }
        });
        let tagsString = "";
        selectedTags.map((value) => {
            tagsString += value.label + " ";
            return value;
        });
        data.tags = tagsString;
        data.textField1 = freeText1;
        data.textField2 = freeText2;
        data.textField3 = freeText3;
        data.dateField1 = date1;
        data.dateField2 = date2;
        data.dateField3 = date3;
        axios.post(`https://itransition-project-genis.herokuapp.com/items/createItem/${id}`, data)
        .then(() => {
            history.push(`/collection/${id}`);
        });
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(),
        numField1: Yup.number(),
        numField2: Yup.number(),
        numField3: Yup.number(),
        stringField1: Yup.string(),
        stringField2: Yup.string(),
        stringField3: Yup.string(),
        dateField1: Yup.date(),
        dateField2: Yup.date(),
        dateField3: Yup.date(),
    });

    const onTagsChange = (newValue) => {
        setSelectedTags(newValue);
    };

    return (
        <div className="createItem">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <Grid container direction="column" alignItems="center" spacing={1}>
                        <Grid item>
                            <div className="createItemMain">
                                <ErrorMessage name="name" render={msg =>
                                    <span id="formError">
                                        <FormattedMessage id="createitem-page.name.error"/>
                                    </span>
                                }/>
                                <FormattedMessage id="createitem-page.name">
                                    {(id) => 
                                        <Field
                                        autoComplete="off"
                                        id="inputCreateItem"
                                        name="name"
                                        placeholder={id} />
                                    }
                                </FormattedMessage>
                                <FormattedMessage id="createitem-page.tags">
                                    {(id) =>
                                        <CreatableSelect 
                                        isMulti
                                        id="inputCreateItemTags"
                                        onChange={onTagsChange}
                                        onInputChange={(e) => {
                                            return e.replace(" ", '');
                                        }}
                                        options={listOfTags}
                                        placeholder={id} />
                                    }
                                </FormattedMessage>
                            </div>
                        </Grid>
                        <Grid item container justifyContent="center" alignItems="center">
                            <div className="additItemFields">
                                {currentCollection.numField1_isVisible &&
                                    <>
                                        <label>{currentCollection.numField1_Name}</label>
                                        <ErrorMessage name="numField1" render={msg =>
                                            <span id="formError">
                                                <FormattedMessage id="createitem-page.numField.error"/>
                                            </span>
                                        }/>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="numField1"
                                            placeholder="..."
                                        />
                                    </>
                                }
                                {currentCollection.numField2_isVisible &&
                                    <>
                                        <label>{currentCollection.numField2_Name}</label>
                                        <ErrorMessage name="numField2" render={msg =>
                                            <span id="formError">
                                                <FormattedMessage id="createitem-page.numField.error"/>
                                            </span>
                                        }/>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="numField2"
                                            placeholder="..."
                                        />
                                    </>
                                }
                                {currentCollection.numField3_isVisible &&
                                    <>
                                        <label>{currentCollection.numField3_Name}</label>
                                        <ErrorMessage name="numField3" render={msg =>
                                            <span id="formError">
                                                <FormattedMessage id="createitem-page.numField.error"/>
                                            </span>
                                        }/>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="numField3"
                                            placeholder="..."
                                        />
                                    </>
                                }
                            </div>
                            <div className="additItemFields">
                                {currentCollection.stringField1_isVisible &&
                                    <> 
                                        <label>{currentCollection.stringField1_Name}</label>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="stringField1"
                                            placeholder="..."
                                        />
                                    </>
                                }
                                {currentCollection.stringField2_isVisible &&
                                    <> 
                                        <label>{currentCollection.stringField2_Name}</label>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="stringField2"
                                            placeholder="..."
                                        />
                                    </>
                                }
                                {currentCollection.stringField3_isVisible &&
                                    <> 
                                        <label>{currentCollection.stringField3_Name}</label>
                                        <Field
                                            autoComplete="off"
                                            id="inputCreateItem"
                                            name="stringField3"
                                            placeholder="..."
                                        />
                                    </>
                                }
                            </div>
                            <div className="additItemFields">
                                {currentCollection.dateField1_isVisible &&
                                    <>
                                        <label>{currentCollection.dateField1_Name}</label>
                                        <Field as="input"
                                            type="date"
                                            id="inputCreateItem"
                                            name="dateField1"
                                            value={date1}
                                            onChange={(event) => {setDate1(event.target.value)}}
                                        />
                                    </>
                                }
                                {currentCollection.dateField2_isVisible &&
                                    <>
                                        <label>{currentCollection.dateField2_Name}</label>
                                        <Field as="input"
                                            type="date"
                                            id="inputCreateItem"
                                            name="dateField2"
                                            value={date2}
                                            onChange={(event) => {setDate2(event.target.value)}}
                                        />
                                    </>
                                }
                                {currentCollection.dateField3_isVisible &&
                                    <>
                                        <label>{currentCollection.dateField3_Name}</label>
                                        <Field as="input"
                                            type="date"
                                            id="inputCreateItem"
                                            name="dateField3"
                                            value={date3}
                                            onChange={(event) => {setDate3(event.target.value)}}
                                        />
                                    </>
                                }
                            </div>
                        </Grid>
                        <Grid item>
                            {currentCollection.textField1_isVisible &&
                                <div style={{ width: "90vw", maxWidth: 800, marginBottom: 8 }}>
                                    <label>{currentCollection.textField1_Name}</label>
                                    <ReactMde
                                        value={freeText1}
                                        onChange={setFreeText1}
                                        selectedTab={selectedTab1}
                                        onTabChange={setSelectedTab1}
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
                            }
                            {currentCollection.textField2_isVisible && 
                                <div style={{ width: "90vw", maxWidth: 800, marginBottom: 8 }}>
                                    <label>{currentCollection.textField2_Name}</label>
                                    <ReactMde
                                        value={freeText2}
                                        onChange={setFreeText2}
                                        selectedTab={selectedTab2}
                                        onTabChange={setSelectedTab2}
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
                            }
                            {currentCollection.textField3_isVisible && 
                                <div style={{ width: "90vw", maxWidth: 800, marginBottom: 8 }}>
                                    <label>{currentCollection.textField3_Name}</label>
                                    <ReactMde
                                        value={freeText3}
                                        onChange={setFreeText3}
                                        selectedTab={selectedTab3}
                                        onTabChange={setSelectedTab3}
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
                            }
                        </Grid>
                        <Button id="submitButton" type="submit" style={{ marginBottom: 12 }}>
                            <FormattedMessage id="createitem-page.submit" />
                        </Button>
                    </Grid>
                </Form>
            </Formik>
        </div>
    );
}

export default CreateItem;
