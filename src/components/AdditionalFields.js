import React from 'react';
import { Grid } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

export const AdditionalFields = ({ fromCollection, itemBody, classes }) => (
    <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" style={{ marginTop: 16 }}>
        <Grid item container direction="column" className={classes.otherFields} spacing={1}>
            {fromCollection.numField1_isVisible &&
                <Grid item>
                    {fromCollection.numField1_Name + ": " + itemBody.numField1}
                </Grid>
            }
            {fromCollection.numField2_isVisible &&
                <Grid item>
                    {fromCollection.numField2_Name + ": " + itemBody.numField2}
                </Grid>
            }
            {fromCollection.numField3_isVisible &&
                <Grid item>
                    {fromCollection.numField3_Name + ": " + itemBody.numField3}
                </Grid>
            }
            {fromCollection.stringField1_isVisible &&
                <Grid item>
                    {fromCollection.stringField1_Name + ": " + itemBody.stringField1}
                </Grid>
            }
            {fromCollection.stringField2_isVisible &&
                <Grid item>
                    {fromCollection.stringField2_Name + ": " + itemBody.stringField2}
                </Grid>
            }
            {fromCollection.stringField3_isVisible &&
                <Grid item>
                    {fromCollection.stringField3_Name + ": " + itemBody.stringField3}
                </Grid>
            }
            {fromCollection.dateField1_isVisible &&
                <Grid item>
                    {fromCollection.dateField1_Name + ": " + new Date(itemBody.dateField1).toLocaleString().split(",")[0]}
                </Grid>
            }
            {fromCollection.dateField2_isVisible &&
                <Grid item>
                    {fromCollection.dateField2_Name + ": " + new Date(itemBody.dateField2).toLocaleString().split(",")[0]}
                </Grid>
            }
            {fromCollection.dateField3_isVisible &&
                <Grid item>
                    {fromCollection.dateField3_Name + ": " + new Date(itemBody.dateField3).toLocaleString().split(",")[0]}
                </Grid>
            }
        </Grid>
        <Grid item container direction="row" spacing={1}>
            {fromCollection.textField1_isVisible &&
                <Grid item className={classes.textField}>
                    <strong>{fromCollection.textField1_Name}</strong>
                    <hr />
                    <ReactMarkdown>{itemBody.textField1}</ReactMarkdown>
                </Grid>
            }
            {fromCollection.textField2_isVisible &&
                <Grid item className={classes.textField}>
                    <strong>{fromCollection.textField2_Name}</strong>
                    <hr />
                    <ReactMarkdown>{itemBody.textField2}</ReactMarkdown>
                </Grid>
            }
            {fromCollection.textField3_isVisible &&
                <Grid item className={classes.textField}>
                    <strong>{fromCollection.textField3_Name}</strong>
                    <hr />
                    <ReactMarkdown>{itemBody.textField3}</ReactMarkdown>
                </Grid>
            }
        </Grid>
    </Grid>
)
