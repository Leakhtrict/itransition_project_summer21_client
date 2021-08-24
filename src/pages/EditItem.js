import React, { useLayoutEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { FormattedMessage } from "react-intl";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function EditItem() {
    let { collectionId, itemId } = useParams();
    let history = useHistory();
    const [currentCollection, setCurrentCollection] = useState({});
    const [currentItem, setCurrentItem] = useState({});
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
    let alreadySelectedTags = [];

    useLayoutEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/byId/${collectionId}`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((response) => {
            if (response.data.error) {
                history.push("/login");
            } else if (response.data.collection.UserId !== response.data.userInfo.id && !response.data.userInfo.isAdmin) {
                history.push("/");
            }
            setCurrentCollection(response.data.collection);
        });

        axios.get(`https://itransition-project-genis.herokuapp.com/items/byId/${itemId}`).then((response) => {
            console.log(response.data);
            setCurrentItem(response.data);
            setFreeText1(response.data.textField1);
            setFreeText2(response.data.textField2);
            setFreeText3(response.data.textField3);
            setDate1(response.data.dateField1);
            setDate2(response.data.dateField2);
            setDate3(response.data.dateField3);
            const alreadySelected = response.data.tags.split(" ");
            alreadySelected.forEach((value) => {
                if (value !== ""){
                    alreadySelectedTags.push({ value: value, label: value});
                }
            });
            setSelectedTags(alreadySelectedTags);
        });

        axios.get("https://itransition-project-genis.herokuapp.com/tags").then((response) => {
            const getTags = response.data;
            getTags.map((value, key) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
            });
        });
    }, [collectionId, itemId])

    const initialValues = {
        name: currentItem.name,
        tags: currentItem.tags,
        numField1: currentItem.numField1 ? currentItem.numField1 : undefined,
        numField2: currentItem.numField2 ? currentItem.numField2 : undefined,
        numField3: currentItem.numField3 ? currentItem.numField3 : undefined,
        stringField1: currentItem.stringField1,
        stringField2: currentItem.stringField2,
        stringField3: currentItem.stringField3,
        textField1: currentItem.textField1,
        textField2: currentItem.textField2,
        textField3: currentItem.textField3,
        dateField1: currentItem.dateField1 ? currentItem.dateField1 : undefined,
        dateField2: currentItem.dateField2 ? currentItem.dateField2 : undefined,
        dateField3: currentItem.dateField3 ? currentItem.dateField3 : undefined,
        CollectionId: currentItem.CollectionId,
    };

    const onSubmit = (data) => {
        console.log(data);
        axios.post("https://itransition-project-genis.herokuapp.com/tags/addTags", selectedTags).then((response) => {
            if (response.data.error){
                alert(response.data.error);
            }
        });
        let tagsString = "";
        selectedTags.map((value, key) => {
            tagsString += value.label + " ";
        });
        data.tags = tagsString;
        data.textField1 = freeText1;
        data.textField2 = freeText2;
        data.textField3 = freeText3;
        data.dateField1 = date1;
        data.dateField2 = date2;
        data.dateField3 = date3;
        axios.post(`https://itransition-project-genis.herokuapp.com/items/editItem/${itemId}`, data).then(() => {
            history.push(`/collection/${collectionId}`);
        });
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required."),
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
        console.log(selectedTags);
        setSelectedTags(newValue);
    };

    return (
        <div className="createItem">
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form>
                    <div className="createItemMain">
                        <ErrorMessage name="name" component="span" />
                        <FormattedMessage id="createitem-page.name">
                            {(id) => 
                                <Field
                                autocomplete="off"
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
                                defaultValue={alreadySelectedTags}
                                options={listOfTags}
                                placeholder={id} />
                            }
                        </FormattedMessage>
                    </div>

                    <div className="createItemAdditional">
                        <div className="additFields">
                            {currentCollection.numField1_isVisible &&
                                <>
                                    <ErrorMessage name="numField1" component="span" />
                                    <Field
                                        autocomplete="off"
                                        id="inputCreateItem"
                                        name="numField1"
                                        placeholder={currentCollection.numField1_Name}
                                    />
                                </>
                            }
                            {currentCollection.numField2_isVisible &&
                                <>
                                    <ErrorMessage name="numField2" component="span" />
                                    <Field
                                        autocomplete="off"
                                        id="inputCreateItem"
                                        name="numField2"
                                        placeholder={currentCollection.numField2_Name}
                                    />
                                </>
                            }
                            {currentCollection.numField3_isVisible &&
                                <>
                                    <ErrorMessage name="numField3" component="span" />
                                    <Field
                                        autocomplete="off"
                                        id="inputCreateItem"
                                        name="numField3"
                                        placeholder={currentCollection.numField3_Name}
                                    />
                                </>
                            }
                        </div>
                        <div className="additFields">
                            {currentCollection.stringField1_isVisible &&
                                <Field
                                    autocomplete="off"
                                    id="inputCreateItem"
                                    name="stringField1"
                                    placeholder={currentCollection.stringField1_Name}
                                />
                            }
                            {currentCollection.stringField2_isVisible &&
                                <Field
                                    autocomplete="off"
                                    id="inputCreateItem"
                                    name="stringField2"
                                    placeholder={currentCollection.stringField2_Name}
                                />
                            }
                            {currentCollection.stringField3_isVisible &&
                                <Field
                                    autocomplete="off"
                                    id="inputCreateItem"
                                    name="stringField3"
                                    placeholder={currentCollection.stringField3_Name}
                                />
                            }
                        </div>
                        <div className="additFields">
                            {currentCollection.dateField1_isVisible &&
                                <>
                                    <label>{currentCollection.dateField1_Name}</label>
                                    <Field as="input"
                                        type="date"
                                        id="inputCreateItem"
                                        name="dateField1"
                                        value={date1.toISOString().split("T")[0]}
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
                                        value={date2.toISOString().split("T")[0]}
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
                                        value={date3.toISOString().split("T")[0]}
                                        onChange={(event) => {setDate3(event.target.value)}}
                                    />
                                </>
                            }
                        </div>
                    </div>
                    {currentCollection.textField1_isVisible &&
                        <div className="inputTextCreateItem">
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
                        <div className="inputTextCreateItem">
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
                        <div className="inputTextCreateItem">
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

                    <button id="createItemSubmit" type="submit">
                        <FormattedMessage id="edititem-page.submit" />
                    </button>
                </Form>
            </Formik>
        </div>
    );
}

export default EditItem;
