import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { COLUMNS } from "../helpers/columns";
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SecurityIcon from '@material-ui/icons/Security';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PersonIcon from '@material-ui/icons/Person';
import { DataGrid } from "@material-ui/data-grid";

function AdminTable() {
  let history = useHistory();
  const [listOfUsers, setListOfUsers] = useState([]);
  const [listOfIds, setListOfIds] = useState([]);

  useEffect(() => {
      axios.get("https://itransition-project-genis.herokuapp.com/users").then((response) => {
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
              return user.id != value;
            }))
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
              if(value == user.id){
                return {...user, isBlocked: true };
              } else {
                return user;
              }
            }))
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
              if(value == user.id){
                return {...user, isBlocked: false };
              } else {
                return user;
              }
            }))
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
              if(value == user.id){
                return {...user, isAdmin: true };
              } else {
                return user;
              }
            }))
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
      <div className="buttonBar">
        <LockIcon className="buttons" onClick={blockUser} title="Block" />
        <LockOpenIcon className="buttons" onClick={unblockUser} title="Unblock" />
        <SecurityIcon className="buttons" onClick={adminUser} title="Set admin" />
        <DeleteForeverIcon className="buttons" onClick={deleteData} title="Delete" />
      </div>
      <div style={{ height: 630, width: 972 }} >
        <DataGrid
          rows={listOfUsers}
          columns={[...COLUMNS,
            {
              field: 'additional',
              headerName: 'Profile',
              sortable: false,
              width: 100,
              renderCell: (params) => {
                return (<PersonIcon onClick={() => { history.push(`/user/${params.getValue(params.id, 'id')}`) }} />)
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

export default AdminTable;