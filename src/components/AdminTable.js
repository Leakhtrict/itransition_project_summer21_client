import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Lock, LockOpen, Security, DeleteForever, Person } from '@material-ui/icons';

import { COLUMNS } from 'helpers';

const useStyles = makeStyles(() => ({
  buttonBar: {
    color: 'black',
  },
  mainTable: {
    height: 630,
    width: '100vw',
    maxWidth: 972,
    backgroundColor: 'white',
  }
}));

export const AdminTable = () => {
  const classes = useStyles();
  let history = useHistory();
  const [listOfUsers, setListOfUsers] = useState([]);
  const [listOfIds, setListOfIds] = useState([]);

  useEffect(() => {
      axios.get("https://itransition-project-genis.herokuapp.com/users")
      .then((response) => {
        setListOfUsers(response.data);
      });
  }, []);

  const deleteData = () => {
    axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
    { headers: { accessToken: localStorage.getItem("accessToken") } })
    .then((response) => {
      if (!response.data.error) {
        const deleteIds = listOfIds;
        axios.put("https://itransition-project-genis.herokuapp.com/users/deleteUsers", deleteIds)
        .then(() => {
          deleteIds.map((value) => {
            setListOfUsers(prevState => prevState.filter((user) => {
              return user.id !== value;
            }));
            return value;
          });
        });
      }
      else{
        history.push("/");
      }
    });
  };

  const blockUser = () => {
    axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
    { headers: { accessToken: localStorage.getItem("accessToken") } })
    .then((response) => {
      if (!response.data.error) {
        const blockIds = listOfIds;
        axios.put("https://itransition-project-genis.herokuapp.com/users/blockUsers", blockIds)
        .then(() => {
          blockIds.map((value) => {
            setListOfUsers(prevState => prevState.map((user) => {
              if(value === user.id){
                return {...user, isBlocked: true };
              } else {
                return user;
              }
            }));
            return value;
          });
        });
      }
      else{
        history.push("/");
      }
    });
  };

  const unblockUser = () => {
    axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
    { headers: { accessToken: localStorage.getItem("accessToken") } })
    .then((response) => {
      if (!response.data.error) {
        const unblockIds = listOfIds;
        axios.put("https://itransition-project-genis.herokuapp.com/users/unblockUsers", unblockIds)
        .then(() => {
          unblockIds.map((value) => {
            setListOfUsers(prevState => prevState.map((user) => {
              if(value === user.id){
                return {...user, isBlocked: false };
              } else {
                return user;
              }
            }));
            return value;
          });
        });
      }
      else{
        history.push("/");
      }
    });
  };

  const adminUser = () => {
    axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
    { headers: { accessToken: localStorage.getItem("accessToken") } })
    .then((response) => {
      if (!response.data.error) {
        const adminIds = listOfIds;
        axios.put("https://itransition-project-genis.herokuapp.com/users/adminUsers", adminIds)
        .then(() => {
          adminIds.map((value) => {
            setListOfUsers(prevState => prevState.map((user) => {
              if(value === user.id){
                return {...user, isAdmin: true };
              } else {
                return user;
              }
            }));
            return value;
          });
        });
      }
      else{
        history.push("/");
      }
    });
  };

  return(
    <>
      <div>
        <IconButton onClick={blockUser} title="Block" className={classes.buttonBar}>
          <Lock />
        </IconButton>
        <IconButton onClick={unblockUser} title="Unblock" className={classes.buttonBar}>
          <LockOpen />
        </IconButton>
        <IconButton onClick={adminUser} title="Set admin" className={classes.buttonBar}>
          <Security />
        </IconButton>
        <IconButton onClick={deleteData} title="Delete" className={classes.buttonBar}>
          <DeleteForever />
        </IconButton>
      </div>
      <div className={classes.mainTable} >
        <DataGrid
          rows={listOfUsers}
          columns={[...COLUMNS,
            {
              field: 'additional',
              headerName: 'Profile',
              sortable: false,
              width: 100,
              renderCell: (params) => {
                return (<Person onClick={() => { history.push(`/user/${params.getValue(params.id, 'id')}`) }} />)
              }
            }]
          }
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          disableColumnMenu
          onSelectionModelChange={itm => setListOfIds(itm)}
        />
      </div>
    </>
  );
};
